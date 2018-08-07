"use strict";

class GameObjectPlayerOne extends GameObject
{
	constructor()
	{
		super();
		
		this.gfxObject = _gfxObjects.get("player1");
		this.speedX = 0;
		this.speedY = 0;
		this.speedMaxX = 4; // pixels per tick, TODO: pixels per second?
		this.speedMaxY = 4; // pixels per tick, TODO: pixels per second?
		this.speedReduction = 0.9;
		
		this.input = _inputs[0];
	}
	
	tick()
	{
		let a;
		
		if (!this.input.active)
		{
			return false;
		}
		
		a = this.input.query();
		
		this.speedX = clamp(-this.speedMaxX, this.speedMaxX, this.speedX + a.x * 0.15);
		this.speedY = clamp(-this.speedMaxY, this.speedMaxY, this.speedY + a.y * 0.15);
		
		this.speedX *= this.speedReduction;
		this.speedY *= this.speedReduction;
		
		this.screenX = clamp(0, WIDTH, this.screenX + this.speedX);
		this.screenY = clamp(0, HEIGHT, this.screenY + this.speedY);
	}
}
