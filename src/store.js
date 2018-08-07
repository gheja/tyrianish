"use strict";

class Store
{
	constructor()
	{
		this.objects = {};
	}
	
	add(name, object)
	{
		this.objects[name] = object;
	}
	
	get(name)
	{
		return this.objects[name];
	}
}
