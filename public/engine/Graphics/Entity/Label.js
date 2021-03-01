/**
 * Label class representing a simple displayed text
 */
class Label extends DisplayedEntity
{
	/**
     * Build a new Label
     * owningState : the state where the entity is
	 * text : the text of the label
     * x : the default x coordinate (0 by default)
     * y : the default y coordinate (0 by default)
     * width : the default width (0 by default)
     * height : the default height (0 by default)
     * visible : true if the entity must be visible (true by default)
     * depth : the depth of the entity, the greater value is on the top (2 by default)
     */
	constructor(owningState, text, x = 0, y = 0, width = 0, height = 0, visible = true, depth = 2)
	{
		super(owningState, x, y, width, height, visible, depth);

		this.text = text;

		this.dom = document.createElement("p");
		this.dom.style.position = "absolute";

		this.dom.innerHTML = text;
		this.dom.style.padding = "0";
		this.dom.style.margin = "0";
        this.dom.style.width = this.getWidth() + "px";
        this.dom.style.height = this.getHeight() + "px";
        this.dom.style.position = "absolute";
        this.dom.style.left = this.getX() + "px";
        this.dom.style.top = this.getY() + "px";
        this.dom.style.zIndex = depth;
        this.dom.style.display = this.visible ? "block" : "none";

        document.body.appendChild(this.dom);
	}

	/**
	 * Return the text of the label
	 */
	getText() { return this.text; }

	/**
	 * Change the text of the label
	 */
	setText(newText)
	{
		this.text = newText;
		this.dom.innerHTML = newText;
	}

	/**
	 * Append a piece of text at the label
	 */
	appendText(append)
	{
		this.setText(this.getText() + append);
	}
}
