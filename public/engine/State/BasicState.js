/**
 * Class representing a basic state with the minimum requiered
 */
class BasicState
{
	constructor(stateName)
	{
		this.name = stateName;
		this.nodes = new Array();
	}

	/**
	 * Retrieve the name of the state
	 */
	getName() { return this.name; }

	/**
	 * The init function to init state contents
	 */
	init()
	{

	}

	/**
	 * Function to call to finish the initializing of the state
	 */
	finishInit()
	{
		States.addState(this.name, this);
	}

	/**
	 * The update function to update state contents
	 */
	update()
	{

	}

	/**
	 * The reset function can be called to reset the state at its default configuration
	 */
	reset()
	{

	}

	/**
	 * The enter function is called when the current state switch to this state
	 */
	enter()
	{
		for(let i = 0; i < this.nodes.length; i++)
		{
			document.body.appendChild(this.nodes[i]);
		}
	}

	/**
	 * The leave function is called when the current state switch from this state
	 */
	leave()
	{
		this.nodes = new Array();

		while(document.body.firstChild)
		{
			this.nodes.push(document.body.firstChild);
			document.body.removeChild(document.body.firstChild);
		}
	}

	/**
     * Add an event listener for the state (Call only when this state is the current state), the same way as DOM event
     */
	addEventListener(triggeredEvent, callback)
	{
		document.body.addEventListener(triggeredEvent, function(e){
			if(States.getCurrentState() == this)
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
			if(States.getCurrentState() == this)
			{
				callback.bind(this)(e);
			}
		}.bind(this));
	}
}
