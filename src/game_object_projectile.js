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
		this.screenX += this.speedX;
		this.screenY += this.speedY;
		
		if (this.screenX < -32 || this.screenY < -32 || this.screenX > WIDTH + 32 || this.screenY > HEIGHT + 32)
		{
			this.destroyed = true;
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
