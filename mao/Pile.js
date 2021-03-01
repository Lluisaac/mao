module.exports = class Pile {
	constructor(id, name) {
		this.id = id;
		this.cards = new Array();
		this.x = 94;
		this.y = 270;
		
		if (name != "") {
			this.name = name;
		}
		
		this.isFaceUp = true;
	}
	
	shuffle()
	{
		let original = this.cards;
		this.cards = new Array();
		
		this.cards.push(original.pop());
		
		while (original.length > 0)
		{
			let card = original.pop();
			
			let rand = Math.floor(Math.random() * (this.cards.length + 1));
			
			this.cards.splice(rand, 0, card);
		}
	}
	
	flip()
	{
		this.isFaceUp = !this.isFaceUp;
		
		let temp = this.cards;
		this.cards = new Array();
		
		for (let card of temp)
		{
			this.cards.unshift(card);
		}
	}
	
	addPile(pile)
	{
		let flipped = false;
		
		if (this.isFaceUp != pile.isFaceUp)
		{
			pile.flip();
			flipped = true;
		}
		
		for (let card of pile.cards)
		{
			this.cards.push(card);
		}
		
		if (flipped)
		{
			pile.flip();
		}
	}

	clear()
	{
		this.cards = new Array();
	}
}