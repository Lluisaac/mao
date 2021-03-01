/**
 * Entity class representing an element in the game
 */
class Entity
{
    /**
     * Build a new Entity
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
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.angle = 0;

        this.visible = visible;
        this.depth = depth;
        
        this.state = owningState;
    }

    /**
     * Destroy the entity
     */
    destructor()
    {
    }
    
    /**
     * Retrieve the state where this entity is
     */
    getState(){ return this.state; }

    /**
     * Return the x coordinate of the entity
     */
    getX() { return this.x; }
    /**
     * Change the x coordinate of the entity
     */
    setX(newX) { this.x = newX;}

    /**
     * Return the y coordinate of the entity
     */
    getY() { return this.y; }
    /**
     * Change the y coordinate of the entity
     */
    setY(newY) { this.y = newY;}

    /**
     * Return the width of the entity
     */
    getWidth() { return this.width; }
    /**
     * Change the width of the entity
     */
    setWidth(newWidth) {this.width = newWidth;};

    /**
     * Return the height of the entity
     */
    getHeight() { return this.height; }
    /**
     * Change the height of the entity
     */
    setHeight(newHeight) {this.height = newHeight;};

    /**
     * Return if the entity is visible
     */
	isVisible() { return this.visible; }
    /**
     * Change the visibility of the entity
     */
	setVisible(visible) { this.visible = visible; }

    /**
     * Return the depth of the entity
     */
    getDepth() { return this.depth; }
    /**
     * Change the depth of the entity
     */
    setDepth(depth) { this.depth = depth; }

    /**
     * Move the entity with the x increment and y increment
     */
    move(moveX, moveY)
    {
        this.setX(this.getX() + moveX);
        this.setY(this.getY() + moveY);
    }

    /**
     * Retrieve the angle in degree of the entity
     */
    getAngle()
    {
        return this.angle;
    }

    /**
     * Rotate the entity with angle in degree
     */
    rotate(angle)
    {
        this.angle = angle;
    }

    /**
     * Rotate the entity with angle in radian
     */
    rotateRad(angle)
    {
        rotate(angle * 57.295779513082);
    }

    /**
     * Return if the dot at the given coordinates is in the entity
     */
    isIn(testX, testY)
    {
        return this.x < testX && this.x + this.width > testX && this.y < testY && this.y + this.height > testY;
    }
    
    /**
     * Return if the dot at the given coordinates is around the entity in the given range
     */
    isAround(testX, testY, range)
    {
        return this.x - range < testX && this.x + this.width + range > testX && this.y - range < testY && this.y + this.height + range > testY;
    }

    /**
     * Return true if the both entity are colliding
     */
    collideWithEntity(entity)
    {
        return this.x < entity.x + entity.width && this.x + this.width > entity.x && this.y < entity.y + entity.height && this.y + this.height > entity.y;
    }

    /**
     * Return an array with [r, g, b, a] data of the pixel at the given coordinates
     */
    getCollisionDataWithLayer(layer, x, y)
    {
		return layer.getPixel(x, y);
    }
    
    /**
     * Return true if there is a collision with the given layer at the given coordinates
     */
    collideWithLayer(layerName, x, y)
    {
    	return this.getCollisionDataWithLayer(Layers.getLayer(layerName), x, y)[3] > 0;
    }

    /**
     * Return true if the entity is out od the game window
     */
    isOutOfGameWindow()
    {
        return this.x + this.width < 0 || this.x > getGameWidth() || this.y + this.height < 0 || this.y > getGameHeight();
    }

    /**
     * Add an event listener for the entity, the same way as DOM event
     */
	addEventListener(triggeredEvent, callback)
	{
		document.body.addEventListener(triggeredEvent, function(e){
			if(this.state == States.getCurrentState())
			{
				callback.bind(this)(e);
			}
		}.bind(this));
	}

    /**
     * Remove an event listener for the entity, the same way as DOM event
     */
	removeEventListener(triggeredEvent, callback)
	{
		document.body.removeEventListener(triggeredEvent, function(e){
			if(this.state == States.getCurrentState())
			{
				callback.bind(this)(e);
			}
		}.bind(this));
	}

    /**
     * A ready to use update function
     */
    update() { }
	
	getIntersectedPercent(other) {
		let value = 0;
		let left = Math.max(this.getX(), other.getX());
		let right = Math.min(this.getX() + this.getWidth(), other.getX() + other.getWidth());
		let top = Math.max(this.getY(), other.getY());
		let bottom = Math.min(this.getY() + this.getHeight(), other.getY() + other.getHeight());
		
		if (left < right && top < bottom) {
			value = (right - left) * (bottom - top);
		}
		
		return (value * 100) / (other.getWidth() * other.getHeight());
	}
}
