const CardVal = {
	SAce: 1,
	S2: 2,
	S3: 3,
	S4: 4,
	S5: 5,
	S6: 6,
	S7: 7,
	S8: 8,
	S9: 9,
	S10: 10,
	SJack: 11,
	SQueen: 12,
	SKing: 13,
	HAce: 14,
	H2: 15,
	H3: 16,
	H4: 17,
	H5: 18,
	H6: 19,
	H7: 20,
	H8: 21,
	H9: 22,
	H10: 23,
	HJack: 24,
	HQueen: 25,
	HKing: 26,
	CAce: 27,
	C2: 28,
	C3: 29,
	C4: 30,
	C5: 31,
	C6: 32,
	C7: 33,
	C8: 34,
	C9: 35,
	C10: 36,
	CJack: 37,
	CQueen: 38,
	CKing: 39,
	DAce: 40,
	D2: 41,
	D3: 42,
	D4: 43,
	D5: 44,
	D6: 45,
	D7: 46,
	D8: 47,
	D9: 48,
	D10: 49,
	DJack: 50,
	DQueen: 51,
	DKing: 52,
	BJoker: 53,
	RJoker: 54
};

class Card extends TexturedEntity 
{
	constructor(owningState, value, id, back) {
		super(owningState, 0, 0, Card.width, Card.height, "assets/cards/" + value + ".png");
		this.value = value;
		this.hand = null;
		this.front = "assets/cards/" + value + ".png";
		this.back = back;
		this.isFaceUp = true;
		
		this.isDragged = false;
		
		this.dom.classList.add("card");
		this.dom.addEventListener("mousedown", this.dragStart.bind(this));
		
		this.id = id;
	}
	
	static width = 90;
	static height = 120;
	
	update() 
	{
		if (this.isDragged) 
		{
			this.updateDraggingCoord();
		}
		
		if (this.borderCountdown == 0)
		{
			this.removeBorder();
			this.borderCountdown--;
		}
		
		if (this.borderCountdown >= 0) {
			this.borderCountdown--;
		}
	}
	
	flip()
	{
		this.isFaceUp = !this.isFaceUp;
		this.putRightSprite();
	}
	
	putRightSprite()
	{
		if (this.isFaceUp || this.hand != null)
		{
			this.setSprite(this.front);
		}
		else
		{
			this.setSprite(this.back);
		}
	}
	
	updateDraggingCoord() 
	{
		this.setX(this.mouseX - (Card.width / 2));
		this.setY(this.mouseY - (Card.height / 2));
	}
	
	doDragUpdate(event) 
	{
		States.getCurrentState().selectedElement.dragUpdate(event);
	}
	
	doDragEnd(event) 
	{
		States.getCurrentState().selectedElement.dragEnd(event);
	}
	
	dragStart(event) 
	{
		if (this.hand != null) 
		{
			this.getState().addChange("handToSelect", this.hand.getPositionOf(this.id), "selection", this.id, true);
			
			this.getState().zones[this.getState().idPlayer].addNbCards(-1);
			
			this.hand.removeCard(this);
			document.body.appendChild(this.dom);
		}
		
		this.isDragged = true;
		document.body.addEventListener("mousemove", this.doDragUpdate);
		document.body.addEventListener("mouseup", this.doDragEnd);
		
		this.dragUpdate(event);
		
		this.updateDraggingCoord();
		
		this.getState().setSelected(this);
		
		this.setDepth(101);
	}
	
	dragUpdate(event) 
	{
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}
	
	dragEnd(event) 
	{
		if (this.getState().hand.isAround(event.clientX, event.clientY, 20)) 
		{
			this.getState().hand.addCardOnRightSpot(this);
			this.getState().addChange("selectToHand", "selection", this.hand.getPositionOf(this.id), this.id, true);
			
			this.getState().zones[this.getState().idPlayer].addNbCards(1);
		} 
		else  
		{
			let pile = this.getState().getCollidedPile(this);
			
			if (pile == null) 
			{
				pile = this.getState().addPile(Random.getRandomId(), undefined, this.isFaceUp, this.getX(), this.getY() + Pile.offsetY);
				pile.addCard(this);
				this.getState().addChange("selectToNewPile", "selection", {id: pile.id, x: this.getX(), y: this.getY() + Pile.offsetY, isFaceUp: this.isFaceUp}, this.id, true);
			} 
			else 
			{
				pile.addCard(this);
				this.getState().addChange("selectToPile", "selection", pile.id, this.id, true);
			}
		}
		
		this.stopDragging();
	}
	
	stopDragging()
	{		
		this.isDragged = false;
		document.body.removeEventListener("mousemove", this.doDragUpdate);
		document.body.removeEventListener("mouseup", this.doDragEnd);
		
		this.getState().removeSelected();
	}
	
	getIntersectedQuantityInHand(card) 
	{
		return Math.min(this.getTrueX() + this.width, card.getTrueX() + card.width) - Math.max(this.getTrueX(), card.getTrueX());
	}
	
	getTrueX() 
	{
		if (this.hand == null) 
		{
			return this.x;
		} 
		else 
		{
			return this.x + this.hand.getX() - this.hand.dom.scrollLeft;
		}
	}
	
	getTrueY() 
	{
		if (this.hand == null) 
		{
			return this.y;
		} 
		else 
		{
			return this.y + this.hand.getY();
		}
	}
	
	getCenteredX()
	{
		return this.getX() + (Card.width / 2);
	}
	
	getCenteredY()
	{
		return this.getY() + (Card.height / 2);
	}
	
	setCenteredX(x)
	{
		this.setX(x - (Card.width / 2));
	}
	
	setCenteredY(y)
	{
		this.setY(y - (Card.height / 2));
	}
	
	putBorder(id, length)
	{		
		let color = new Random(id).generateColor();
		
		this.dom.style.boxShadow = "0px 0px " + Pile.borderWidth + "px " + (Pile.borderWidth / 2) + "px rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
		this.dom.style.backgroundColor = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
		
		this.borderCountdown = length == undefined ? 50 : length;
	}
	
	removeBorder()
	{
		this.dom.style.boxShadow = "none";
		this.dom.style.backgroundColor = "transparent";
	}
}