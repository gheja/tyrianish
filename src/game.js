"use strict";

class Game
{
	constructor()
	{
		this.lastTickTime = 0;
		this.ticks = 0;
		this.canvasResizeNeeded = true;
		
		this.ax = 16;
		this.ay = 96 * 16;
		
		bindEvent(window, "resize", this.onResize.bind(this));
		bindEvent(window, "oreintationchange", this.onResize.bind(this));
	}
	
	onLoaderFinished()
	{
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
		this.ticks++;
		
		if (this.ticks % 3 == 0)
		{
			this.ay--;
		}
	}
	
	draw()
	{
		let map, tiles_json, tiles_img, second_img, a, ax, ay, bx, by, cx, cy, playerx, playery, x, y;
		
		if (this.canvasResizeNeeded)
		{
			_gfx.resizeCanvas();
			this.canvasResizeNeeded = false;
		}
		
		_gfx.clear();
		
		if (!_loader.finished)
		{
			return;
		}
		
		map = _loader.get("map_level1").data;
		tiles_json = _loader.get("tileset2_json").data;
		tiles_img = _loader.get("terrain_png").image;
		second_img = _loader.get("second_png").image;
		
		playerx = Math.floor(Math.sin(this.ticks / 40) * 24) + 24;
		playery = Math.floor(Math.sin(this.ticks / 59) * 6) + 46;
		
		// this.ax = 0 + Math.floor(playerx / 4);
		
		ax = Math.floor(this.ax / 16);
		ay = Math.floor(this.ay / 16);
		
		cx = this.ax % 16;
		cy = this.ay % 16;
		
		
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
		
		cx = playerx;
		cy = playery;
		
		_gfx.drawTile(second_img, 0, 0, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 3) * 24) + 28;
		cy = 6;
		
		_gfx.drawTile(second_img, 2, 1, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 3.5) * 24) + 28;
		cy = 12;
		
		_gfx.drawTile(second_img, 2, 1, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 4) * 24) + 28;
		cy = 18;
		
		_gfx.drawTile(second_img, 2, 1, cx, cy);
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
