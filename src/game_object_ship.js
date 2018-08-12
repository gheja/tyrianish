"use strict";

class GameObjectShip extends GameObject
{
	constructor(settings)
	{
		super();
		
		this.speedMaxX = 4; // pixels per tick, TODO: pixels per second?
		this.speedMaxY = 4; // pixels per tick, TODO: pixels per second?
		this.speedReduction = 0.9;
		
		this.hitCheckEnabled = true;
		this.hitCheckGroup = 0;
		this.flowing = true;
		this.fleeing = false;
		this.isEnemy = false;
		this.moveTicks = 0;
		this.fleeDelayTicksLeft = 180;
		this.startDelayTicksLeft = 5;
		
		this.highlightTicksLeft = 60;
		this.playerIndex = 0;
		this.shootTicksLeft = 0;
		
		this.power = 0;
		this.shield = 0.5;
		this.armor = 0.5;
		
		this.stats = {
			powerMax: 1,
			shieldMax: 1,
			armorMax: 1,
			
			powerRechargeSpeed: 1, // per second
			shieldRechargeSpeed: 0.2, // per second
			armorRechargeSpeed: 0 // per second
		};
		
		this.input = _inputs[0];
		
		_merge(this, settings);
	}
	
	shoot()
	{
		this.shootTicksLeft = 10;
		this.power -= 0.2;
		_game.objects.push(new GameObjectProjectile({ screenX: this.screenX, screenY: this.screenY, speedX: 0, speedY: -3 }));
	}
	
	rechargeTick()
	{
		this.power = clamp(0, this.stats.powerMax, this.power + this.stats.powerRechargeSpeed / FPS);
		this.shield = clamp(0, this.stats.shieldMax, this.shield + this.stats.shieldRechargeSpeed / FPS);
		this.armor = clamp(0, this.stats.armorMax, this.armor + this.stats.armorRechargeSpeed / FPS);
	}
	
	tick()
	{
		let a;
		
		if (this.startDelayTicksLeft > 0)
		{
			this.startDelayTicksLeft--;
		}
		else
		{
			this.flowing = false;
		}
		
		if (this.startDelayTicksLeft > 0)
		{
			this.speedX = 0;
			this.speedY = _flowSpeed / FPS;
		}
		else
		{
			
			if (this.fleeDelayTicksLeft > 0)
			{
				this.fleeDelayTicksLeft--;
				
				this.moveTicks++;
				
				this.speedX = Math.sin(this.moveTicks / 20 + Math.PI) * 0.5;
				this.speedY = 0.1;
			}
			else
			{
				if (this.screenX > WIDTH / 2)
				{
					this.speedX += 0.005;
				}
				else
				{
					this.speedX -= 0.005;
				}
				
				this.speedY += 0.01;
			}
		}
		
		this.screenX += this.speedX;
		this.screenY += this.speedY;
		
		if (this.shootTicksLeft == 0)
		{
		}
		else
		{
			this.shootTicksLeft--;
		}
	}
}
