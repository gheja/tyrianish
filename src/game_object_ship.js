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
		
		weapon = _copy(_weaponTemplates.get("_defaults"));
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
				mapX: this.mapX + a.padX + this.weaponSweepX,
				mapY: this.mapY + a.padY * direction,
				speedX: a.speedX,
				speedY: a.speedY * direction,
				hitCheckGroup: this.hitCheckGroup,
				gfxObjectName: a.gfxObjectName
			};
			
			_game.objects.push(new GameObjectProjectile(b));
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
	
	drawBars()
	{
		let c, x, y, reversed;
		
		x = 0;
		y = 46;
		reversed = false;
		
		c = PLAYER_HIGHLIGHT_COLORS[this.playerIndex];
		
		if (this.playerIndex == 0)
		{
			x = 0;
		}
		else
		{
			x = 58;
			reversed = true;
		}
		
		if (!reversed)
		{
			_gfx.drawVerticalBar(x, y, 2, 18, this.power / this.stats.powerMax, { h: 0, s: 1, l: 1 });
			_gfx.drawVerticalBar(x + 2, y + 6, 2, 12, this.armor / this.stats.armorMax, { h: 15, s: 0.5, l: 0.7 });
			_gfx.drawVerticalBar(x + 4, y + 6, 2, 12, this.shield / this.stats.shieldMax, { h: 200, s: 1, l: 1 });
			
		}
		else
		{
			_gfx.drawVerticalBar(x + 4, y, 2, 18, this.power / this.stats.powerMax, { h: 0, s: 1, l: 1 });
			_gfx.drawVerticalBar(x + 2, y + 6, 2, 12, this.armor / this.stats.armorMax, { h: 15, s: 0.5, l: 0.7 });
			_gfx.drawVerticalBar(x, y + 6, 2, 12, this.shield / this.stats.shieldMax, { h: 200, s: 1, l: 1 });
		}
		
		if (this.highlightTicksLeft > 0 && (_game.ticks % 15 < 10))
		{
			_gfx.drawBox(x, y + 16, 6, 2, c);
			_gfx.drawBox(this.screenX - 2, this.screenY - 8, 5, 1, c);
			_gfx.drawBox(this.screenX - 1, this.screenY - 7, 3, 1, c);
			_gfx.drawBox(this.screenX, this.screenY - 6, 1, 1, c);
		}
	}
}
