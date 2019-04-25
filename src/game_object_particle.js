"use strict";

class GameObjectParticle extends GameObject
{
	constructor(settings)
	{
		super();
		
		this.flowing = true;
		this.ticks = 0;
		
		_merge(this, settings);
	}
	
	tick()
	{
		if (this.gfxObject.animationFinished(this.ticks))
		{
			this.destroyed = true;
		}
		
		if (this.flowing)
		{
			this.speedY = _flowSpeed / FPS;
		}
		
		this.screenX += this.speedX;
		this.screenY += this.speedY;
		this.ticks++;
	}
}
