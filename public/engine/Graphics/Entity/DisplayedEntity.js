/**
 * DisplayedEntity class representing an entity with a corresponding displayed DOM element
 */
class DisplayedEntity extends Entity
{
    /**
     * Build a new DisplayedEntity
     * owningState : the state where the entity is
     * x : the default x coordinate (0 by default)
     * y : the default y coordinate (0 by default)
     * width : the default width (0 by default)
     * height : the default height (0 by default)
     * visible : true if the entity must be visible (true by default)
     * depth : the depth of the entity, the greater value is on the top (1 by default)
     */
    constructor(owningState, x = 0, y = 0, width = 0, height = 0, visible = true, depth = 1)
    {
    	super(owningState, x, y, width, height, visible, depth);

        this.dom = null;
    }

    /**
     * Destroy the entity
     */
    destructor()
    {
        document.body.removeChild(this.dom);
    }

    /**
     * Change the x coordinate of the entity
     */
    setX(newX)
    {
    	super.setX(newX);
    	this.dom.style.left = this.x + "px";
    }
    /**
     * Change the y coordinate of the entity
     */
    setY(newY)
    {
    	super.setY(newY);
    	this.dom.style.top = this.y + "px";
    }

    /**
     * Change the width of the entity
     */
    setWidth(newWidth)
    {
    	super.setWidth(newWidth);
    	this.dom.style.width = this.width + "px";
    } 
    /**
     * Change the height of the entity
     */
    setHeight(newHeight)
    {
    	super.setHeight(newHeight);
    	this.dom.style.height = this.height + "px";
    }

    /**
     * Rotate the entity with angle in degree
     */
    rotate(angle)
    {
        super.rotate(angle);
        this.dom.style.transform = "rotate(" + this.angle + "deg)";
    }

    /**
     * Change the visibility of the entity
     */
    setVisible(visible)
    {
        super.setVisible(visible);
        this.dom.style.display = this.visible ? "block" : "none";
    }

    /**
     * Change the depth of the entity
     */
    setDepth(depth)
    {
        super.setDepth(depth);
        this.dom.style.zIndex = depth;
    }
}
