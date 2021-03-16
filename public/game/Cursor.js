class Cursor extends DisplayedEntity {
	constructor(owningState, id) {
		super(owningState);
		
		this.color = new Random(id).generateColor();
		
		this.dom = document.createElement("div"); 
		this.dom.style.overflowX = "hidden";
		this.dom.style.overflowY = "hidden";
		this.dom.style.position = "absolute";
		this.dom.style.userSelect= "none";
		this.dom.style.border = "solid";
		this.dom.style.borderWidth = "thin";
		this.dom.style.borderRadius = "50%";
		
		this.dom.style.background = "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", 100)";
		
		this.dom.classList.add("cursor");
		
		document.body.appendChild(this.dom);
		
		this.setX(-100);
		this.setY(-100);
		this.setWidth(Cursor.size);
		this.setHeight(Cursor.size);
		this.setDepth(Cursor.depth);
		
		this.hidden = false;
		
		this.selected = null;
	}
	
	static depth = 75;
	static size = 16;
	
	moveTo(x, y)
	{
		this.setX(x - (Cursor.size / 2));
		this.setY(y - (Cursor.size / 2));
		
		if (this.collideWithEntity(this.getState().hand) && !this.hidden)
		{
			this.hidden = true;
			this.dom.style.visibility = "hidden";
			
			if (this.selected != null)
			{
				this.selected.dom.style.visibility = "hidden";
			}
		}
		else if (!this.collideWithEntity(this.getState().hand) && this.hidden)
		{
			this.hidden = false;
			this.dom.style.visibility = "visible";
			
			if (this.selected != null)
			{
				this.selected.dom.style.visibility = "visible";
			}
		}
		
		if (!this.hidden && this.selected != null)
		{
			this.selected.setCenteredX(x);
			this.selected.setCenteredY(y);
		}
	}
	
	unselectOther()
	{
		this.selected.dom.style.visibility = "visible";
		this.selected.removeBorder();
		this.selected = null;
	}
	
	selectOther(element)
	{
		document.body.appendChild(element.dom);
		
		this.selected = element;
		this.selected.setDepth(Cursor.depth - 1);
		
		this.selected.setCenteredX(this.getX() + (Cursor.size / 2));
		this.selected.setCenteredY(this.getY() + (Cursor.size / 2));
	}
}