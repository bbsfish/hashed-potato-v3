'use strict';

/**
 * Logs an event.
 * @param {string} category - The object that was interacted with.
 * @param {string} action - The type of interaction.
 * @param {string} [label] - Useful for categorizing events.
 * @param {number} [value] - A numeric value associated with the event.
 */
function myEvent(category, action, label, value) {
    console.log('🔔', category, action, label, value);
}

async function myConfirm (message, subButton = "Cancel", mainButton = "OK"){
    if (window.confirm(message)) {
        return new Promise(resolve => resolve(true));
    } else {
        return new Promise(resolve => resolve(false));
    }
}

async function myPrompt (message = "入力"){
    const input = window.prompt(message);
    return new Promise((resolve) => {
        myEvent("myPrompt input", message, input);
        resolve(input);
    });
}