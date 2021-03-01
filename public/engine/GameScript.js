/***
 ********************************************************
 ** Base Script of GameScript with the general Game class
 **
 ********************************************************
 **/

/**
 * Loop for ever over action() with a call every 17ms (~60 call per seconds)
 */
function loopForEver(action)
{
    action();
    setTimeout(loopForEver, 17, action);
}

/**
 * Game class for general game function
 */
class Game
{
    /**
     * Start a new game with the given name.
     * the init function is called once at the game launching, an update function called every 17ms (~60 call per seconds) and an optional default background
     */
    static newGame(name, init, update, background = "")
    {
        document.title = name;
        document.body.style.overflow = "hidden";
        document.body.style.margin = "0";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.position = "absolute";
        document.body.style.left = "0px";
        document.body.style.top = "0px";

        if(background !== "")
        {
            new Layer("background", background, true, true, -1).addToGame();
        }

        init();
        loopForEver(update);
    }

    /**
     * Set the image at the given path as the background of the current game
     */
    static setBackground(background)
    {
        document.getElementById("background").src = background;
    }

    /**
     * Return the width of the current game
     */
    static getGameWidth()
    {
    	return window.innerWidth;
    }

    /**
     * Return the height of the current game
     */
    static getGameHeight()
    {
    	return window.innerHeight;
    }

    /**
     * Add an event listener for the game, the same way as DOM event
     */
	static addEventListener(triggeredEvent, callback)
	{
		document.body.addEventListener(triggeredEvent, callback);
	}

    /**
     * Remove an event listener for the game, the same way as DOM event
     */
	static removeEventListener(triggeredEvent, callback)
	{
		document.body.removeEventListener(triggeredEvent, callback);
	}
}

/**
 * Alias classes for Game generic functions
 */
class GameEngine extends Game {}
