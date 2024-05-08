import { getGoals, getEvents, TrackingEvent, getTimeDifference, 
         toTimeString, STORAGE_EVENTS } from "./lib.js";

/**
 * The file contains functionality related only to the tracking page.
 */

const goals = getGoals();
const events = getEvents();

let startTime = -1;
let currentEvent;

const populateSelect = () => {
    const activitySelect = document.getElementById("activity-select");
    for (let i = 0; i < goals.length; i++) {
        activitySelect.innerHTML += `<option value=${i}>${goals[i].name}</option>`;
    }
}

const updateTimer = () => {
    const now = new Date();
    const diff = getTimeDifference(startTime, now);
    document.getElementById("timer").innerText = toTimeString(diff);
}

document.getElementById("start-tracking").addEventListener("click", event => {
    startTime = new Date();
    const activityName = goals[parseInt(document.getElementById("activity-select").value)].name
    currentEvent = new TrackingEvent(activityName, startTime);
    updateTimer();
    setInterval(updateTimer, 1000);
    document.getElementById("activity-select").disabled = true;
    event.target.disabled = true;
});

document.getElementById("stop-tracking").addEventListener("click", () => {
    if (currentEvent !== undefined) {
        currentEvent.endTime = new Date();
        // save to storage
        events.push(currentEvent);
        localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
        // Update the UI
        document.getElementById("activity-select").disabled = false;
        document.getElementById("start-tracking").disabled = false;
        document.getElementById("timer").innerText = "00:00:00";
    }
})

populateSelect();