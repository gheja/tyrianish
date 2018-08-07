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
		
		this.highlightTicksLeft = 60;
		this.playerIndex = 0;
		
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
		
		this.power = clamp(0, this.stats.powerMax, this.power + this.stats.powerRechargeSpeed / FPS);
		this.shield = clamp(0, this.stats.shieldMax, this.shield + this.stats.shieldRechargeSpeed / FPS);
		this.armor = clamp(0, this.stats.armorMax, this.armor + this.stats.armorRechargeSpeed / FPS);
		
		
		a = this.input.query();
		
		this.speedX = clamp(-this.speedMaxX, this.speedMaxX, this.speedX + a.x * 0.15);
		this.speedY = clamp(-this.speedMaxY, this.speedMaxY, this.speedY + a.y * 0.15);
		
		this.speedX *= this.speedReduction;
		this.speedY *= this.speedReduction;
		
		this.screenX = clamp(0, WIDTH, this.screenX + this.speedX);
		this.screenY = clamp(0, HEIGHT, this.screenY + this.speedY);
	}
	
	drawBars()
	{
		let c;
		
		c = PLAYER_HIGHLIGHT_COLORS[this.playerIndex];
		
		if (this.playerIndex == 0)
		{
			_gfx.drawVerticalBar(0, 46, 2, 18, this.power / this.stats.powerMax, { h: 0, s: 1, l: 1 });
			_gfx.drawVerticalBar(2, 52, 2, 12, this.armor / this.stats.armorMax, { h: 15, s: 0.5, l: 0.7 });
			_gfx.drawVerticalBar(4, 52, 2, 12, this.shield / this.stats.shieldMax, { h: 200, s: 1, l: 1 });
			
			if (this.highlightTicksLeft > 0)
			{
				_gfx.drawBox(0, 62, 6, 2, c);
			}
		}
		else
		{
			_gfx.drawVerticalBar(62, 46, 2, 18, this.power / this.stats.powerMax, { h: 0, s: 1, l: 1 });
			_gfx.drawVerticalBar(60, 52, 2, 12, this.armor / this.stats.armorMax, { h: 15, s: 0.5, l: 0.7 });
			_gfx.drawVerticalBar(58, 52, 2, 12, this.shield / this.stats.shieldMax, { h: 200, s: 1, l: 1 });
			
			if (this.highlightTicksLeft > 0)
			{
				_gfx.drawBox(58, 62, 14, 2, c);
			}
		}
		
		if (this.highlightTicksLeft > 0)
		{
			_gfx.drawBox(this.screenX - 2, this.screenY - 8, 5, 1, c);
			_gfx.drawBox(this.screenX - 1, this.screenY - 7, 3, 1, c);
			_gfx.drawBox(this.screenX, this.screenY - 6, 1, 1, c);
		}
	}
}
