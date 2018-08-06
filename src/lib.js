"use strict";

function _z(x)
{
	return _game.zoomLevel * x;
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
