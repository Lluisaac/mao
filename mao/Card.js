module.exports = class Card {
	constructor(val, back) {
		this.id = Card.nextId;
		Card.nextId++;
		this.value = val;
		
		this.back = back;
	}
	
	static nextId = 0;
}