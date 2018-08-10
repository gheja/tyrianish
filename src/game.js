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
		
		bindEvent(window, "resize", this.onResize.bind(this));
		bindEvent(window, "oreintationchange", this.onResize.bind(this));
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
	
	tick()
	{
		let i;
		
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
		let map, tiles_json, tiles_img, second_img, a, ax, ay, bx, by, cx, cy, playerx, playery, x, y, i;
		
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
		
		map = _loader.get("map_level1").data;
		tiles_json = _loader.get("tileset2_json").data;
		tiles_img = _loader.get("terrain_png").image;
		second_img = _loader.get("second_png").image;
		
		playerx = Math.floor(Math.sin(this.ticks / 40) * 24) + 24;
		playery = Math.floor(Math.sin(this.ticks / 59) * 6) + 46;
		
		ax = Math.floor(Math.floor(this.ax) / 16);
		ay = Math.floor(Math.floor(this.ay) / 16);
		
		cx = Math.floor(this.ax) % 16;
		cy = Math.floor(this.ay) % 16;
		
		
		for (y=0; y<6; y++)
		{
			for (x=0; x<6; x++)
			{
				a = map.layers[0].data[(ay + y) * map.layers[0].width + ax + x];
				a = a - map.tilesets[0].firstgid;
				bx = a % tiles_json.columns;
				by = Math.floor(a / tiles_json.columns);
				
				_gfx.drawTile(tiles_img, bx, by, x * 16 - cx, y * 16 - cy);
			}
		}
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 3) * 24) + 28;
		cy = 6;
		
		_gfx.drawTile(second_img, 2, 1, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 3.5) * 24) + 28;
		cy = 12;
		
		_gfx.drawTile(second_img, 2, 1, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 4) * 24) + 28;
		cy = 18;
		
		_gfx.drawTile(second_img, 2, 1, cx, cy);
		
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
