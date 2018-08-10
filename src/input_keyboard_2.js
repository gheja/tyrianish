"use strict";

class InputKeyboard2 extends InputKeyboard
{
	constructor()
	{
		super();
		
		this.keys["up"].codes = [ "w", "W", "KeyW" ];
		this.keys["right"].codes = [ "d", "D", "KeyD" ];
		this.keys["down"].codes = [ "s", "S", "KeyS" ];
		this.keys["left"].codes = [ "a", "A", "KeyA" ];
		this.keys["shoot"].codes = [ "Shift" ];
		this.keys["menu"].codes = [ "q", "Q", "KeyQ" ];
	}
}
