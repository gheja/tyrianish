"use strict";

const WIDTH = 64;
const HEIGHT = 64;
const FPS = 60;

let _game;
let _stats;
let _loader;

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

class Resource
{
	constructor(name, file, type)
	{
		this.name = name;
		this.file = file;
		this.type = type;
		this.data = null;
		this.image = null;
		this.done = false;
	}
	
	fetch(successCallback, failureCallback)
	{
		this.onSuccess = successCallback;
		this.onFailure = failureCallback;
		
		if (this.type == "image/png")
		{
			this.image = new Image();
			bindEvent(this.image, "load", this.onImageLoaded.bind(this));
			bindEvent(this.image, "error", this.onImageFailed.bind(this));
			this.image.src = this.file;
		}
		else
		{
			this.xhr = new XMLHttpRequest();
			this.xhr.onreadystatechange = this.onXhrReadyStateChange.bind(this);
			this.xhr.open("GET", this.file, true);
			this.xhr.send();
		}
	}
	
	onXhrReadyStateChange(event)
	{
		if (this.xhr.readyState == 4)
		{
			if (this.xhr.status == 200)
			{
				this.done = true;
				
				if (this.type == "application/json")
				{
					this.data = JSON.parse(this.xhr.responseText);
				}
				else
				{
					this.data = this.xhr.responseText;
				}
				this.onSuccess.call();
			}
			else
			{
				this.onFailure.call();
			}
		}
	}
	
	onImageLoaded()
	{
		this.done = true;
		this.onSuccess.call();
	}
	
	onImageFailed()
	{
		this.onFailure.call();
	}
}

class Loader
{
	constructor()
	{
		this.resources = [];
		this.finished = false;
	}
	
	enqueue(name, file, type)
	{
		this.resources.push(new Resource(name, file, type))
		this.finished = false;
	}
	
	fetchNext()
	{
		let i;
		
		for (i=0; i<this.resources.length; i++)
		{
			if (!this.resources[i].done)
			{
				this.resources[i].fetch(this.onFetchSuccess.bind(this), this.onFetchFailure.bind(this));
				return;
			}
		}
		
		// nothing to fetch
		
		this.onSuccess.call();
		this.finished = true;
	}
	
	onFetchFailure()
	{
		this.onFailure.call();
	}
	
	onFetchSuccess()
	{
		this.fetchNext();
	}
	
	start(successCallback, failureCallback)
	{
		this.onSuccess = successCallback;
		this.onFailure = failureCallback;
		this.fetchNext();
	}
	
	get(name)
	{
		let i;
		
		for (i=0; i<this.resources.length; i++)
		{
			if (this.resources[i].name == name)
			{
				return this.resources[i];
			}
		}
		
		throw "Could not find resource.";
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
	_loader = new Loader();
	
	document.body.appendChild(_stats.dom);
	
	_loader.enqueue("map_level1", "graphics/map_level1.json", "application/json");
	_loader.enqueue("second_json", "graphics/second.json", "application/json");
	_loader.enqueue("tileset2_json", "graphics/tileset2.json", "application/json");
	
	_loader.enqueue("second_png", "graphics/second.png", "image/png");
	_loader.enqueue("terrain_png", "graphics/terrain_by_vexedenigma_itchio.png", "image/png");
	
	_loader.start(_game.onLoaderFinished.bind(_game), _game.onLoaderFailed.bind(_game));
	
	_game.start();
}

bindEvent(window, "load", init);
