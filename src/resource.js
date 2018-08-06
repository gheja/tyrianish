"use strict";

class Resource
{
	constructor(name, file, type)
	{
		this.name = name;
		this.file = file;
		this.type = type;
		this.data = null;
		this.image = null;
		this.done = false;
	}
	
	fetch(successCallback, failureCallback)
	{
		this.onSuccess = successCallback;
		this.onFailure = failureCallback;
		
		if (this.type == "image/png")
		{
			this.image = new Image();
			bindEvent(this.image, "load", this.onImageLoaded.bind(this));
			bindEvent(this.image, "error", this.onImageFailed.bind(this));
			this.image.src = this.file;
		}
		else
		{
			this.xhr = new XMLHttpRequest();
			this.xhr.onreadystatechange = this.onXhrReadyStateChange.bind(this);
			this.xhr.open("GET", this.file, true);
			this.xhr.send();
		}
	}
	
	onXhrReadyStateChange(event)
	{
		if (this.xhr.readyState == 4)
		{
			if (this.xhr.status == 200)
			{
				this.done = true;
				
				if (this.type == "application/json")
				{
					this.data = JSON.parse(this.xhr.responseText);
				}
				else
				{
					this.data = this.xhr.responseText;
				}
				this.onSuccess.call();
			}
			else
			{
				this.onFailure.call();
			}
		}
	}
	
	onImageLoaded()
	{
		this.done = true;
		this.onSuccess.call();
	}
	
	onImageFailed()
	{
		this.onFailure.call();
	}
}
