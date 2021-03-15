class GameState extends BasicState
{
	static COLLISION_PERCENT_MIN = 20;
	static CURSOR_UPDATE_FREQUENCY = 2;

	constructor()
	{
		super("game");
		this.camera = null;
		
		this.idSession = 0;
		this.idPlayer = 0;
		this.selectedElement = null;
		this.hand = null;
		this.piles = [];
		this.cards = [];
		this.zones = {};
		
		this.cursors = {};
		this.myCursor = {x: -100, y: -100};
		this.cursorTimer = 0;
		this.cursorMoved = false;
		
		this.changes = [];
		this.changeId = 0;
	}
	
	init(session, id)
	{	
		this.camera = new Camera();
		
		Layers.createLayer("background", "assets/table.jpg", true, true, -1);
		
		this.idSession = session.idSession;
		this.idPlayer = id;
		Random.maxId = session.maxId;
		
		this.buildMenu();
		this.buildSession(session);
		
		socket.on("update", (change) => {
			this.updateSession(change);
		});
		
		socket.on("isAlive", (nothing) => {
			socket.emit("stillAlive", this.idPlayer);
		});
		
		socket.on("denied", (id) => {
			this.rollbackTo(id);
		});
		
		socket.on("playerJoin", (id) => {
			this.addZone(id);
			this.addCursor(id);
		});
		
		socket.on("playerLeft", (id) => {
			this.zones[id].left();
		});
		
		socket.on("cursorMove", (info) => {
			if (info.id != this.idPlayer)
			{
				this.cursors[info.id].moveTo(info.x, info.y);
			}
		});
		
		document.body.addEventListener("keydown", this.keyPressed.bind(this));
		
		document.body.addEventListener("mousemove", this.doCursorMove.bind(this));
		
		this.finishInit();
	}
	
	addZone(id)
	{
		let found = false;
		
		for (let playerId in this.zones) 
		{
			if (playerId == id) 
			{
				found = true;
			}
		}
		
		if (!found) 
		{
			this.zones[id] = new PlayerZone(this, id, true);
		}
		else
		{
			this.zones[id].joined();
		}
	}
	
	addCursor(id)
	{
		if (id != this.idPlayer) 
		{
			let found = false;
			
			for (let playerId in this.cursors) 
			{
				if (playerId == id) 
				{
					found = true;
				}
			}
			
			if (!found) 
			{
				this.cursors[id] = new Cursor(this, id);
			}
		}
	}
	
	updateSession(change) 
	{
		if (change.length > 0)
		{
			//console.log(allChanges);
		}
		
		if (change.player != this.idPlayer && change.denied != true) 
		{
			this.applyChange(change);
		} 
		else if (change.player == this.idPlayer && change.denied != true)
		{
			if (this.isChangeInList(change.id))
			{
				this.removeChange(change.id)
			}
			else
			{
				this.applyChange(change);
			}
		}
	}
	
	getChangeIndex(id)
	{
		for (let i = 0; i < this.changes.length; i++)
		{
			let change = this.changes[i];
			
			if (change.player == this.idPlayer && change.id == id)
			{
				return i;
			}
		}
		
		return -1;
	}
	
	isChangeInList(id)
	{
		return this.getChangeIndex(id) != -1;
	}
	
	removeChange(id)
	{
		let index = this.getChangeIndex(id);
		
		if (index != -1)
		{
			this.changes.splice(index, 1);
		}
	}
	
	rollbackTo(id)
	{
		while(this.isChangeInList(id))
		{
			this.changes.pop();
		}
	}
	
	revertChange(change)
	{
		switch (change.name)
		{
			case "pileToSelect":
				this.revertPileToSelect(change);
				break;
			case "handToSelect":
				this.revertHandToSelect(change);
				break;
			case "selectToHand":
				this.revertSelectToHand(change);
				break;
			case "selectToPile":
				this.revertSelectToPile(change);
				break;
			case "selectToNewPile":
				this.revertSelectToNewPile(change);
				break;
			case "pickupPile":
				this.revertPickupPile(change);
				break;
			case "putDownPile":
				this.revertPutDownPile(change);
				break;
			case "fusionPile":
				this.revertFusionPile(change);
				break;
		}
	}
	
	applyAllChanges(allChanges, doLocalChanges)
	{
		for (let change of allChanges)
		{
			if (doLocalChanges || change.player != this.idPlayer)
			{
				applyChange(change);
			}
		}
	}
	
	applyChange(change)
	{
		switch (change.name)
		{
			case "pileToSelect":
				this.applyPileToSelect(change);
				break;
			case "handToSelect":
				this.applyHandToSelect(change);
				break;
			case "selectToHand":
				this.applySelectToHand(change);
				break;
			case "selectToPile":
				this.applySelectToPile(change);
				break;
			case "selectToNewPile":
				this.applySelectToNewPile(change);
				break;
			case "shufflePile":
				this.applyShufflePile(change);
				break;
			case "flipPile":
				this.applyFlipPile(change);
				break;
			case "pickupPile":
				this.applyPickupPile(change);
				break;
			case "putDownPile":
				this.applyPutDownPile(change);
				break;
			case "fusionPile":
				this.applyFusionPile(change);
				break;
			case "buildPile":
				this.applyBuildPile(change);
				break;
			case "kickPlayer":
				this.applyKickPlayer(change);
				break;
			case "deletePile":
				this.applyDeletePile(change);
				break;
		}
	}
	
	applyPileToSelect(change)
	{
		let card = this.getCard(change.object);
		let pile = this.getPile(change.source);
		
		pile.removeCard(change.object);
		
		if (change.player == this.idPlayer)
		{
			this.unselect();
			this.changeSelect(card);
		}
		else
		{
			pile.putBorder(change.player);
		}
	}
	
	revertPileToSelect(change)
	{
		let card = this.getCard(change.object);
		let pile = this.getPile(change.source);
		
		if (pile == null)
		{
			this.addPile(change.source, undefined, card.isFaceUp, card.getX(), card.getY()).addCard(card);
		}
		else
		{
			pile.addCard(card);
		}
		
		this.unselect();
	}
	
	applyHandToSelect(change)
	{
		if (change.player == this.idPlayer)
		{		
			let card = this.getCard(change.object);
		
			this.hand.removeCard(card);
			
			this.unselect();
			this.changeSelect(card);
		}
		
		this.zones[change.player].addNbCards(-1);
	}
	
	revertHandToSelect(change)
	{	
		let card = this.getCard(change.object);
	
		this.hand.addCard(card, change.source);
		
		this.unselect();
		
		this.zones[this.idPlayer].addNbCards(1);
	}
	
	applySelectToHand(change)
	{
		if (change.player == this.idPlayer)
		{		
			let card = this.getCard(change.object);
			
			this.hand.addCard(card, change.destination);
			
			this.unselect();
		}
		
		this.zones[change.player].addNbCards(1);
	}
	
	revertSelectToHand(change)
	{
		let card = this.getCard(change.object);
		
		this.hand.removeCard(card);
		
		this.unselect();
		this.changeSelect(card);
		
		this.zones[this.idPlayer].addNbCards(-1);
	}
	
	applySelectToPile(change)
	{
		let card = this.getCard(change.object);
		let pile = this.getPile(change.destination);
		
		pile.addCard(card);
		
		if (change.player == this.idPlayer)
		{
			this.unselect();
		}
		else
		{
			pile.putBorder(change.player);
		}
	}
	
	revertSelectToPile(change)
	{
		let card = this.getCard(change.object);
		let pile = this.getPile(change.destination);
		
		pile.removeCard(change.object);
		
		this.unselect();
		this.changeSelect(card);
	}
	
	applySelectToNewPile(change)
	{
		let card = this.getCard(change.object);
		
		if (card.isFaceUp != change.destination.isFaceUp)
		{
			card.flip();
		}
		
		let pile = this.addPile(change.destination.id, undefined, card.isFaceUp, change.destination.x, change.destination.y);
		pile.addCard(card);
		
		if (change.player == this.idPlayer)
		{
			this.unselect();
		}
		else
		{
			pile.putBorder(change.player);
		}
	}
	
	revertSelectToNewPile(change)
	{
		let card = this.getCard(change.object);
		let pile = this.getPile(change.destination.id);
		
		pile.removeCard(change.object);
		
		this.unselect();
		this.changeSelect(card);
	}
	
	applyShufflePile(change)
	{		
		let pile = this.getPile(change.destination);
		
		pile.changeOrder(change.object);
		pile.putBorder("server");
	}
	
	applyFlipPile(change)
	{		
		let pile = this.getPile(change.destination);
		
		pile.flip();
		pile.putBorder("server");
	}
	
	applyPickupPile(change)
	{
		if (change.player == this.idPlayer)
		{
			let pile = this.getPile(change.source);
			
			this.changeSelect(pile);
		}
	}
	
	revertPickupPile(change)
	{
		let pile = this.getPile(change.source);
		
		pile.setX(change.object.x);
		pile.setY(change.object.y);
		
		this.unselect();
	}
	
	applyPutDownPile(change)
	{
		let pile = this.getPile(change.destination);
		
		pile.setX(change.object.x);
		pile.setY(change.object.y);
		
		if (change.player == this.idPlayer)
		{
			this.unselect();
		}
		else
		{
			pile.putBorder(change.player);
		}
	}
	
	revertPutDownPile(change)
	{
		let pile = this.getPile(change.destination);
		
		this.unselect();
		this.changeSelect(pile);
	}
	
	applyFusionPile(change)
	{
		let pileSource = this.getPile(change.source);
		let pileDest = this.getPile(change.destination);
		
		pileSource.fuseOn(pileDest);
		
		if (change.player == this.idPlayer)
		{
			this.unselect();
		}
		else
		{
			pileDest.putBorder(change.player);
		}
	}
	
	revertFusionPile(change)
	{
		let pileDest = this.getPile(change.destination);
		
		let firstCard = this.getCard(change.object.cards.shift());
		
		let pileSource = null;
		
		if(change.object.name == undefined)
		{
			pileSource = this.addPile(change.source, undefined, firstCard.isFaceUp, firstCard.getX(), firstCard.getY());
		}
		else
		{
			pileSource = this.getPile(change.source);
		}
		
		pileSource.addCard(firstCard);
		
		pileDest.removeCard(firstCard.id);
		
		for (let id of change.object.cards)
		{
			let card = this.getCard(id);
			
			pileDest.removeCard(card.id);
			pileSource.addCard(card);
		}
		
		this.unselect();
		this.changeSelect(pileSource);
	}
	
	applyBuildPile(change)
	{		
		let pile = this.addPile(change.destination.id, change.destination.name, true, change.destination.x, change.destination.y);
		
		for (let card of change.object) {
			let newCard = new Card(this, card.value, card.id, this.getBackSprite(card.back));
			this.cards.push(newCard);
			pile.addCard(newCard);
		}
	}
	
	applyKickPlayer(change)
	{
		let oldZone = this.zones[change.destination];
		let oldCursor = this.cursors[change.destination];
		
		let index = oldZone.index;
		
		for (let id in this.zones) 
		{
			let zone = this.zones[id];
			
			if (zone.index > index)
			{
				zone.moveLeft();
			}
		}
		
		oldZone.dom.remove();
		oldCursor.dom.remove();
		
		delete this.zones[oldZone.id];
		delete this.zones[oldCursor.id];
		
		PlayerZone.nbOfPlayers--;
	}
	
	applyDeletePile(change)
	{
		let pile = this.getPile(change.destination);
		this.removePile(pile);
		
		for (let card of pile.cards)
		{
			this.removeCard(card);
		}
	}
	
	unselect()
	{
		if (this.selectedElement != null)
		{
			this.selectedElement.stopDragging();
		}
	}
	
	changeSelect(element)
	{
		document.body.appendChild(element.dom);
		element.dragStart({clientX: element.getX() + (Card.width / 2), clientY: element.getY() + (Card.height / 2)});
		this.selectedElement = element;
	}
	
	buildMenu()
	{
		let helpForm = this.buildHelpForm();
		
		this.help = new FormButton("assets/ui/help_unpressed.png", "assets/ui/help_pressed.png", this, helpForm);
		this.help.setX(10);
		this.help.setY(Game.getGameHeight() - 10 - FormButton.height);
		
		let addForm = this.buildAddForm();
		
		this.add = new FormButton("assets/ui/add_unpressed.png", "assets/ui/add_pressed.png", this, addForm);
		this.add.setX(20 + FormButton.width);
		this.add.setY(Game.getGameHeight() - 10 - FormButton.height);
	}
	
	getBasicForm()
	{
		let basic = document.createElement("div"); 
		basic.style.overflowX = "auto";
		basic.style.overflowY = "auto";
		basic.style.position = "absolute";
		basic.style.border = "solid";
		basic.style.textAlign = "center";
		basic.style.background = "rgb(255, 255, 255)"
		
		basic.style.left = (Game.getGameWidth() / 8) + "px";
		basic.style.top = (Game.getGameHeight() / 8) + "px";
		basic.style.width = ((Game.getGameWidth() * 6) / 8) + "px";
		basic.style.height = ((Game.getGameHeight() * 6) / 8) + "px";
		basic.style.zIndex = 150;
		
		return basic;
	}
	
	buildHelpForm()
	{
		let helpForm = this.getBasicForm();
		
		let h = document.createElement("H1");
		
		let t = document.createTextNode("Règles");
		h.appendChild(t);
		
		helpForm.appendChild(h);
		
		let list = document.createElement("ol");
		list.style.fontSize = "20px";
		
		let li = document.createElement("li");
		t = document.createTextNode("Il est interdit de parler des règles.");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("li");
		t = document.createTextNode("Les exceptions à la première règle sont la première et la deuxième règle.");
		li.appendChild(t);
		list.appendChild(li);
		
		helpForm.appendChild(list);
		
		h = document.createElement("H1");
		t = document.createTextNode("Touches");
		h.appendChild(t);
		helpForm.appendChild(h);
		
		list = document.createElement("ul");
		list.style.fontSize = "20px";
		
		li = document.createElement("li");
		t = document.createTextNode("Appuyez sur M avec le curseur au dessus d'une pile pour la bouger.");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("li");
		t = document.createTextNode("Appuyez sur S avec le curseur au dessus d'une pile pour la mélanger.");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("li");
		t = document.createTextNode("Appuyez sur F avec le curseur au dessus d'une pile pour la retourner.");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("li");
		t = document.createTextNode("Appuyez sur Shift + R avec le curseur au dessus d'une pile pour la supprimer avec tout son contenu.");
		li.appendChild(t);
		list.appendChild(li);
		
		helpForm.appendChild(list);
		
		return helpForm;
	}
	
	buildAddForm()
	{
		let addForm = this.getBasicForm();
		
		let h = document.createElement("H1");
		
		let t = document.createTextNode("Nouveau paquet");
		h.appendChild(t);
		
		addForm.appendChild(h);
		
		let form = document.createElement("form");
		form.style.fontSize = "20px";
		
		h = document.createElement("H4");
		t = document.createTextNode("Entrez les cartes voulues:");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("div");
		t = document.createTextNode("1-13: pique, 14-26: coeur, 27-39: trèfle, 40-52: carreau");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("div");
		t = document.createTextNode("Joker noir: 53, Joker rouge: 54");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("div");
		t = document.createTextNode("L'ordre est: As, 2, 3..., 10, Valet, Reine, Roi");
		h.appendChild(t);
		
		h = document.createElement("div");
		t = document.createTextNode("Exemple: Si je veux un paquet composé de toutes les cartes sauf les jokers, ce sera: 1-52");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("div");
		t = document.createTextNode("Exemple: Si je veux un paquet composé de toutes les cartes noires et les 2 rouges, ce sera: 1-13,15,27-39,41");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("div");
		t = document.createTextNode("(Laissez le champ vide pour créer une paquet vide nommé)");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("input");
		h.type = "text";
		h.id = "pileToGenerate";
		form.appendChild(h);
		
		h = document.createElement("H4");
		t = document.createTextNode("Entrez le nom du paquet:");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("div");
		t = document.createTextNode("(Optionnel, maximum 10 caractères)");
		h.appendChild(t);
		form.appendChild(h);
		
		h = document.createElement("input");
		h.type = "text";
		h.id = "pileName";
		form.appendChild(h);
		
		h = document.createElement("H4");
		t = document.createTextNode("Entrez le dos des cartes voulue:");
		h.appendChild(t);
		form.appendChild(h);
		
		let list = document.createElement("select");
		list.id = "pileBack";
		
		let li = document.createElement("option");
		li.value = "b_red_2";
		t = document.createTextNode("Rouge");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("option");
		li.value = "b_red_1";
		t = document.createTextNode("Rouge avec déco");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("option");
		li.value = "b_blue_2";
		t = document.createTextNode("Bleu");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("option");
		li.value = "b_blue_1";
		t = document.createTextNode("Bleu avec déco");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("option");
		li.value = "b_gray_2";
		t = document.createTextNode("Gris");
		li.appendChild(t);
		list.appendChild(li);
		
		li = document.createElement("option");
		li.value = "b_gray_1";
		t = document.createTextNode("Gris avec déco");
		li.appendChild(t);
		list.appendChild(li);
		
		form.appendChild(list);
		
		h = document.createElement("br");
		form.appendChild(h);
		
		h = document.createElement("button");
		h.type = "button";
		let b = document.createElement("b");
		b.style.fontSize = "20px"; 
		t = document.createTextNode("Générer");
		b.appendChild(t);
		h.appendChild(b);
		form.appendChild(h);
		
		h.addEventListener('mouseup', (event) => {
			let name = document.getElementById("pileName").value;
			name = name.substring(0, 10);
			this.addChange("buildPile", undefined, {id: Random.getRandomId(), name: name}, {cards: document.getElementById("pileToGenerate").value, back: document.getElementById("pileBack").value}, false);
		});
		
		addForm.appendChild(form);
		
		return addForm;
	}
	
	buildSession(session) 
	{
		console.log(session);
		
		this.buildCards(session.cards);
		this.buildPiles(session.piles);
		
		let selected = session.players[this.idPlayer].selected
		
		if (selected != undefined && this.getSelectable(selected.id) != null) 
		{
			this.changeSelect(this.getSelectable(selected.id));
		}
		
		this.buildPlayerZones(session.players);
		
		this.buildCursors(session.players);
		
		this.buildHand(session.players[this.idPlayer].hand);
	}
	
	buildPlayerZones(players)
	{
		for(let id in players)
		{
			this.zones[id] = new PlayerZone(this, id, players[id].connected);
			this.zones[id].addNbCards(players[id].hand.length);
		}
		
		let serveur = new PlayerZone(this, "Zone serveur", true);
		
		serveur.setX(PlayerZone.offset);
		serveur.setY((PlayerZone.offset * 3) + PlayerZone.height);
		
		serveur.text.remove();
		serveur.dom.style.background = "rgb(75, 75, 75)";

		PlayerZone.nbOfPlayers--;
		
	}
	
	buildCursors(players)
	{
		for(let id in players)
		{
			this.addCursor(id);
		}
	}
	
	buildCards(cards) 
	{
		for (let card of cards) {
			let newCard = new Card(this, card.value, card.id, this.getBackSprite(card.back));
			this.cards.push(newCard);
			newCard.dom.remove();
		}
	}
	
	getCard(id) 
	{		
		for (let card of this.cards) {
			if (card.id == id) {
				return card;
			}
		}
		
		return null;
	}
	
	removeCard(card) 
	{
		card.dom.remove();
		
		let index = this.cards.indexOf(card);
		
		this.cards.splice(index, 1);
	}
	
	getPile(id) 
	{		
		for (let pile of this.piles) {
			if (pile.id == id) {
				return pile;
			}
		}
		
		return null;
	}
	
	getSelectable(id)
	{
		let element = this.getCard(id);
		
		if (element == null)
		{
			element = this.getPile(id);
		}
		
		return element;
	}
	
	buildHand(hand) 
	{
		this.hand = new Hand(this);
		
		for (let card of hand) {
			this.hand.addCard(this.getCard(card.id), this.hand.cards.length);
		}
	}
	
	buildPiles(other) 
	{
		this.piles = new Array();
		
		for (let pile of other) 
		{
			let temp = this.addPile(pile.id, pile.name, pile.isFaceUp, pile.x, pile.y);
			
			for (let i = 0; i < pile.cards.length; i++) 
			{
				temp.addCard(this.getCard(pile.cards[i].id));
			}
		}
	}
	
	getBackSprite(name)
	{
		return "assets/cards/" + name + ".png";
	}
	
	addPile(id, name, isFaceUp, x, y) 
	{
		let pile = new Pile(this, id, name, isFaceUp, x, y);
		this.piles.push(pile);
		return pile;
	}
	
	removePile(pile) 
	{
		pile.dom.remove();
		
		let index = this.piles.indexOf(pile);
		
		this.piles.splice(index, 1);
	}
	
	setSelected(element) 
	{
		this.selectedElement = element;
	}
	
	removeSelected() 
	{
		let element = this.selectedElement;
		this.selectedElement = null;
		return element;
	}
	
	getCollidedPile(card) 
	{
		let best = null;
		let max = Number.NEGATIVE_INFINITY;
		
		for (let pile of this.piles) 
		{
			if (pile.id != card.id)
			{
				let value = pile.getIntersectedPercent(card);
				
				if (value > max && value > GameState.COLLISION_PERCENT_MIN) 
				{
					best = pile;
					max = value;
				}
			}
		}
		
		return best;
	}
	
	update()
	{
		this.camera.update();
		this.hand.update();
		
		if (this.selectedElement != null) {
			this.selectedElement.update();
		}
		
		for (let pile of this.piles) {
			pile.update();
		}
		
		this.cursorTimer++;
		
		if (this.cursorTimer == GameState.CURSOR_UPDATE_FREQUENCY)
		{
			if (this.cursorMoved)
			{
				socket.emit("cursorMove", {id: this.idPlayer, x: this.myCursor.x, y: this.myCursor.y});
				this.cursorMoved = false;
			}
			
			this.cursorTimer = 0;
		}
	}
	
	addChange(name, source, destination, object, isLocal) {
		let change = {id: this.changeId++, player: this.idPlayer, name: name, source: source, destination: destination, object: object};
		
		if (isLocal)
		{
			this.changes.push(change);
		}
		
		socket.emit("change", change);
	}
	
	keyPressed(event)
	{
		let pile = this.findHoveredPile();
		
		switch (event.keyCode) 
		{
			//S key
			case 83:
				if (pile != null)
				{
					pile.askShuffle();
				}
				break;
			//F key
			case 70:
				if (pile != null)
				{
					pile.askFlip();
				}
				else if (this.selectedElement != null)
				{
					this.selectedElement.flip();
				}
				break;
			//M key
			case 77:
				if (pile != null && this.selectedElement == null)
				{
					pile.pickup();
				}
				break;
			//R key
			case 82:
				if (pile != null && event.shiftKey)
				{
					this.addChange("deletePile", undefined, pile.id, undefined, false);
				}
				break;
		}
	}
	
	findHoveredPile()
	{
		for (let pile of this.piles)
		{
			if (pile.isMouseHovering)
			{
				return pile;
			}
		}
	}
	
	doCursorMove(event)
	{
		this.myCursor = {x: event.clientX, y: event.clientY};
		this.cursorMoved = true;
	}
}