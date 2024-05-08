/**
 * This file contains utility functions and data structures that are used on multiple pages
 */

export const STORAGE_USER = "tkUser";
export const STORAGE_GOALS = "tkGoals";
export const STORAGE_EVENTS = "tkEvents";
const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60
export const MS_IN_HOUR = MS_IN_MINUTE * 60;

/**
 * Creates a new Goal object
 * @param {string} name The activity name
 * @param {number} duration The target time to spend on the activity in minutes
 */
export function Goal(name, duration) {
    this.name = name;
    this.duration = duration;
}

export function TrackingEvent(activityName, startTime) {
    this.activityName = activityName,
    this.startTime = startTime,
    this.endTime = startTime, // placeholder until tracking is finished
    this.isComplete = function() {
        return (this.endTime.getTime() - this.startTime.getTime()) > 0
    }
}

/**
 * Checks if the user is returning to the app or is a first time user.
 * Whether the user is new or returning is determined by the presence of a user name in local storage.
 * @returns {boolean} True if there is a name data in local storage, false otherwise.
 */
export const isReturningUser = () => {
    return getUser() !== null;
}

/**
 * Gets the user's name from storage, if it exists
 * @returns {string | null} The user's name (string) if it exists in storage, or null if it does not exist
 */
export const getUser = () => {
    return localStorage.getItem(STORAGE_USER);
}

/**
 * Checks if the user has saved goals in local storage.
 * @returns {boolean} True if there is at least one saved goal in local storage, false otherwise
 */
export const hasGoals = () => {
    return localStorage.getItem(STORAGE_GOALS) !== null && localStorage.getItem(STORAGE_GOALS).length > 0;
}

/**
 * Gets the saved goals from storage, if they exist
 * @returns {Goal[]} An array of Goal objects, which will be empty if there are no saved goals
 */
export const getGoals = () => {
    return hasGoals() ? JSON.parse(localStorage.getItem(STORAGE_GOALS)) : [];
}

/**
 * Checks if the user has tracked events in local storage.
 * @returns {boolean} True if there is at least one tracked event in local storage, false otherwise
 */
export const hasEvents = () => {
    return localStorage.getItem(STORAGE_EVENTS) !== null && localStorage.getItem(STORAGE_EVENTS).length > 0;
}

/**
 * Gets the saved events from storage, if they exist
 * @returns {TrackingEvent[]} An array of TrackingEvent objects, which will be empty if there are no saved events
 */
export const getEvents = () => {
    return hasEvents() ? JSON.parse(localStorage.getItem(STORAGE_EVENTS)) : [];
}

/**
 * Removes all child nodes from an element with the given id
 * @param {string} id The id of the element to remove child nodes from
 */
export const removeChildNodes = id => {
    const element = document.getElementById(id);
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Gets the difference between two Date objects in hours, minutes, and seconds
 * @param {Date} start 
 * @param {Date} end 
 * @returns {Object} The time differences with the following properties: hours, mins, secs
 */
export const getTimeDifference = (start, end) => {
    const msBtw = end.getTime() - start.getTime();
    const hours = Math.floor(msBtw / MS_IN_HOUR);
    const mins = Math.floor((msBtw - hours * MS_IN_HOUR) / MS_IN_MINUTE);
    const secs = Math.floor((msBtw - hours * MS_IN_HOUR - mins * MS_IN_MINUTE) / MS_IN_SECOND);
    /* This object uses JS shorthand to define properties that have the same name as the variable storing the value
    Equivalent to:
    {
        hours: hours,
        mins: mins,
        secs: secs
    }
    */
    const time = {
        hours, mins, secs
    }
    return time;
}

/**
 * Converts a time difference object to a a formatted string
 * @param {Object} time An object with properties: hours, mins, secs
 * @returns {string} A string in the format hh:mm:ss
 */
export const toTimeString = time => {
    return `${String(time.hours).padStart(2, "0")}:${String(time.mins).padStart(2, "0")}:${String(time.secs).padStart(2, "0")}`
}

/**
 * Removes the time from a Date object. The time will default to midnight.
 * @param {Date} fullDateTime A Date object.
 * @returns {Date} The Date object with time reset to midnight.
 */
export const getDateWithoutTime = fullDateTime => {
    return new Date(fullDateTime.getFullYear(), fullDateTime.getMonth(), fullDateTime.getDate());
}