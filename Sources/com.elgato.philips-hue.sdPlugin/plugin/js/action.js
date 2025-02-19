/**
@file      action.js
@brief     Philips Hue Plugin
@copyright (c) 2019, Corsair Memory, Inc.
@license   This source code is licensed under the MIT-style license found in the LICENSE file.
*/

// Prototype which represents an action
function Action(inContext, inSettings) {
    // Init Action
    let instance = this;

    // Private variable containing the context of the action
    let context = inContext;

    // Private variable containing the settings of the action
    let settings = inSettings;

    // Set the default values
    setDefaults();

    // Public function returning the context
    this.getContext = () => {
        return context;
    };

    // Public function returning the settings
    this.getSettings = () => {
        return settings;
    };

    // Public function for settings the settings
    this.setSettings = inSettings => {
        settings = inSettings;
    };

    // Public function called when new cache is available
    this.newCacheAvailable = inCallback => {
        // Set default settings
        setDefaults(inCallback);
    };

    // Private function to set the defaults
    function setDefaults(inCallback) {
        // If at least one bridge is paired
        if (!(Object.keys(cache.data).length > 0)) {
            // If a callback function was given
            if (inCallback !== undefined) {
                // Execute the callback function
                inCallback();
            }
            return;
        }

        // Find out type of action
        let action;
        if (instance instanceof PowerAction) {
            action = 'com.elgato.philips-hue.power';
        }
        else if (instance instanceof ColorAction) {
            action = 'com.elgato.philips-hue.color';
        }
        else if (instance instanceof CycleAction) {
            action = 'com.elgato.philips-hue.cycle';
        }
        else if (instance instanceof BrightnessAction) {
            action = 'com.elgato.philips-hue.brightness';
        }
        else if (instance instanceof SceneAction) {
            action = 'com.elgato.philips-hue.scene';
        }

        // If no bridge is set for this action
        if (!('bridge' in settings)) {
            // Sort the bridges alphabetically
            let bridgeIDsSorted = Object.keys(cache.data).sort((a, b) => {
                return cache.data[a].name.localeCompare(cache.data[b].name);
            });

            // Set the bridge automatically to the first one
            settings.bridge = bridgeIDsSorted[0];

            // Save the settings
            saveSettings(action, inContext, settings);
        }

        // Find the configured bridge
        let bridgeCache = cache.data[settings.bridge];

        // If no light is set for this action
        if (!('light' in settings)) {
            // First try to set a group, because scenes only support groups
            // If the bridge has at least one group
            if (Object.keys(bridgeCache.groups).length > 0) {
                // Sort the groups automatically
                let groupIDsSorted = Object.keys(bridgeCache.groups).sort((a, b) => {
                    return bridgeCache.groups[a].name.localeCompare(bridgeCache.groups[b].name);
                });

                // Set the light automatically to the first group
                settings.light = groupIDsSorted[0];

                // Save the settings
                saveSettings(action, inContext, settings);
            }
            else if (Object.keys(bridgeCache.lights).length > 0) {
                // Sort the lights automatically
                let lightIDsSorted = Object.keys(bridgeCache.lights).sort((a, b) => {
                    return bridgeCache.lights[a].name.localeCompare(bridgeCache.lights[b].name);
                });

                // Set the light automatically to the first light
                settings.light = lightIDsSorted[0];

                // Save the settings
                saveSettings(action, inContext, settings);
            }
        }

        // If a callback function was given
        if (inCallback !== undefined) {
            // Execute the callback function
            inCallback();
        }
    }
}
