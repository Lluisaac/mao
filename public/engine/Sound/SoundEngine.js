/**
 * Associative array of loaded sounds
 */
var sounds = {};

/**
 * General Volume of the Sound Engine
 */
var generalVolume = 1;

/**
 * Engine to manage sounds
 */
class SoundEngine
{
    /**
     * Load a new Sound
     * name : name of the new sound (replace if exist)
     * sound : path to the sound
     */
    static loadSound(name, sound)
    {
        sounds[name] = new Audio(sound);
        sounds[name].volume = generalVolume;
    }

    /**
     * Play the sound with the given name
     * name : name of the sound to be played
     */
    static playSound(name)
    {
        sounds[name].play();
    }

    /**
     * Loop the sound with the given name
     * name : name of the sound to be played
     */
    static loopSound(name)
    {
        sounds[name].loop = true;
        SoundEngine.playSound(name);
    }

    /**
     * Pause the sound with the given name
     * name : name of the sound to be played
     */
    static pauseSound(name)
    {
        sounds[name].pause();
    }

    /**
     * Stop the sound with the given name
     * name : name of the sound to be played
     */
    static stopSound(name)
    {
        sounds[name].loop = false;
        SoundEngine.pauseSound();
    }

    /**
     * re-play the sound from the start
     */
    static restartSound(name)
    {
        SoundEngine.resetSound(name);
        SoundEngine.playSound(name);
    }

    /**
     * Restart the loop on the sound with the given name
     */
    static restartLoopSound(name)
    {
        SoundEngine.resetSound(name);
        SoundEngine.loopSound(name);
    }

    /**
     * Retireve if the sound with the given name is paused
     */
    static isPaused(name)
    {
        return sounds[name].paused;
    }

    /**
     * Reset the sound with the given name at the start
     */
    static resetSound(name)
    {
        sounds[name].currentTime = 0;
    }

    /**
     * Change the General volume (in percent)
     */
    static setGeneralVolume(vol)
    {
        let percent = vol/100;

        for(let name in sounds)
        {
            if(sounds[name].volume == generalVolume)
            {
                sounds[name].volume = percent;
            }
        }

        generalVolume = percent;
    }

    /**
     * Retrieve the general volume in percent
     */
    static getGeneralVolume()
    {
        return generalVolume*100;
    }

    /**
     * Change the volume of the sound with the given name (in percent)
     */
    static setSoundVolume(name, vol)
    {
        sounds[name].volume = vol/100;
    }

    /**
     * Retrieve the volume of the sound with the given name
     */
    static getSoundVolume(name)
    {
        return sounds[name].volume*100;
    }

    /**
     * Mute or unmute a sound
     */
    static setSoundMuted(name, muted)
    {
        sounds[name].muted = muted;
    }

    /**
     * Mute the sound with the given name
     */
    static muteSound(name)
    {
        setSoundMuted(name, true);
    }

    /**
     * Unmute the sound with the given name
     */
    static unmuteSound(name)
    {
        setSoundMuted(name, false);
    }
}
