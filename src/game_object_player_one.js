"use strict";

class GameObjectPlayerOne extends GameObjectShip
{
	constructor(settings)
	{
		super();
		
		this.gfxObject = _gfxObjects.get("player1");
		
		this.hitCheckEnabled = true;
		this.hitCheckGroup = 1;
		this.highlightTicksLeft = 60;
		this.playerIndex = 0;
		this.shootTicksLeft = 0;
		
		this.stats.powerMax = 1;
		this.stats.shieldMax = 1;
		this.stats.armorMax = 1;
			
		this.stats.powerRechargeSpeed = 1;
		this.stats.shieldRechargeSpeed = 0.2;
		this.stats.armorRechargeSpeed = 0;
		
		this.input = _inputs[0];
		
		_merge(this, settings);
	}
	
	shoot()
	{
		this.shootTicksLeft = 10;
		this.power -= 0.2;
		_game.objects.push(new GameObjectProjectile({ screenX: this.screenX, screenY: this.screenY, speedX: 0, speedY: -3, hitCheckGroup: this.hitCheckGroup }));
	}
	
	tick()
	{
		let a;
		
		if (!this.input.active)
		{
			return false;
		}
		
		if (this.highlightTicksLeft > 0)
		{
			this.highlightTicksLeft--;
		}
		
		this.rechargeTick();
		
		a = this.input.query();
		
		this.speedX = clamp(-this.speedMaxX, this.speedMaxX, this.speedX + a.x * 0.15);
		this.speedY = clamp(-this.speedMaxY, this.speedMaxY, this.speedY + a.y * 0.15);
		
		this.speedX *= this.speedReduction;
		this.speedY *= this.speedReduction;
		
		this.screenX = clamp(0, WIDTH, this.screenX + this.speedX);
		this.screenY = clamp(0, HEIGHT, this.screenY + this.speedY);
		
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
