"use strict";

let _gfx;
let _game;
let _stats;
let _loader;
let _inputs;
let _flowSpeed;

function init()
{
	_gfx = new Gfx("canvas1");
	_game = new Game();
	_stats = new Stats();
	_loader = new Loader();
	
	_flowSpeed = 20;
	
	_inputs = [];
	_inputs.push(new InputKeyboard());
	_inputs.push(new InputKeyboard2());
	// _inputs.push(new InputMouse());
	
	document.body.appendChild(_stats.dom);
	
	_loader.enqueue("map_level1", "graphics/map_level1.json", "application/json");
	_loader.enqueue("second_json", "graphics/second.json", "application/json");
	_loader.enqueue("tileset2_json", "graphics/tileset2.json", "application/json");
	_loader.enqueue("resources_gfxobjects_json", "resources/gfxobjects.json", "application/json");
	
	_loader.enqueue("second_png", "graphics/second.png", "image/png");
	_loader.enqueue("terrain_png", "graphics/terrain_by_vexedenigma_itchio.png", "image/png");
	
	_loader.start(_game.onLoaderFinished.bind(_game), _game.onLoaderFailed.bind(_game));
	
	_game.start();
}

bindEvent(window, "load", init);
