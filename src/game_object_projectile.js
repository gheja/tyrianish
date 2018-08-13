"use strict";

class GameObjectProjectile extends GameObject
{
	constructor(settings)
	{
		super();
		
		this.gfxObjectName = "cannon_projectile1";
		this.damage = 0.5;
		this.hitCheckEnabled = true;
		this.explosionAnimations = [ "pling1", "pling2", "pling3" ];
		
		this.hitpoints = this.damage;
		
		_merge(this, settings);
		
		this.gfxObject = _gfxObjects.get(this.gfxObjectName);
	}
	
	tick()
	{
		this.mapX += this.speedX;
		this.mapY += this.speedY;
		
		this.updateScreenCoordinates();
		
		if (this.screenX < -32 || this.screenY < -32 || this.screenX > WIDTH + 32 || this.screenY > HEIGHT + 32)
		{
			this.destroyed = true;
		}
	}
}
