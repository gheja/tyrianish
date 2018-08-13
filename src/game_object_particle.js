"use strict";

class GameObjectParticle extends GameObject
{
	constructor(settings)
	{
		super();
		
		this.flowing = true;
		this.ticks = 0;
		
		_merge(this, settings);
		
		this.updateScreenCoordinates();
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
		
		this.mapX += this.speedX;
		this.mapY += this.speedY;
		
		this.ticks++;
		
		this.updateScreenCoordinates();
	}
}
