"use strict";

const ENEMY_STATE_FLOWING = 1;
const ENEMY_STATE_READY = 2;
const ENEMY_STATE_FLEEING = 3;

class GameObjectEnemy extends GameObjectShip
{
	constructor(settings, settings2)
	{
		super();
		
		this.gfxObjectName = "enemy1";
		this.speedMaxX = 4; // pixels per tick, TODO: pixels per second?
		this.speedMaxY = 4; // pixels per tick, TODO: pixels per second?
		this.speedReduction = 0.9;
		
		this.isEnemy = true;
		this.hitCheckEnabled = true;
		this.hitCheckGroup = 0;
		this.flowing = true;
		this.moveTicks = 0;
		
		this.fleeDelayTicksLeft = 0;
		this.startDelayTicksLeft = 0;
		
		this.highlightTicksLeft = 60;
		this.playerIndex = 0;
		this.shootTicksLeft = 0;
		
		this.mapX = 0;
		this.mapY = 0;
		
		this.power = 0;
		this.shield = 0.5;
		this.armor = 0.5;
		
		this.startConfig = {
			mapX: 0,
			mapY: 0,
			startDelayTicks: 0,
			fleeDelayTicks: 600
		};
		
		this.stats = {
			powerMax: 1,
			shieldMax: 1,
			armorMax: 1,
			
			powerRechargeSpeed: 1, // per second
			shieldRechargeSpeed: 0.2, // per second
			armorRechargeSpeed: 0 // per second
		};
		
		this.explosionAnimations = [ "explosion2" ];
		
		_merge(this, settings);
		_merge(this.startConfig, settings2);
		
		this.gfxObject = _gfxObjects.get(this.gfxObjectName);
		
		this.restart();
	}
	
	shoot()
	{
		this.shootTicksLeft = 10;
		this.power -= 0.2;
		_game.objects.push(new GameObjectProjectile({ screenX: this.screenX, screenY: this.screenY, speedX: 0, speedY: -3 }));
	}
	
	autopilotTick()
	{
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
		
		this.mapX += this.speedX;
		this.mapY += this.speedY;
		
		this.updateScreenCoordinates();
	}
	
	drawPath()
	{
		let a, b, points, i;
		
		a = _getArrayKeys(this, [ "mapX", "mapY", "screenX", "screenY", "speedX", "speedY", "moveTicks", "startDelayTicksLeft", "fleeDelayTicksLeft", "flowing" ]);
		
		for (i=0; i<300; i++)
		{
			this.autopilotTick();
			
			if (i % 10 < 5)
			{
				continue;
			}
			
			if (this.startDelayTicksLeft > 0)
			{
				_gfx.drawBox(this.screenX, this.screenY, 1, 1, "rgba(120, 120, 255, 0.5)");
			}
			else if (this.fleeDelayTicksLeft > 0)
			{
				_gfx.drawBox(this.screenX, this.screenY, 1, 1, "rgba(255, 255, 255, 0.5)");
			}
			else
			{
				_gfx.drawBox(this.screenX, this.screenY, 1, 1, "rgba(255, 120, 120, 0.5)");
			}
		}
		
		_merge(this, a);
	}
	
	tick()
	{
		this.ticks++;
		
		this.autopilotTick();
		
		if (this.shootTicksLeft == 0)
		{
		}
		else
		{
			this.shootTicksLeft--;
		}
	}
	
	draw()
	{
		let i;
		
		super.draw();
		
		if (_debug.paths || _debug.editSelectedObject == this)
		{
			this.drawPath();
		}
	}
}
