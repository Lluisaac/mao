/**
 * State associative list
 */
var states = {};

/**
 * The state currently running
 */
var currentState = null;

/**
 * Class with static method to manage States
 */
class States
{
	/**
	 * Add a state with the stateName as name to the loaded states
	 */
	static addState(stateName, state)
	{
		states[stateName] = state;
		state.leave();
	}

	/**
	 * Retrieve the state with the given name
	 */
	static getState(name)
	{
		return states[name];
	}

	/**
	 * Retrieve the current running state
	 */
	static getCurrentState()
	{
		return currentState;
	}

	/**
	 * Reset the state with the given name
	 */
	static resetState(stateName)
	{
		states[stateName].reset();
	}

	/**
	 * Set the starting state with the firstStateName as name
	 */
	static startsWith(firstStateName)
	{
		if(currentState == null)
		{
			currentState = states[firstStateName];
			currentState.enter();
		}
		else
		{
			throw "The starting state is already defined";
		}
	}

	/**
	 * Change the current state for the state with newStateName as name
	 */
	static goToState(newStateName)
	{
		if(currentState != null)
		{
			currentState.leave();
			
			document.body.style.top = "0px";
			document.body.style.left = "0px";
			
			currentState = states[newStateName];
			currentState.enter();
		}
		else
		{
			throw "The starting is not yet setted";
		}
	}
}
