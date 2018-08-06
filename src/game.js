class Game
{
	constructor(canvas_id)
	{
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
		this.zoomLevel = 1;
		this.pixelRatio = 1;
		this.lastTickTime = 0;
		this.ticks = 0;
		
		this.ax = 16;
		this.ay = 96 * 16;
		
		bindEvent(window, "resize", this.onResize.bind(this));
		bindEvent(window, "oreintationchange", this.onResize.bind(this));
		this.onResize();
		this.setPixelRatio();
	}
	
	setPixelRatio()
	{
		let dpr, bsr;
		
		dpr = window.devicePixelRatio || 1;
		
		bsr = this.ctx.webkitBackingStorePixelRatio ||
			this.ctx.mozBackingStorePixelRatio ||
			this.ctx.msBackingStorePixelRatio ||
			this.ctx.oBackingStorePixelRatio ||
			this.ctx.backingStorePixelRatio || 1;
		
		this.pixelRatio = dpr / bsr;
	}
	
	fixCanvasContextSmoothing(ctx)
	{
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
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
		var scale, w, h, tmp;
		
		tmp = this.zoomLevel;
		
		this.zoomLevel = Math.max(Math.min(Math.floor(window.innerWidth / WIDTH), Math.floor(window.innerHeight / HEIGHT)), 0.5);
		
		if (this.zoomLevel * this.pixelRatio < 1)
		{
			this.zoomLevel = 1;
			
		}
		
		w = WIDTH * this.zoomLevel;
		h = HEIGHT * this.zoomLevel;
		
		// I just _really_ love the hiDPI display hacks...
		this.canvas.width = w * this.pixelRatio;
		this.canvas.height = h * this.pixelRatio;
		
		this.fixCanvasContextSmoothing(this.ctx);
		
		this.canvas.style.width = w;
		this.canvas.style.height = h;
		
		this.canvas.style.left = (window.innerWidth - w) / 2;
		this.canvas.style.top = (window.innerHeight - h) / 2;
	}
	
	tick()
	{
		this.ticks++;
		
		if (this.ticks % 3 == 0)
		{
			this.ay--;
		}
	}
	
	drawTileAdvanced2(sctx, sx, sy, sw, sh, dx, dy, dw, dh, rotated, mirrored, colors)
	{
		var dctx
		dctx = this.ctx;
		
		sx *= 16;
		sy *= 16;
		sw *= 16;
		sh *= 16;
		
		dx = _z(dx);
		dy = _z(dy);
		dw = _z(dw);
		dh = _z(dh);
		
		dctx.save();
		dctx.translate(dx, dy);
		dctx.translate(dw / 2, dh / 2);
		if (rotated)
		{
			dctx.rotate(- Math.PI / 2);
		}
		if (mirrored)
		{
			dctx.scale(-1, 1);
		}
		dctx.drawImage(sctx, sx, sy, sw, sh, - dw / 2, - dh / 2, dw, dh);
		dctx.restore();
		
		/*
		if (colors)
		{
			this.replaceColor(dctx, dx, dy, dw, dh, [ 200, 200, 20 ], colors[0]);
			this.replaceColor(dctx, dx, dy, dw, dh, [ 200, 200, 120 ], colors[1]);
			this.replaceColor(dctx, dx, dy, dw, dh, [ 200, 200, 220 ], colors[2]);
		}
		*/
	}
	
	// drawImageAdvanced(sctx, sx, sy, sw, sh, dx, dy, dw, dh, rotated, mirrored, colors)
	// drawImageAdvanced(sctx, sx, sy, sw, sh, dx, dy, rotated, mirrored, colors)
	drawTileAdvanced(sctx, sx, sy, dx, dy, rotated, mirrored, colors)
	{
		this.drawTileAdvanced2(sctx, sx, sy, 1, 1, dx, dy, 16, 16, rotated, mirrored, colors);
	}
	
	drawTile(sctx, sx, sy, dx, dy)
	{
		this.drawTileAdvanced2(sctx, sx, sy, 1, 1, dx, dy, 16, 16, false, false, null);
	}
	
	draw()
	{
		let map, tiles_json, tiles_img, second_img, a, ax, ay, bx, by, cx, cy, playerx, playery, x, y;
		
		this.ctx.fillStyle = "#235";
		this.ctx.fillRect(0, 0, _z(WIDTH), _z(HEIGHT));
		
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(_z(Math.floor(this.ticks / 3) % 64), 0, _z(1), _z(1));
		
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
				
				this.drawTile(tiles_img, bx, by, x * 16 - cx, y * 16 - cy);
			}
		}
		
		cx = playerx;
		cy = playery;
		
		this.drawTile(second_img, 0, 0, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 3) * 24) + 28;
		cy = 6;
		
		this.drawTile(second_img, 2, 1, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 3.5) * 24) + 28;
		cy = 12;
		
		this.drawTile(second_img, 2, 1, cx, cy);
		
		cx = Math.floor(Math.sin(this.ticks / 30 + 4) * 24) + 28;
		cy = 18;
		
		this.drawTile(second_img, 2, 1, cx, cy);
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
