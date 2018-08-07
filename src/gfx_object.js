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
		
		_merge(this, settings);
		
		this.image = null;
		
		if (this.imageName)
		{
			this.image = _loader.get(this.imageName).image;
		}
	}
	
	draw(screenX, screenY)
	{
		_gfx.drawTileAdvanced2(this.image, this.imageX, this.imageY, this.imageWidth / 16, this.imageHeight / 16, screenX - this.screenPadX, screenY - this.screenPadY, this.imageWidth, this.imageHeight, false, false, null);
	}
}
