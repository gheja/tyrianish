"use strict";

const PLAYER_STATUS_NEW = 0;
const PLAYER_STATUS_PLAYING = 1;
const PLAYER_STATUS_DYING = 2;
const PLAYER_STATUS_DEAD = 3;

class GameObjectPlayerOne extends GameObjectShip
{
	constructor(settings)
	{
		super();
		
		this.gfxObject = _gfxObjects.get("player1");
		
		this.isEnemy = false;
		this.hitCheckEnabled = true;
		this.hitCheckGroup = 1;
		this.highlightTicksLeft = 0;
		this.startTicksLeft = 0;
		this.playerIndex = 0;
		this.shootTicksLeft = 0;
		
		this.stats.powerMax = 1;
		this.stats.shieldMax = 1;
		this.stats.armorMax = 1;
			
		this.stats.powerRechargeSpeed = 1;
		this.stats.shieldRechargeSpeed = 0.2;
		this.stats.armorRechargeSpeed = 0;
		
		this.status = PLAYER_STATUS_NEW;
		
		this.input = _inputs[0];
		this.explosionAnimations = [ "explosion1" ];
		this.dead = false;
		
		this.restart();
		
		_merge(this, settings);
	}
	
	handleHitBy(projectile)
	{
		if (this.status != PLAYER_STATUS_PLAYING)
		{
			return;
		}
		
		super.handleHitBy(projectile);
	}
	
	restart()
	{
		this.highlightTicksLeft = 60;
		this.startTicksLeft = 60;
		this.armor = 0.5;
		this.shield = 0.8;
		this.status = PLAYER_STATUS_NEW;
	}
	
	destroy()
	{
		if (this.status != PLAYER_STATUS_PLAYING)
		{
			return;
		}
		
		super.destroy();
		
		this.destroyed = false;
		this.status = PLAYER_STATUS_DEAD;
	}
	
	tick()
	{
		let a;
		
		this.ticks++;
		
		if (!this.input.active)
		{
			return false;
		}
		
		if (this.highlightTicksLeft > 0)
		{
			this.highlightTicksLeft--;
		}
		
		if (this.status == PLAYER_STATUS_NEW)
		{
			if (this.startTicksLeft > 0)
			{
				this.startTicksLeft--
			}
			else if (this.startTicksLeft == 0)
			{
				this.status = PLAYER_STATUS_PLAYING;
			}
		}
		
		a = this.input.query();
		
		this.speedX = clamp(-this.speedMaxX, this.speedMaxX, this.speedX + a.x * 0.15);
		this.speedY = clamp(-this.speedMaxY, this.speedMaxY, this.speedY + a.y * 0.15);
		
		if (this.status == PLAYER_STATUS_DEAD)
		{
			// this.gfxObject = _gfxObjects.get("explosion1");
			this.gfxObject = _gfxObjects.get("player1_dead");
		}
		else
		{
			if (this.speedX < -0.8)
			{
				this.gfxObject = _gfxObjects.get("player1_left2");
			}
			else if (this.speedX < -0.5)
			{
				this.gfxObject = _gfxObjects.get("player1_left");
			}
			else if (this.speedX <= 0.5)
			{
				this.gfxObject = _gfxObjects.get("player1");
			}
			else if (this.speedX <= 0.8)
			{
				this.gfxObject = _gfxObjects.get("player1_right");
			}
			else
			{
				this.gfxObject = _gfxObjects.get("player1_right2");
			}
		}
		
		this.speedX *= this.speedReduction;
		this.speedY *= this.speedReduction;
		
		this.mapX = clamp(_game.ax, _game.ax + WIDTH, this.mapX + this.speedX);
		this.mapY = clamp(_game.ay, _game.ay + HEIGHT, this.mapY + this.speedY - _flowSpeed / FPS);
		
		if (this.status == PLAYER_STATUS_DEAD)
		{
			this.power = 0;
			this.shield = 0;
			this.armor = 0;
		}
		else
		{
			this.rechargeTick();
			
			if (this.shootTicksLeft == 0)
			{
				if (a.shoot)
				{
					this.shoot();
				}
			}
			else
			{
				this.shootTicksLeft--;
			}
		}
		
		this.updateScreenCoordinates();
	}
}
