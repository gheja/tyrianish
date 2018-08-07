"use strict";

class Gfx
{
	constructor(canvas_id)
	{
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
		this.zoomLevel = 1;
	}
	
	fixCanvasContextSmoothing(ctx)
	{
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
	}
	
	resizeCanvas()
	{
		let scale, w, h, dpr, bsr, pixelRatio, tmp;
		
		dpr = window.devicePixelRatio || 1;
		
		bsr = this.ctx.webkitBackingStorePixelRatio ||
			this.ctx.mozBackingStorePixelRatio ||
			this.ctx.msBackingStorePixelRatio ||
			this.ctx.oBackingStorePixelRatio ||
			this.ctx.backingStorePixelRatio || 1;
		
		pixelRatio = dpr / bsr;
		
		this.zoomLevel = Math.max(Math.min(Math.floor(window.innerWidth / WIDTH), Math.floor(window.innerHeight / HEIGHT)), 0.5);
		
		if (this.zoomLevel * pixelRatio < 1)
		{
			this.zoomLevel = 1;
		}
		
		w = WIDTH * this.zoomLevel;
		h = HEIGHT * this.zoomLevel;
		
		// I just _really_ love the hiDPI display hacks...
		this.canvas.width = w * pixelRatio;
		this.canvas.height = h * pixelRatio;
		
		this.fixCanvasContextSmoothing(this.ctx);
		
		this.canvas.style.width = w;
		this.canvas.style.height = h;
		
		this.canvas.style.left = (window.innerWidth - w) / 2;
		this.canvas.style.top = (window.innerHeight - h) / 2;
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
	
	drawTile2(sctx, sx, sy, sw, sh, dx, dy)
	{
		this.drawTileAdvanced2(sctx, sx, sy, sw, sh, dx, dy, 16, 16, false, false, null);
	}
	
	clear()
	{
		this.ctx.fillStyle = "#235";
		this.ctx.fillRect(0, 0, _z(WIDTH), _z(HEIGHT));
		
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(_z(Math.floor(this.ticks / 3) % 64), 0, _z(1), _z(1));
	}
	
	drawLoaderBar(progress)
	{
		let a;
		
		a = Math.floor(progress * 42);
		
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(_z(9), _z(30), _z(42 + 4), _z(8));
		
		this.ctx.fillStyle = "#235";
		this.ctx.fillRect(_z(10), _z(31), _z(42 + 2), _z(6));
		
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(_z(11), _z(32), _z(a), _z(4));
	}
	
	drawVerticalBar(x, y, width, height, progress, color)
	{
		let a;
		
		a = Math.round(progress * height);
		
		this.ctx.fillStyle = "rgba(0,0,0,0.2)";
		this.ctx.fillRect(_z(x), _z(y), _z(width), _z(height));
		
		this.ctx.fillStyle = "hsla(" + (color.h) + ", " + (color.s * 100) + "%, " + (color.l * 50) + "%, 1)";
		this.ctx.fillRect(_z(x), _z(y + height - a), _z(width), _z(a));
		
		this.ctx.globalCompositeOperation = "darken";
		
		this.ctx.fillStyle = "rgba(0,0,0,0.2)";
		this.ctx.fillRect(_z(x + width - 1), _z(y + height - a), _z(1), _z(a));
		
		this.ctx.globalCompositeOperation = "source-over";
	}
	
	drawBox(x, y, width, height, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(_z(Math.round(x)), _z(Math.round(y)), _z(Math.round(width)), _z(Math.round(height)));
	}
}
