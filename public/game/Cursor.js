class Cursor extends DisplayedEntity {
	constructor(owningState, id) {
		super(owningState);
		
		this.color = new Random(id).generateColor();
		
		this.dom = document.createElement("div"); 
		this.dom.style.overflowX = "hidden";
		this.dom.style.overflowY = "hidden";
		this.dom.style.position = "absolute";
		this.dom.style.border = "solid";
		this.dom.style.borderWidth = "thin";
		this.dom.style.borderRadius = "50%";
		
		this.dom.style.background = "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", 100)";
		
		this.dom.classList.add("cursor");
		
		document.body.appendChild(this.dom);
		
		this.setX(0);
		this.setY(0);
		this.setWidth(Cursor.size);
		this.setHeight(Cursor.size);
		this.setDepth(75);
	}
	
	static size = 16;
	
	moveTo(x, y)
	{
		this.setX(x - (Cursor.size / 2));
		this.setY(y - (Cursor.size / 2));
	}
}