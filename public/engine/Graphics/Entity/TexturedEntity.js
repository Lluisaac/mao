/**
 * TexturedEntity class representing a DisplayedEntity with a texture image as sprite
 */
class TexturedEntity extends DisplayedEntity
{
    /**
     * Build a new TexturedEntity
     * owningState : the state where the entity is
     * x : the default x coordinate (0 by default)
     * y : the default y coordinate (0 by default)
     * width : the default width (0 by default)
     * height : the default height (0 by default)
     * image : the path of the texture image
     * visible : true if the entity must be visible (true by default)
     * depth : the depth of the entity, the greater value is on the top (1 by default)
     */
    constructor(owningState, x = 0, y = 0, width = 0, height = 0, image = "", visible = true, depth = 1)
    {
    	super(owningState, x, y, width, height, visible, depth);

        this.dom = document.createElement("img");
        this.dom.setAttribute("draggable", false);
        this.dom.ondragstart = function() { return false; };
		this.dom.style += "pointer-events: none; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
        this.dom.classList.add("textured-entity");
        this.dom.src = image;
        this.dom.style.position = "absolute";
		
		this.setX(x);
		this.setY(y);
		this.setWidth(width);
		this.setHeight(height);
		this.setVisible(visible);
		this.setDepth(depth);
		
        document.body.appendChild(this.dom);

        this.currentAnimator = null;
        this.animating = false;
        this.currentFrame = 0;
        this.animation = new Array();
        this.frameDelay = 0;
    }

    /**
     * Change the sprite of the TexturedEntity
     */
    setSprite(image) { this.dom.src = image; }
	
	getSprite() { return this.dom.src; }

    /**
     * Anime the sprite with a sequence of image
     * imageArray : array of image path used in sequence by the animation
     * frameDelay : the delay between each frame of the sequence
     * force : true if the animation must be change even if the animation is already playing (false by default)
     */
	animate(imageArray, frameDelay, force = false)
	{
		if(!this.animating || force)
		{
			this.animating = true;
			this.currentFrame = 0;
			this.animation = imageArray;
			this.frameDelay = frameDelay;

			this.doAnimation();
		}
	}

    /**
     * Play the animation
     */
	doAnimation()
    {
      	if(this.animating)
      	{
            this.setSprite(this.animation[this.currentFrame]);

            this.currentFrame++;
            if(this.currentFrame >= this.animation.length){ this.currentFrame = 0; }

       		this.currentAnimator = setTimeout(this.doAnimation.bind(this), this.frameDelay);
      	}
    }
    
    /**
     * Anime the sprite once with a sequence of image, you can play an action during the animation and at the end
     * imageArray : array of image path used in sequence by the animation
     * frameDelay : the delay between each frame of the sequence
     * force : true if the animation must be change even if the animation is already playing (false by default)
     * midActionIndex : the index at which call the midAction
     * midAction : function called during the animation at the midActionIndex-th frame
     * endAction : function called at the end of the animation
     */
    animateOnce(imageArray, frameDelay, midActionIndex, midAction, endAction, force = false)
	{
		if(!this.animating || force)
		{
			this.animating = true;
			this.currentFrame = 0;
			this.animation = imageArray;
			this.frameDelay = frameDelay;
			
			this.midAnimationIndex = midActionIndex;
			this.midAnimationAction = midAction;
			this.endAnimationAction = endAction;
			
			this.doOnce();
		}
	}
	
	/**
     * Play the once animation
     */
	doOnce()
	{
		if(this.currentFrame == this.animation.length)
		{
			this.endAnimationAction.bind(this)();
			this.stopAnimation();
		}
		else
		{
			if(this.midAnimationIndex == this.currentFrame)
			{
				this.midAnimationAction.bind(this)();
			}

			this.setSprite(this.animation[this.currentFrame]);
			this.currentFrame++;
			this.currentAnimator = setTimeout(this.doOnce.bind(this), this.frameDelay);
		}
	}

    /**
     * Stop the current animation
     */
	stopAnimation()
	{
		this.animating = false;
        clearTimeout(this.currentAnimator);
        this.currentAnimator = null;
	}

    /**
     * Continue a stoped animation
     */
	continueAnimation()
	{
		this.animating = true;
		this.doAnimation(this);
	}

    /**
     * Restart an animation at its beginning
     */
	restartAnimation()
	{
		this.animating = true;
		this.currentFrame = 0;
		this.doAnimation(this);
	}
}
