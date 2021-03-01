class Random 
{
	constructor(id)
	{
		this.id = id;
		this.seed = Random.generateSeed(id);
	}
	
	static maxId = 0;
	
	static getRandomId() 
	{
		return Random.getRandomValue(0, Random.maxId);
	}
	
	static getRandomValue(min, max) 
	{
		return Math.round(Math.random() * (max - min)) + min;
	}
	
	static generateSeed(id)
	{
		let seed = 0;
		
		let splitted = id.split("");
		
		for (let piece of splitted)
		{
			seed += piece.charCodeAt(0);
		}
		
		return seed;
	}
	
	seededRandom(min, max)
	{
		let x = Math.sin(this.seed++) * 10000;
		let res = x - Math.floor(x);
		return Math.round(res * (max - min)) + min;
	}
	
	generateColor(isAlphaNeeded)
	{
		let color = {};
		
		if (this.id == "Lluisaac")
		{
			color.r = 110;
			color.g = 11;
			color.b = 20;
		}
		else if (this.id == "server")
		{
			color.r = 75;
			color.g = 75;
			color.b = 75;
		}
		else
		{
			do
			{
				color.r = this.seededRandom(0, 255);
				color.g = this.seededRandom(0, 255);
				color.b = this.seededRandom(0, 255);
			} 
			while (color.r + color.g + color.b < 240);
		}
		
		if (isAlphaNeeded) 
		{
			color.a = this.seededRandom(0, 255);
		}
		
		return color;
	}
}