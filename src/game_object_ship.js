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
		this.weaponName = "cannon";
		this.weaponSweepDirection = 1;
		this.weaponSweepX = 0;
		
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
		let i, a, b, weaponName, weapon, sweepX, direction;
		
		sweepX = 0;
		
		weapon = _weaponTemplates.get("_defaults");
		_merge(weapon, _weaponTemplates.get(this.weaponName));
		
		if (this.power < weapon.power || this.shootTicksLeft > 0)
		{
			return;
		}
		
		if (this.enemy)
		{
			direction = -1;
		}
		else
		{
			direction = 1;
		}
		
		if (weapon.sweepEnabled)
		{
			// if sweeping left
			if (this.weaponSweepDirection < 0)
			{
				// and reached limit
				if (this.weaponSweepX <= -weapon.sweepDistance)
				{
					// change direction
					this.weaponSweepDirection = 1;
					this.weaponSweepX = -weapon.sweepDistance;
				}
			}
			else
			{
				// and reached limit
				if (this.weaponSweepX >= weapon.sweepDistance)
				{
					// change direction
					this.weaponSweepDirection = -1;
					this.weaponSweepX = weapon.sweepDistance;
				}
			}
			
			this.weaponSweepX += weapon.sweepSteps * this.weaponSweepDirection;
		}
		else
		{
			this.weaponSweepX = 0;
		}
		
		this.shootTicksLeft = weapon.shootInterval;
		this.power -= weapon.power;
		
		for (i=0; i<weapon.projectiles.length; i++)
		{
			a = weapon.projectiles[i];
			
			b = {
				screenX: this.screenX + a.padX + this.weaponSweepX,
				screenY: this.screenY + a.padY * direction,
				speedX: a.speedX,
				speedY: a.speedY * direction,
				hitCheckGroup: this.hitCheckGroup,
				gfxObjectName: a.gfxObjectName
			};
			
			_game.objects.push(new GameObjectProjectile(b));
		}
		
		return;
		
		a = 0;
		weapon = 3;
		
		this.shootNumber++;
		
		if (this.enemy)
		{
			b = -1;
		}
		else
		{
			b = 1;
		}
		
		if (weapon == 1)
		{
			this.shootTicksLeft = 9;
			this.power -= 0.2;
			
			_game.objects.push(new GameObjectProjectile({ screenX: this.screenX + a, screenY: this.screenY + (-7) * b, speedX: 0, speedY: (-2) * b, hitCheckGroup: this.hitCheckGroup, gfxObjectName: "cannon_projectile1" }));
		}
		else if (weapon == 2)
		{
			this.shootTicksLeft = 4;
			this.power -= 0.1;
			
			switch (this.shootNumber % 8)
			{
				case 0:
				case 4:
					a = 0;
				break;
				
				case 1:
				case 3:
					a = -1;
				break;
				
				case 2:
					a = -2;
				break;
				
				case 5:
				case 7:
					a = +1;
				break;
				
				case 6:
					a = +2;
				break;
			}
			
			_game.objects.push(new GameObjectProjectile({ screenX: this.screenX + a, screenY: this.screenY + (-7) * b, speedX: 0, speedY: (-2) * b, hitCheckGroup: this.hitCheckGroup, gfxObjectName: "cannon_projectile2" }));
		}
		else
		{
			this.shootTicksLeft = 10;
			this.power -= 0.3;
			
			_game.objects.push(new GameObjectProjectile({ screenX: this.screenX, screenY: this.screenY + (-7) * b, speedX: 0, speedY: (-1) * b, hitCheckGroup: this.hitCheckGroup, gfxObjectName: "cannon_projectile3" }));
			_game.objects.push(new GameObjectProjectile({ screenX: this.screenX, screenY: this.screenY + (-5) * b, speedX: -1 / 4, speedY: (-1) * b, hitCheckGroup: this.hitCheckGroup, gfxObjectName: "cannon_projectile3" }));
			_game.objects.push(new GameObjectProjectile({ screenX: this.screenX, screenY: this.screenY + (-5) * b, speedX: 1 / 4, speedY: (-1) * b, hitCheckGroup: this.hitCheckGroup, gfxObjectName: "cannon_projectile3" }));
		}
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
