"use strict";

function _z(x)
{
	return _gfx.zoomLevel * x;
}

function clamp(min, max, x)
{
	return Math.min(Math.max(x, min), max);
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
