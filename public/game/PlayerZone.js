class PlayerZone extends DisplayedEntity {
	constructor(owningState, id, connected) 
	{
		super(owningState)
		
		this.id = id
		this.nbCards = 0;
		this.index = PlayerZone.nbOfPlayers;
		
		this.color = new Random(id).generateColor();
		
		this.dom = document.createElement("div"); 
		this.dom.style.overflowX = "auto";
		this.dom.style.overflowY = "hidden";
		this.dom.style.position = "absolute";
		this.dom.style.border = "solid";
		this.dom.style.textAlign = "center";
		this.dom.style.fontWeight = "bold";
		
		this.dom.style.background = "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ")";
		
		this.dom.classList.add("playerZone");
		
		document.body.appendChild(this.dom);
		
		this.name = document.createTextNode(id);
		this.dom.appendChild(this.name);
		
		this.text = document.createElement("div");
		this.text.appendChild(document.createTextNode("Cartes en main: " + this.nbCards));
		this.text.style.position = "absolute";
		this.text.style.bottom = "0";
		this.text.style.fontWeight = "normal";
		this.dom.appendChild(this.text);
		
		this.clear = document.createElement("div");
		let button = document.createElement("button");
		button.type = "button";
		let t = document.createTextNode("Expulser");
		button.appendChild(t);
		this.clear.appendChild(button);
		
		button.addEventListener('mouseup', (event) => {
			this.getState().addChange("kickPlayer", undefined, this.id, undefined, false);
		});
		
		this.setX(PlayerZone.offset + ((2 * PlayerZone.offset) * PlayerZone.nbOfPlayers) + (PlayerZone.width * PlayerZone.nbOfPlayers));
		this.setY(PlayerZone.offset);
		this.setWidth(PlayerZone.width);
		this.setHeight(PlayerZone.height);
		this.setDepth(0);
		
		if (connected) 
		{
			this.connected = true;
		}
		else
		{
			this.left();
		}
		
		PlayerZone.nbOfPlayers++;
	}
	
	static nbOfPlayers = 0;
	static width = 250;
	static height = 200;
	static offset = 10;
	
	update() 
	{
		
	}
	
	moveLeft()
	{
		this.setX(this.getX() - PlayerZone.width - (2 * PlayerZone.offset));
		this.index--;
	}
	
	addNbCards(nb)
	{
		this.nbCards += nb;
		this.text.childNodes[0].textContent = "Cartes en main: " + this.nbCards;
	}
	
	left()
	{
		this.displayClearButton();
		this.connected = false;
		this.name.textContent = this.id + " (déconnecté)";
	}
	
	joined()
	{
		this.hideClearButton();
		this.connected = true;
		this.name.textContent = this.id;
	}
	
	displayClearButton()
	{
		this.dom.appendChild(this.clear);
	}
	
	hideClearButton()
	{
		this.clear.remove();
	}
}