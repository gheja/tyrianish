"use strict";

const WIDTH = 96;
const HEIGHT = 96;

let _game;
let _stats;

function _z(x)
{
	return _game.zoomLevel * x;
}

function bindEvent(obj, event, callback)
{
	if (obj.addEventListener)
	{
		obj.addEventListener(event, callback);
	}
	else
	{
		obj.attachEvent("on" + event, callback);
	}
}

class Game
{
	constructor(canvas_id)
	{
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
		this.zoomLevel = 1;
		this.pixelRatio = 1;
		
		bindEvent(window, "resize", this.onResize.bind(this));
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
	}
	
	draw()
	{
		let i;
		
		this.ctx.fillStyle = "#235";
		this.ctx.fillRect(0, 0, _z(WIDTH), _z(HEIGHT));
		
		for (i=0; i<Math.random() * 10000; i++)
		{
			this.ctx.fillStyle = "hsl(" + (Math.floor(Math.random() * 360)) + ", 100%, 50%)";
			this.ctx.fillRect(0, 0, _z(Math.random() * 100), _z(Math.random() * 100));
		}
	}
	
	timer()
	{
		_stats.begin();
		this.draw();
		_stats.end();
		
		window.requestAnimationFrame(this.timer.bind(this));
	}
	
	start()
	{
		this.timer();
	}
}

function init()
{
	_game = new Game("canvas1");
	_stats = new Stats();
	document.body.appendChild(_stats.dom);
	
	_game.start();
}

bindEvent(window, "load", init);
