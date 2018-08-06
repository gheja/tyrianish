"use strict";

class Loader
{
	constructor()
	{
		this.resources = [];
		this.finished = false;
	}
	
	enqueue(name, file, type)
	{
		this.resources.push(new Resource(name, file, type))
		this.finished = false;
	}
	
	fetchNext()
	{
		let i;
		
		for (i=0; i<this.resources.length; i++)
		{
			if (!this.resources[i].done)
			{
				this.resources[i].fetch(this.onFetchSuccess.bind(this), this.onFetchFailure.bind(this));
				return;
			}
		}
		
		// nothing to fetch
		
		this.onSuccess.call();
		this.finished = true;
	}
	
	onFetchFailure()
	{
		this.onFailure.call();
	}
	
	onFetchSuccess()
	{
		this.fetchNext();
	}
	
	start(successCallback, failureCallback)
	{
		this.onSuccess = successCallback;
		this.onFailure = failureCallback;
		this.fetchNext();
	}
	
	get(name)
	{
		let i;
		
		for (i=0; i<this.resources.length; i++)
		{
			if (this.resources[i].name == name)
			{
				return this.resources[i];
			}
		}
		
		throw "Could not find resource.";
	}
}
