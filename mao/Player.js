module.exports = class Player {
	constructor(id) {
		this.id = id;
		this.hand = new Array();
		this.selected = undefined;
		
		this.connected = true;
	}
	
	isInHand(id)
	{
		for (let card of this.hand) 
		{
			if (card.id == id) {
				return true;
			}
		}
		
		return false;
	}
	
	removeCardFromHand(id)
	{
		for (let i = 0; i < this.hand.length; i++)
		{
			if (this.hand[i].id == id)
			{
				this.hand.splice(i, 1);
				i--;
			}
		}
	}
}