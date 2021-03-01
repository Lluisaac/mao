class Button extends TexturedEntity
{
    constructor(releasedImage, pressedImage, owningState, clickSoundName = null, x = 0, y = 0, width = 0, height = 0, visible = true, depth = 2)
    {
        super(owningState, x, y, width, height, releasedImage, visible, depth);

        this.releasedImage = releasedImage;
        this.pressedImage = pressedImage;

        this.clickSoundName = clickSoundName;

        this.currentlyPressed = false;

        this.addEventListener("mousedown", this.pressed);
        this.addEventListener("mouseup", this.released);
    }

    pressed(e)
    {
        if(this.isIn(e.clientX, e.clientY))
        {
            this.currentlyPressed = true;

            this.setSprite(this.pressedImage);

            if(this.clickSoundName != null)
            {
                SoundEngine.playSound(this.clickSoundName);
            }
        }
    }

    released(e)
    {
        if(this.currentlyPressed)
        {
            this.setSprite(this.releasedImage);

            if(this.isIn(e.clientX, e.clientY))
            {
                this.action();
            }
        }
    }

    action()
    {

    }
}
