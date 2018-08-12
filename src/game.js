"use strict";

let _gfxObjects = new Store();
let _gameObjects = new Store();

function initGfxObjects()
{
	let i, a;
	
	a = _loader.get("resources_gfxobjects_json").data;
	
	for (i in a)
	{
		_gfxObjects.add(i, new GfxObject(a[i]));
	}
}

class Game
{
	constructor()
	{
		this.lastTickTime = 0;
		this.ticks = 0;
		this.canvasResizeNeeded = true;
		
		this.players = [];
		this.objects = [];
		
		this.ax = 16;
		this.ay = 96 * 16;
		
		this.level = null;
		
		bindEvent(window, "resize", this.onResize.bind(this));
		bindEvent(window, "oreintationchange", this.onResize.bind(this));
	}
	
	loadLevel(name)
	{
		let a, i;
		
		a = _loader.get(name).data;
		
		for (i=0; i<a.objects.length; i++)
		{
			a.objects[i].id = uniqueId();
		}
		
		a.mapJson = _loader.get(a.mapJsonName).data;
		a.tilesetJson = _loader.get(a.tilesetJsonName).data;
		a.tilesetImage = _loader.get(a.tilesetImageName).image;
		
		this.level = a;
	}
	
	doCollisionHandling(a, b)
	{
		if (a instanceof GameObjectProjectile && b instanceof GameObjectProjectile)
		{
			return;
		}
		
		if (a instanceof GameObjectProjectile)
		{
			b.handleHitBy(a);
		}
		else
		{
			a.handleHitBy(b);
		}
	}
	
	doHitboxCheck()
	{
		let i, j, max, a, b;
		
		max = this.objects.length;
		
		for (i=0; i<max; i++)
		{
			this.objects[i].updateHitCheckArray();
		}
		
		for (i=0; i<max; i++)
		{
			a = this.objects[i];
			
			if (!a.hitCheckArrayValid)
			{
				continue;
			}
			
			for (j=i+1; j<max; j++)
			{
				b = this.objects[j];
				
				if (!b.hitCheckArrayValid)
				{
					continue;
				}
				
				// no friendly fire
				if (a.hitCheckGroup == b.hitCheckGroup)
				{
					continue;
				}
				
				if (a.hitCheckArray[0] <= b.hitCheckArray[2] &&
					a.hitCheckArray[2] >= b.hitCheckArray[0] &&
					a.hitCheckArray[1] <= b.hitCheckArray[3] &&
					a.hitCheckArray[3] >= b.hitCheckArray[1])
				{
					this.doCollisionHandling(a, b);
				}
			}
		}
	}
	
	onLoaderFinished()
	{
		initGfxObjects();
		
		this.players[0] = new GameObjectPlayerOne();
		this.players[0].input = _inputs[1];
		this.players[0].playerIndex = 0;
		this.players[0].screenX = 16;
		this.players[0].screenY = 56;
		this.objects.push(this.players[0]);
		
		this.players[1] = new GameObjectPlayerOne();
		this.players[1].input = _inputs[0];
		this.players[1].playerIndex = 1;
		this.players[1].screenX = 48;
		this.players[1].screenY = 56;
		this.objects.push(this.players[1]);
		
		this.objects.push(new GameObjectEnemy({ startDelayTicksLeft: 0, screenX: 32, screenY: -10 }));
		this.objects.push(new GameObjectEnemy({ startDelayTicksLeft: 50, screenX: 32, screenY: -20 }));
		this.objects.push(new GameObjectEnemy({ startDelayTicksLeft: 100, screenX: 32, screenY: -30 }));
		this.objects.push(new GameObjectEnemy({ startDelayTicksLeft: 150, screenX: 32, screenY: -40 }));
		this.objects.push(new GameObjectEnemy({ startDelayTicksLeft: 200, screenX: 32, screenY: -50, gfxObject: _gfxObjects.get("enemy2") }));
		
		this.loadLevel("level_json");
		
		console.log("Load finished.");
	}
	
	onLoaderFailed()
	{
		console.log("Load failed.");
	}
	
	onResize()
	{
		this.canvasResizeNeeded = true;
	}
	
	getObjectAt(x, y)
	{
		let i, o, distance;
		
		for (i=0; i<this.objects.length; i++)
		{
			o = this.objects[i];
			
			if (o.destroyed)
			{
				continue;
			}
			
			distance = Math.sqrt(Math.pow(o.screenX - x, 2) + Math.pow(o.screenY - y, 2));
			
			if (distance < 2)
			{
				return o;
			}
		}
		
		return null;
	}
	
	editTick()
	{
		let a, b, c;
		
		a = _inputs[0].query();
		
		if (a.x == 1)
		{
			_debug.editX += 1 / 3;
		}
		else if (a.x == -1)
		{
			_debug.editX -= 1 / 3;
		}
		
		if (a.y == 1)
		{
			_debug.editY += 1 / 3;
		}
		else if (a.y == -1)
		{
			_debug.editY -= 1 / 3;
		}
		
		c = this.getObjectAt(Math.round(_debug.editX - this.ax), Math.round(_debug.editY - this.ay));
		
		_debug.editHoveredObject = c;
		
		if (a.shoot)
		{
			_debug.editSelectedObject = _debug.editHoveredObject;
		}
		
		_debug.editX = clamp(this.ax, this.ax + WIDTH, _debug.editX);
		_debug.editY = clamp(this.ay, this.ay + HEIGHT, _debug.editY);
	}
	
	tick()
	{
		let i;
		
		if (_debug.editing)
		{
			this.editTick();
			return;
		}
		
		if (_debug.paused)
		{
			return;
		}
		
		if (_debug.slow)
		{
			_debug.slowCounter++;
			
			if (_debug.slowCounter % 10 != 0)
			{
				return;
			}
		}
		
		this.ticks++;
		
		if (!_loader.finished)
		{
			return;
		}
		
		this.ay -= _flowSpeed / FPS;
		
		for (i in this.objects)
		{
			this.objects[i].tick();
		}
		
		this.doHitboxCheck();
	}
	
	draw()
	{
		let a, ax, ay, bx, by, cx, cy, x, y, i;
		
		if (this.canvasResizeNeeded)
		{
			_gfx.resizeCanvas();
			this.canvasResizeNeeded = false;
		}
		
		_gfx.clear();
		
		if (!_loader.finished)
		{
			_gfx.drawLoaderBar(_loader.getProgress());
			return;
		}
		
		ax = Math.floor(Math.floor(this.ax) / 16);
		ay = Math.floor(Math.floor(this.ay) / 16);
		
		cx = Math.floor(this.ax) % 16;
		cy = Math.floor(this.ay) % 16;
		
		
		for (y=0; y<6; y++)
		{
			for (x=0; x<6; x++)
			{
				a = this.level.mapJson.layers[0].data[(ay + y) * this.level.mapJson.layers[0].width + ax + x];
				a = a - this.level.mapJson.tilesets[0].firstgid;
				bx = a % this.level.tilesetJson.columns;
				by = Math.floor(a / this.level.tilesetJson.columns);
				
				_gfx.drawTile(this.level.tilesetImage, bx, by, x * 16 - cx, y * 16 - cy);
			}
		}
		
		if (_debug.editing)
		{
			for (x=0; x<18; x++)
			{
				for (y=0; y<20; y++)
				{
					_gfx.drawBox(2 + x * 4 - cx, y * 4 - cy, 1, 1, "rgba(255, 255, 255, 0.2)");
				}
			}
			
		}
		
		for (i in this.objects)
		{
			if (this.objects[i] instanceof GameObjectPlayerOne)
			{
				this.objects[i].drawBars();
			}
		}
		
		for (i in this.objects)
		{
			this.objects[i].draw();
		}
		
		if (_debug.editing)
		{
			a = _debug.editHoveredObject;
			
			if (a)
			{
				_gfx.drawBox(a.screenX - a.gfxObject.screenPadX + a.gfxObject.hitboxX, a.screenY - a.gfxObject.screenPadY + a.gfxObject.hitboxY, a.gfxObject.hitboxWidth, a.gfxObject.hitboxHeight, "rgba(0,255,0,0.5)");
			}
			
			a = _debug.editSelectedObject;
			
			if (a)
			{
				_gfx.drawBox(a.screenX - a.gfxObject.screenPadX + a.gfxObject.hitboxX, a.screenY - a.gfxObject.screenPadY + a.gfxObject.hitboxY, a.gfxObject.hitboxWidth, a.gfxObject.hitboxHeight, "rgba(255,255,255,0.5)");
			}
			
			_gfx.drawBox(_debug.editX - 1 - this.ax, _debug.editY - 1 - this.ay, 3, 3, "rgba(255, 255, 0, 0.6)");
		}
	}
	
	timer()
	{
		let i, now;
		
		now = (new Date()).getTime();
		
		while (this.lastTickTime < now)
		{
			this.lastTickTime += 1000 / FPS;
			this.tick();
		}
		
		_stats.begin();
		this.draw();
		_stats.end();
		
		window.requestAnimationFrame(this.timer.bind(this));
	}
	
	start()
	{
		this.lastTickTime = (new Date()).getTime();
		this.timer();
	}
}
