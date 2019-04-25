"use strict";

class Editor
{
	constructor()
	{
		this.visible = false;
		this.selectedObject = null;
		this.level = null;
		this.updateDom();
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
	}
	
	update()
	{
		let obj;
		
		obj = document.getElementById("editor_coordinates");
		obj.innerHTML = Math.round(_debug.editX) + ", " + Math.round(_debug.editY);
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
