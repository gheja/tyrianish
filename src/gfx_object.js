"use strict";

class GfxObject
{
	constructor(settings)
	{
		this.imageName = null;
		this.imageX = 0;
		this.imageY = 0;
		this.imageWidth = 0;
		this.imageHeight = 0;
		this.screenPadX = 0;
		this.screenPadY = 0;
		this.hitboxX = 0;
		this.hitboxY = 0;
		this.hitboxWidth = 0;
		this.hitboxHeight = 0;
		
		this.animated = false;
		this.animationFrames = 0;
		this.animationFrameTicks = 0;
		
		_merge(this, settings);
		
		this.image = null;
		
		if (this.imageName)
		{
			this.image = _loader.get(this.imageName).image;
		}
	}
	
	draw(screenX, screenY, ticks = 0)
	{
		let a;
		
		if (this.animated)
		{
			if (ticks >= this.animationFrameTicks * this.animationFrames)
			{
				return;
			}
			
			a = this.imageY + Math.floor(ticks / this.animationFrameTicks);
		}
		else
		{
			a = this.imageY;
		}
		
		_gfx.drawTileAdvanced2(this.image, this.imageX, a, this.imageWidth / 16, this.imageHeight / 16, screenX - this.screenPadX, screenY - this.screenPadY, this.imageWidth, this.imageHeight, false, false, null);
		
		if (_debug.hitboxes)
		{
			_gfx.drawBox(screenX - this.screenPadX + this.hitboxX, screenY - this.screenPadY + this.hitboxY, this.hitboxWidth, this.hitboxHeight, "rgba(255,255,0,0.5)");
			_gfx.drawBox(screenX, screenY, 1, 1, "rgba(255,0,0,0.5)");
		}
	}
	
	animationFinished(ticks)
	{
		if (this.animated)
		{
			if (ticks < this.animationFrameTicks * this.animationFrames)
			{
				return false;
			}
		}
		
		return true;
	}
}
