/**
 * Class with static util methods
 */
class Util
{
	/**
	 * Mapping a value from [originMin OriginMax] to [targetMin, targetMax]
	 */
	static map(value, originMin, originMax, targetMin, targetMax)
	{
  		return (value - originMin) * (targetMax - targetMin) / (originMax - originMin) + targetMin;
	}
}
