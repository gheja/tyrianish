"use strict";

class Editor
{
	constructor()
	{
		let a, i;
		
		this.visible = false;
		this.selectedObject = null;
		this.level = null;
		this.updateDom();
		
		a = document.getElementById("editor_controls").getElementsByTagName("input");
		for (i=0; i<a.length; i++)
		{
			bindEvent(a[i], "change", this.onInputChange.bind(this));
		}
		
		a = document.getElementById("editor_controls").getElementsByTagName("select");
		for (i=0; i<a.length; i++)
		{
			bindEvent(a[i], "change", this.onInputChange.bind(this));
		}
	}
	
	unselectObject()
	{
		this.selectedObject = null;
	}
	
	selectObject(obj)
	{
		if (obj == null)
		{
			this.unselectObject();
			return;
		}
		
		this.selectedObject = obj;
		
		this.update()
	}
	
	onInputChange(e)
	{
		this.updateObject();
		
		e.preventDefault();
		e.stopPropagation();
	}
	
	update()
	{
		let obj;
		
		setInputValue("editor_coordinates", Math.round(_debug.editX) + ", " + Math.round(_debug.editY));
		
		if (!this.selectedObject)
		{
			//
		}
		else
		{
			setInputValue("editor_enemy_coordinates", Math.round(this.selectedObject.startConfig.screenX + _game.ax) + ", " + Math.round(this.selectedObject.startConfig.screenY + _game.ay));
			setInputValue("editor_enemy_start_delay", this.selectedObject.startConfig.startDelayTicks);
			setInputValue("editor_enemy_flee_delay", this.selectedObject.startConfig.fleeDelayTicks);
			setInputValue("editor_enemy_path", "sine");
		}
	}
	
	updateObject()
	{
		if (!this.selectedObject)
		{
			return;
		}
		
		this.selectedObject.startConfig.startDelayTicks = getInputValueInt("editor_enemy_start_delay");
		this.selectedObject.startConfig.fleeDelayTicks = getInputValueInt("editor_enemy_flee_delay");
		this.selectedObject.rerun();
	}
	
	updateDom()
	{
		let obj;
		
		obj = document.getElementById("editor_controls");
		
		if (this.visible)
		{
			obj.style.display = "block";
			_debug.editing = true;
		}
		else
		{
			obj.style.display = "none";
			_debug.editing = false;
		}
	}
	
	toggle()
	{
		this.visible = !this.visible;
		
		this.updateDom();
	}
}
