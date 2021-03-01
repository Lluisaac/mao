/**
 * Camera class defining the view in the browser
 */
class Camera
{
	/**
	 * Build a Camera
	 * originX : the origin x coordinate of the Camera
	 * originY : the origin y coordinate of the Camera
	 */
	constructor(originX, originY)
	{
		this.originX = originX || (Game.getGameWidth() / 2);
		this.originY = originY || (Game.getGameHeight() / 2);
	}
	
	/**
	 * Return the origin x coordinate of the Camera
	 */
	getOriginX() { return this.originX; }
	/**
	 * Set the origin x coordinate of the Camera
	 */
	setOriginX(neworiginX) { this.originX = neworiginX; }
	
	/**
	 * Return the origin y coordinate of the Camera
	 */
	getOriginY() { return this.originY; }
	/**
	 * Set the origin x coordinate of the Camera
	 */
	setOriginY(neworiginY) { this.originY = neworiginY; }
	
	/**
	 * Move the camera with an increment of the coordinates
	 * moveX : the x increment
	 * moveY : the y increment
	 */
	moveCamera(moveX, moveY)
	{
		this.setOriginX(this.getOriginX() + moveX);
		this.setOriginY(this.getOriginY() + moveY);
	}
	
	/**
	 * Update the view with the Camera
	 */
	update()
	{
		document.body.style.left = Game.getGameWidth() / 2 - this.getOriginX() + "px";
		document.body.style.top = Game.getGameHeight() / 2 - this.getOriginY() + "px";
	}
}
