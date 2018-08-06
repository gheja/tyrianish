"use strict";

let _game;
let _stats;
let _loader;

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
