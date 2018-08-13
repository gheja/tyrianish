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
			bindEvent(a[i], "keyup", this.onDummyEvent.bind(this));
			bindEvent(a[i], "keydown", this.onDummyEvent.bind(this));
			bindEvent(a[i], "change", this.onInputChange.bind(this));
			if (a[i].type == "range")
			{
				bindEvent(a[i], "mousewheel", this.onMouseWheel.bind(this));
			}
		}
		
		a = document.getElementById("editor_controls").getElementsByTagName("select");
		for (i=0; i<a.length; i++)
		{
			bindEvent(a[i], "keyup", this.onDummyEvent.bind(this));
			bindEvent(a[i], "keydown", this.onDummyEvent.bind(this));
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
	
	onDummyEvent(e)
	{
		e.stopPropagation();
	}
	
	onMouseWheel(e)
	{
		if (e.deltaY < 0)
		{
			e.target.value = clamp(1 * e.target.min, 1 * e.target.max, 1 * e.target.value - 15);
		}
		else if (e.deltaY > 0)
		{
			e.target.value = clamp(1 * e.target.min, 1 * e.target.max, 1 * e.target.value + 15);
		}
		
		e.target.focus();
		this.updateObject();
		
		e.stopPropagation();
	}
	
	onInputChange(e)
	{
		this.updateObject();
		
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
