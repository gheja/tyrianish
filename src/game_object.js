"use strict";

class GameObject
{
	constructor(settings)
	{
		this.screenX = 0;
		this.screenY = -100;
		this.speedX = 0;
		this.speedY = 0;
		this.mapX = 0;
		this.mapY = 0;
		this.gfxObject = null;
		this.destroyed = false;
		this.ticks = 0;
		
		this.hitpoints = 1;
		
		this.hitCheckEnabled = false;
		this.hitCheckGroup = 0;
		this.hitCheckArrayValid = false;
		this.hitCheckArray = [ 0, 0, 0, 0 ];
		
		this.explosionAnimations = [ "explosion1" ];
		
		_merge(this, settings);
	}
	
	updateScreenCoordinates()
	{
		this.screenX = this.mapX - _game.ax;
		this.screenY = this.mapY - _game.ay;
	}
	
	updateHitCheckArray()
	{
		if (this.gfxObject === null || !this.hitCheckEnabled || this.destroyed || this.screenY < -16)
		{
			this.hitCheckArrayValid = false;
			return;
		}
		
		this.hitCheckArrayValid = true;
		this.hitCheckArray[0] = this.screenX - this.gfxObject.screenPadX + this.gfxObject.hitboxX;
		this.hitCheckArray[1] = this.screenY - this.gfxObject.screenPadY + this.gfxObject.hitboxY;
		this.hitCheckArray[2] = this.hitCheckArray[0] + this.gfxObject.hitboxWidth;
		this.hitCheckArray[3] = this.hitCheckArray[1] + this.gfxObject.hitboxHeight;
	}
	
	destroy()
	{
		if (this.explosionAnimations != null)
		{
			_game.objects.push(new GameObjectParticle({ gfxObject: _gfxObjects.get(pick(this.explosionAnimations)), hitCheckEnabled: false, mapX: Math.floor(this.mapX), mapY: Math.floor(this.mapY) }));
		}
		this.hitCheckArrayValid = false;
		this.destroyed = true;
	}
	
	handleHitBy(projectile)
	{
		let a;
		
		a = Math.min(this.hitpoints, projectile.hitpoints);
		
		this.hitpoints -= a;
		
		if (this.hitpoints <= 0)
		{
			this.destroy();
		}
		
		projectile.hitpoints -= a;
		
		if (projectile.hitpoints <= 0)
		{
			projectile.destroy();
		}
	}
	
	tick()
	{
		this.ticks++;
	}
	
	draw()
	{
		if (this.destroyed)
		{
			return;
		}
		
		this.gfxObject.draw(Math.round(this.screenX), Math.round(this.screenY), this.ticks);
	}
}
