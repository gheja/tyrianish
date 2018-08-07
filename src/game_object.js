"use strict";

class GameObject
{
	constructor(settings)
	{
		this.screenX = 0;
		this.screenY = 0;
		this.mapX = 0;
		this.mapY = 0;
		this.gfxObject = null;
		this.destroyed = false;
		
		_merge(this, settings);
	}
	
	tick()
	{
	}
	
	draw()
	{
		this.gfxObject.draw(Math.round(this.screenX), Math.round(this.screenY));
	}
}
