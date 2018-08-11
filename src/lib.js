"use strict";

function _merge(obj, settings)
{
	let i;
	
	if (typeof settings != "object")
	{
		return;
	}
	
	for (i in obj)
	{
		if (!obj.hasOwnProperty(i))
		{
			continue;
		}
		
		if (!settings.hasOwnProperty(i))
		{
			continue;
		}
		
		obj[i] = settings[i];
	}
}

function _z(x)
{
	return _gfx.zoomLevel * x;
}

function clamp(min, max, x)
{
	return Math.min(Math.max(x, min), max);
}

function pick(a)
{
	if (typeof a == "object")
	{
		return a[Math.floor(Math.random() * a.length)];
	}
	
	return a;
}

function _getArrayKeys(a, keys)
{
	let i, result;
	
	result = {};
	
	for (i in keys)
	{
		result[keys[i]] = a[keys[i]];
	}
	
	return result;
}

function bindEvent(obj, event, callback)
{
	if (obj.addEventListener)
	{
		obj.addEventListener(event, callback);
	}
	else
	{
		obj.attachEvent("on" + event, callback);
	}
}
