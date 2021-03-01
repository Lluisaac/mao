class Pile extends DisplayedEntity {
	constructor(owningState, id, name, isFaceUp, x, y) {
		super(owningState);
		
		this.id = id;
		this.name = name;
		this.isFaceUp = isFaceUp;
		
		this.isMouseHovering = false;
		this.isDragged = false;
		
		this.cards = new Array();
		
		this.initGraphics(x, y);
	}
	
	initGraphics(x, y)
	{
		this.dom = document.createElement("div"); 
		this.dom.style.overflowX = "hidden";
		this.dom.style.overflowY = "hidden";
		this.dom.style.position = "absolute";
		this.dom.style.display = "flex";
		this.dom.style.justifyContent = "center";
		
		document.body.appendChild(this.dom);
		
		this.text = document.createElement("div");
		this.text.appendChild(document.createTextNode(this.name));
		this.text.style += "-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;";
		this.text.style.position = "absolute";
		this.text.style.bottom = "0";
		this.text.style.fontWeight = "bold";
		this.dom.appendChild(this.text);
		
		this.setWidth(Card.width + (2 * Pile.offsetX));
		this.setHeight(Card.height + (2 * (Pile.offsetY + Pile.borderWidth)));
		this.setDepth(20);
		
		this.dom.classList.add("pile");
		
		this.image = document.createElement("img");
        this.image.setAttribute("draggable", false);
        this.image.ondragstart = function() { return false; };
		this.image.style += "pointer-events: none; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
        this.image.classList.add("textured-entity");
        this.image.src = Pile.emptySprite;
        this.image.style.position = "relative";
		this.image.style.width = Card.width + "px";
		this.image.style.height = Card.height + "px";
		this.image.style.marginTop = Pile.borderWidth + "px";
		this.dom.appendChild(this.image);
		
		this.setX(x);
		this.setY(y);
		
		this.image.addEventListener("mousedown", this.takeCard.bind(this));
		
		this.image.addEventListener("mouseover", this.enter.bind(this));
		this.image.addEventListener("mouseleave", this.leave.bind(this));
		
		this.setCorrectText();
	}
	
	static offsetX = 30;
	static offsetY = 10;
	static borderWidth = 6;
	static emptySprite = "assets/cards/empty.png";
	
	enter(event)
	{
		this.isMouseHovering = true;
	}
	
	leave(event)
	{
		this.isMouseHovering = false;
	}
	
	update() {
		if (this.isDragged) 
		{
			this.updateDraggingCoord();
		}		
		
		if (this.borderCountdown == 0)
		{
			this.removeBorder();
		}
		
		if (this.borderCountdown >= 0) {
			this.borderCountdown--;
		}
	}
	
	putBorder(id)
	{		
		let color = new Random(id).generateColor();
		
		this.image.style.boxShadow = "0px 0px " + Pile.borderWidth + "px " + (Pile.borderWidth / 2) + "px rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
		this.image.style.backgroundColor = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
		
		this.borderCountdown = 50;
	}
	
	removeBorder()
	{
		this.image.style.boxShadow = "none";
		this.image.style.backgroundColor = "transparent";
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
		this.isDragged = true;
		
		this.dragUpdate(event);
		
		this.updateDraggingCoord();
		
		this.getState().setSelected(this);
		
		document.body.addEventListener("mousemove", this.doDragUpdate);
		this.image.addEventListener("mousedown", this.doDragEnd);
		
		this.setDepth(101);
	}
	
	dragUpdate(event) 
	{
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}
	
	dragEnd(event) 
	{
		let pile = this.getState().getCollidedPile(this);
		
		this.stopDragging();
		
		if (pile == null) 
		{
			this.getState().addChange("putDownPile", "selection", this.id, {x: this.getCardX(), y: this.getCardY()}, true);
		} 
		else 
		{
			let cardIds = new Array();
			
			for (let card of this.cards)
			{
				cardIds.push(card.id);
			}
			
			this.getState().addChange("fusionPile", this.id, pile.id, {name: this.name, cards: cardIds, x: this.getCardX(), y: this.getCardY()}, true);
			
			this.fuseOn(pile);
		}
	}
	
	stopDragging()
	{		
		this.isDragged = false;
		document.body.removeEventListener("mousemove", this.doDragUpdate)
		this.image.removeEventListener("mousedown", this.doDragEnd);
		
		this.getState().removeSelected();
		this.setDepth(20);
	}
	
	setSprite(image)
	{
		this.image.src = image;
	}
	
	updateSprite() 
	{
		if (this.cards.length == 0) 
		{
			if (this.name == undefined) 
			{
				this.getState().removePile(this);
			}
			else
			{
				this.setSprite(Pile.emptySprite);
			}
		}
		else 
		{
			this.setSprite(this.cards[this.cards.length - 1].getSprite());
		}
			
		this.setCorrectText();
	}
	
	setCorrectText()
	{
		this.text.childNodes[0].textContent = "";
		
		if (this.name != undefined)
		{
			if (this.isFaceUp) {
				this.text.childNodes[0].textContent = "🔺";
			}
			else
			{
				this.text.childNodes[0].textContent = "🔻";
			}
			
			this.text.childNodes[0].textContent += this.name + ": ";
		}
			
		this.text.childNodes[0].textContent += this.cards.length;
	}
	
	addCard(card) 
	{
		card.dom.remove();
		this.cards.push(card);
		
		if (this.isFaceUp != card.isFaceUp)
		{
			card.flip();
		}
		
		this.updateSprite();
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
		
		this.updateSprite();
	}
	
	clear()
	{
		this.cards = new Array();
		
		this.updateSprite();
	}
	
	takeCard(event) 
	{
		if (!this.isDragged && this.cards.length > 0)
		{
			this.getState().addChange("pileToSelect", this.id, "selection", this.cards[this.cards.length - 1].id, true);
			
			let taken = this.cards.pop();
			document.body.appendChild(taken.dom);
			taken.dragStart(event);
			
			this.updateSprite();
		}
	}
	
	removeCard(id)
	{
		for (let i = 0; i < this.cards.length; i++)
		{
			if (this.cards[i].id == id) 
			{
				this.cards.splice(i, 1);
			}
		}
		
		this.updateSprite();
	}
	
	askShuffle()
	{
		this.getState().addChange("shufflePile", "", this.id, "", false);
	}
	
	changeOrder(idList)
	{
		this.cards = new Array();
		
		for (let id of idList)
		{
			let card = this.getState().getCard(id);
			this.addCard(card);
		}
	}
	
	askFlip()
	{
		this.getState().addChange("flipPile", "", this.id, "", false);
	}
	
	flip()
	{
		this.isFaceUp = !this.isFaceUp;
		
		let temp = this.cards;
		this.cards = new Array();
		
		for (let card of temp)
		{
			this.cards.unshift(card);
			card.flip();
		}
		
		this.updateSprite();
	}
	
	pickup()
	{
		this.getState().changeSelect(this);
		this.getState().addChange("pickupPile", this.id, "selection", {x: this.getCardX(), y: this.getCardY()}, true);
		
		this.originalX = this.getCardX();
		this.originalY= this.getCardY();
	}
	
	fuseOn(other)
	{
		other.addPile(this);
		
		if (this.name == undefined)
		{
			this.getState().removePile(this);
		}
		else
		{
			this.clear();
			this.setX(this.originalX + Pile.offsetX);
			this.setY(this.originalY);
		}
	}
	
	getIntersectedPercent(card) {
		let value = 0;
		let left = Math.max(this.getCardX(), card.getX());
		let right = Math.min(this.getCardX() + Card.width, card.getX() + card.getWidth());
		let top = Math.max(this.getCardY(), card.getY());
		let bottom = Math.min(this.getCardY() + Card.height, card.getY() + card.getHeight());
		
		if (left < right && top < bottom) {
			value = (right - left) * (bottom - top);
		}
		
		return (value * 100) / (card.getWidth() * card.getHeight());
	}
	
	getCardX()
	{
		return this.getX() + Pile.offsetX;
	}
	
	getCardY()
	{
		return this.getY();
	}
	
	setX(x)
	{
		super.setX(x - Pile.offsetX);
	}
	
	setY(y)
	{
		super.setY(y - Pile.borderWidth);
	}
}