const Pile = require("./Pile");
const Player = require("./Player");
const Card = require("./Card");

const util = require('util');

const MAX_INT = Number.MAX_SAFE_INTEGER;

module.exports = class GameSession 
{
	constructor() 
	{
		this.idSession = 0;
		this.cards = new Array();
		this.players = {};
		this.piles = new Array();
		
		this.maxId = MAX_INT;
		
		this.nbPlayers = 0;
		
		this.playerChanges = new Array();
		
		this.initSession();
	}
	
	static MAX_PLAYERS = 9;
	
	getCopy()
	{
		return {idSession: this.idSession, cards: this.cards, players: this.players, piles: this.piles, maxId: this.maxId, nbPlayers: this.nbPlayers};
	}
	
	addSocket(socket, clients)
	{
		this.socket = socket;
		this.clients = clients;
	}
	
	getRandomInt() 
	{
		return Math.round(Math.random() * this.maxId);
	}

	addPlayer(id) 
	{
		let found = false;
		
		for (let playerId in this.players) 
		{
			if (playerId == id) 
			{
				found = true;
			}
		}
		
		if (!found) 
		{
			this.players[id] = new Player(id);
			this.nbPlayers++;
		}
		else
		{
			this.players[id].connected = true;
		}
	}
	
	markDisconnected(id)
	{
		this.players[id].connected = false;
	}
	
	initSession() 
	{
		for (let i = 0; i < 54; i++) 
		{
			this.cards.push(new Card(i + 1, "b_red_2"));
		}
		
		let pile = new Pile(this.getRandomInt(), "Pioche");
		
		pile.x -= 60;
		
		for (let i = 0; i < 54; i++) 
		{
			pile.cards.push(this.cards[i]);
		}
		
		this.piles.push(pile);
		
		pile = new Pile(this.getRandomInt(), "Défausse");
		
		pile.x += 60;
		
		this.piles.push(pile);
		
		console.log("Jeu lancé");
	}
	
	getCard(id) 
	{		
		for (let card of this.cards) 
		{
			if (card.id == id) 
			{
				return card;
			}
		}
		
		return null;
	}
	
	removeCard(id)
	{
		for (let i = 0; i < this.cards.length; i++) 
		{
			if (this.cards[i].id == id) 
			{
				this.cards.splice(i, 1);
				i--;
			}
		}
	}
	
	getPile(id) 
	{		
		for (let pile of this.piles) 
		{
			if (pile.id == id) 
			{
				return pile;
			}
		}
		
		return null;
	}
	
	removePile(id)
	{		
		for (let i = 0; i < this.piles.length; i++) 
		{
			if (this.piles[i].id == id) 
			{
				this.piles.splice(i, 1);
				i--;
			}
		}
	}
	
	sendChange(change)
	{			
		if (change.player == undefined || change.player in this.players)
		{
			this.socket.emit("update", change);
		}
	}
	
	deny(idPlayer, idChange)
	{
		this.clients[idPlayer].emit("denied", {id: idChange});
	}
	
	updateWith(change) 
	{
		console.log(change);
		
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
		let pile = this.getPile(change.source);
		let player = this.players[change.player];
		
		if (pile != null && pile.cards.length > 0 && pile.cards[pile.cards.length - 1].id == change.object && player != undefined && player.selected == undefined) 
		{
			player.selected = this.getCard(change.object);
			pile.cards.pop();
			
			if (pile.cards.length == 0) 
			{
				for (let i = 0; i < this.piles.length; i++) 
				{
					if (this.piles[i].id == pile.id && pile.name == undefined) 
					{
						this.piles.splice(i, 1);
						i--;
					}
				}
			}
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applyHandToSelect(change)
	{
		let player = this.players[change.player];
		
		if (player != undefined && player.selected == undefined &&  player.hand.length > change.source && player.hand[change.source].id == change.object)
		{
			player.selected = this.getCard(change.object);
			player.removeCardFromHand(change.object);
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applySelectToHand(change)
	{
		let player = this.players[change.player];
		
		if (player != undefined && player.selected != undefined && player.selected.id == change.object)
		{
			player.selected = undefined;
			player.hand.splice(change.destination, 0, this.getCard(change.object));
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applySelectToPile(change)
	{
		let pile = this.getPile(change.destination);
		let player = this.players[change.player];
		
		if (pile != null && player != undefined && player.selected != undefined && player.selected.id == change.object) 
		{
			player.selected = undefined;
			pile.cards.push(this.getCard(change.object));
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applySelectToNewPile(change)
	{
		let player = this.players[change.player];
		
		if (player != undefined && player.selected != undefined && player.selected.id == change.object) 
		{
			let pile = new Pile(change.destination.id);
			pile.isFaceUp = change.destination.isFaceUp;
			
			this.piles.push(pile);
			
			player.selected = undefined;
			pile.cards.push(this.getCard(change.object));
			
			pile.x = change.destination.x;
			pile.y = change.destination.y;
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applyShufflePile(change)
	{		
		let pile = this.getPile(change.destination);
		
		if (pile != null && pile.cards.length > 0) 
		{
			pile.shuffle();
			
			let cards = new Array();
			
			for (let card of pile.cards)
			{
				cards.push(card.id);
			}
			
			this.sendChange({name: "shufflePile", destination: change.destination, object: cards});
		}
	}
	
	applyFlipPile(change)
	{		
		let pile = this.getPile(change.destination);
		
		if (pile != null) 
		{
			pile.flip();
			
			this.sendChange({name: "flipPile", destination: change.destination});
		}
	}
	
	applyPickupPile(change)
	{		
		let pile = this.getPile(change.source)
		let player = this.players[change.player];
		
		if (player != undefined && player.selected == undefined && pile != null)
		{
			player.selected = pile;
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applyPutDownPile(change)
	{		
		let pile = this.getPile(change.destination);
		let player = this.players[change.player];
		
		if (player != undefined && player.selected != undefined && player.selected.id == change.destination && pile != null) 
		{			
			player.selected = undefined;
			
			pile.x = change.object.x;
			pile.y = change.object.y;
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applyFusionPile(change)
	{		
		let pileSource = this.getPile(change.source);
		let pileDest = this.getPile(change.destination);
		let player = this.players[change.player];
		
		if (player != undefined && player.selected != undefined && player.selected.id == change.source && pileSource != null && pileDest != null) 
		{			
			player.selected = undefined;
			
			pileDest.addPile(pileSource);
			
			if (pileSource.name == undefined)
			{
				this.removePile(pileSource.id);
			}
			else
			{
				pileSource.clear();
			}
			
			this.sendChange(change);
		}
		else
		{
			this.deny(change.player, change.id);
		}
	}
	
	applyBuildPile(change)
	{		
		let pile = this.getPile(change.destination.id);
		
		if (pile == null && (this.isValidString(change.object.cards) || (change.object.cards.length == 0 && change.destination.name.length != 0))) 
		{
			let cards = new Array();
			
			let newPile = new Pile(change.destination.id, change.destination.name);
			this.piles.push(newPile);
			
			if (change.object.cards.length != 0)
			{
				let values = this.convertStringToValues(change.object.cards);
			
				for (let val of values)
				{
					let newCard = new Card(val, change.object.back);
					
					this.cards.push(newCard);
					cards.push(newCard);
					newPile.cards.push(newCard);
				}
			}
			
			this.sendChange({name: "buildPile", destination: {id: change.destination.id, x: newPile.x, y: newPile.y, name: change.destination.name}, object: cards});
		}
	}
	
	isValidString(str)
	{
		if (str.length > 0)
		{
			let splitted = str.split(",");
			
			for (let chunk of splitted)
			{
				let sub = chunk.split("-");
				
				if (sub.length == 1 || sub.length == 2)
				{
					for (let piece of sub)
					{
						if (isNaN(piece) || parseInt(piece) < 1 || parseInt(piece) > 54)
						{
							return false;
						}
					}
				}
				else
				{
					return false;
				}
			}
		
			return true;
		}
		else
		{
			return false;
		}
	}
	
	convertStringToValues(str)
	{
		let values = new Array();
		let splitted = str.split(",");
			
		for (let chunk of splitted)
		{
			let sub = chunk.split("-");
			
			 if (sub.length == 1)
			{
				values.push(parseInt(sub));
			}
			else if (sub.length == 2)
			{
				for (let i = parseInt(sub[0]); i < parseInt(sub[1]) + 1; i++)
				{
					values.push(i);
				}
			}
		}
		
		return values;
	}
	
	applyKickPlayer(change)
	{
		let player = this.players[change.destination];
		
		if (player != undefined && !player.connected)
		{
			delete this.players[player.id];
			this.nbPlayers--;
				
			this.sendChange({name: "kickPlayer", destination: change.destination});
			
			if (player.hand.length > 0 || player.selected != undefined)
			{
				let cards = new Array();
				
				let newPile = new Pile(this.getRandomInt());
				this.piles.push(newPile);
				
				for (let card of player.hand)
				{
					cards.push(card);
					newPile.cards.push(card);
				}
			
				this.sendChange({name: "buildPile", destination: {id: newPile.id, x: newPile.x, y: newPile.y}, object: cards});
			}
		}
	}
	
	applyDeletePile(change)
	{		
		let pile = this.getPile(change.destination);
		
		if (pile != null) 
		{			
			this.removePile(pile.id);
			
			for (let card of pile.cards)
			{
				this.removeCard(card.id);
			}
			
			this.sendChange({name: "deletePile", destination: pile.id, object: pile.cards});
		}
	}
}