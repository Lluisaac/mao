class Hand extends DisplayedEntity {
	constructor(owningState) 
	{
		super(owningState)
		
		this.dom = document.createElement("div"); 
		this.dom.style.overflowX = "auto";
		this.dom.style.overflowY = "hidden";
		this.dom.style.position = "absolute";
		this.dom.style.border = "solid";
		this.dom.style.background = "rgba(180, 180, 180, 0.66)"
		this.dom.style.padding = "10px"
		document.body.appendChild(this.dom);
		this.dom.classList.add("hand");
		
		this.setX(Game.getGameWidth() / 4);
		this.setY(Game.getGameHeight() - (Card.height + 40));
		this.setWidth(Game.getGameWidth() / 2);
		this.setHeight(Card.height + 17);
		this.setDepth(10);
		
		this.cards = new Array();
	}
	
	removeCard(card) 
	{
		if (this.dom.contains(card.dom))
		{
			this.dom.removeChild(card.dom);
		}
		
		this.cards.splice(this.cards.indexOf(card), 1);
		
		card.hand = null;
		card.putRightSprite();
	}
	
	addCardOnRightSpot(card) 
	{
		this.addCard(card, this.getRightSpot(card));
	}
	
	addCard(card, pos)
	{
		this.cards.splice(pos, 0, card);
		
		card.hand = this;
		card.setDepth(this.getDepth());
		
		if (card.isFaceUp)
		{
			card.flip();
		}
		else
		{
			card.putRightSprite();
		}
		
		card.dom.remove();
		this.dom.appendChild(card.dom);
	}
	
	clear() 
	{
		for (let card of this.cards) 
		{
			this.removeCard(card);
		}
	}
	
	getRightSpot(card) 
	{
		let i = 0;
		let best = this.cards.length;
		let max = Number.NEGATIVE_INFINITY;
		
		while (i < this.cards.length) 
		{
			let actual = card.getIntersectedQuantityInHand(this.cards[i]);
			
			if (max < actual && actual > 0) 
			{
				best = i;
				max = actual
			}
			
			i++;
		}
		
		return best;
	}
	
	getPositionOf(id)
	{
		for (let i = 0; i < this.cards.length; i++)
		{
			if (this.cards[i].id == id)
			{
				return i;
			}
		}
		
		return -1;
	}
	
	update() 
	{
		for (let i = 0; i < this.cards.length; i++) 
		{
			this.cards[i].setX(i * (Card.width + 10) + 10);
			this.cards[i].setY(10)
			this.cards[i].update();
		}
	}
}