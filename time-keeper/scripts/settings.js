import { getGoals, getEvents, isReturningUser, Goal, removeChildNodes, STORAGE_GOALS, STORAGE_USER, getTimeDifference, toTimeString, getUser } from "./lib.js";

/**
 * The file contains functionality related only to the settings page.
 */

const goals = getGoals();
const events = getEvents();

/** Functions to show and edit the user's name */
const displayName = () => {
    document.getElementById("current-name-text").innerText = getUser();
}

document.getElementById("name").addEventListener("change", event => {
    if (event.target.value.length > 0) {
        document.getElementById("save-name").classList.remove("disabled");
    } else {
        document.getElementById("save-name").classList.add("disabled");
    }
});

document.getElementById("save-name").addEventListener("click", (event) => {
    event.preventDefault()
    localStorage.setItem(STORAGE_USER, document.getElementById("name").value);
    document.getElementById("edit-name").classList.remove("disabled");
    displayName();
});


document.getElementById("edit-name").addEventListener("click", () => {
    document.getElementById("edit-name").classList.add("disabled");
});

document.getElementById("cancel-edit-name").addEventListener("click", () => {
    document.getElementById("edit-name").classList.remove("disabled");
});

/** End functions related to the user's name */

/** Functions related to the user's goals */

const showGoals = () => {
    if (goals.length > 0) {
        document.getElementById("goals-info").style.display = "none";
        const tableBody = document.getElementById("current-goals");
        for (let i = 0; i < goals.length; i++) {
            tableBody.innerHTML += `<tr>
                                    <td>${goals[i].name}</td>
                                    <td>${goals[i].duration}</td>
                                    <td>
                                        <div class="row">
                                            <div class="col-auto">
                                                <button class="btn btn-link mb-1" id="edit-goal-${i}" aria-label="Edit goal: ${goals[i].name}" title="Edit goal ${goals[i].name}" type="button" data-bs-toggle="collapse" data-bs-target="#edit-goal-form-${i}" aria-expanded="false" aria-controls="edit-goal-form-${i}"><i class="fa-solid fa-edit"></i></button>
                                            </div>
                                            <div class="col-auto ps-0">
                                                <button class="btn btn-link mb-1" id="delete-goal-${i}" aria-label="Delete goal: ${goals[i].name}" title="Delete goal ${goals[i].name}" type="button" ><i class="fa-solid fa-trash"></i></button>
                                            </div>
                                        </div>
                                        <form class="collapse" id="edit-goal-form-${i}">
                                            <label for="edit-name-${i}">Name:</label>
                                            <input type="text" class="form-control" id="edit-name-${i}" value="${goals[i].name}">
                                            <label for="edit-duration-${i}">Duration:</label>
                                            <input type="number" class="form-control" id="edit-duration-${i}" value="${goals[i].duration}">
                                            <button class="btn btn-primary" id="update-goal-${i}">Save</button>
                                        </form>
                                    </td>
                                    </tr>`;
            
            // Add event handlers for the dynamically generated buttons.
            document.getElementById(`update-goal-${i}`).addEventListener("click", () => {
                const newName = document.getElementById(`edit-name-${i}`).value;
                const newDuration = parseFloat(document.getElementById(`edit-duration-${i}`).value);
                updateGoal(i, newName, newDuration);
            });
            
            document.getElementById(`delete-goal-${i}`).addEventListener("click", () => {
                console.log("click");
                deleteGoal(i);
            }); 
        }
    }
}

document.getElementById("save-goal").addEventListener("click", event => {
    const activityName = document.getElementById("activity-name").value.trim();
    const activityHours = parseFloat(document.getElementById("activity-hours").value);
    const activityMins = parseFloat(document.getElementById("activity-mins").value);
    let errorMsg = "Please fix the following errors."
    let isValid = true;
    if (activityName.length === 0) {
        isValid = false;
        errorMsg += " Name cannot be blank.";
    }
    if (activityHours < 0 || activityMins < 0) {
        isValid = false;
        errorMsg += " Time cannot be negative.";
    }
    if (activityHours === 0 && activityMins === 0) {
        isValid = false;
        errorMsg += " Duration must be greater than 0.";
    }
    if (isValid) {
        removeChildNodes("activity-feedback");
        goals.push(new Goal(activityName, activityHours * 60 + activityMins));
        localStorage.setItem(STORAGE_GOALS, JSON.stringify(goals));
    } else {
        event.preventDefault();
        document.getElementById("activity-feedback").innerHTML = '<div class="alert alert-danger" role="alert"><p>' + errorMsg + '</p></div>';
    }

});

const updateGoal = (index, newName, newDuration) => {
    goals[index].name = newName;
    goals[index].duration = newDuration;
    localStorage.setItem(STORAGE_GOALS, JSON.stringify(goals));
}

const deleteGoal = index => {
    goals.splice(index, 1);
    localStorage.setItem(STORAGE_GOALS, JSON.stringify(goals));
    removeChildNodes("current-goals");
    showGoals();
}
/** End functions related to the user's goal */

/** Functions related to the user's tracking event history */
const showEvents = () => {
    if (events.length > 0) {
        document.getElementById("events-info").style.display = "none";
        const tableBody = document.getElementById("event-history");
        for (let i = 0; i < events.length; i++) {
            const start = new Date(events[i].startTime);
            const end = new Date(events[i].endTime);
            const diff = getTimeDifference(start, end);
            tableBody.innerHTML += `<tr>
                                    <td>${start.toLocaleString()}</td>
                                    <td>${end.toLocaleString()}</td>
                                    <td>${events[i].activityName}</td>
                                    <td>${toTimeString(diff)}</td>
                                    </tr>`;
        }
    }
}
/** End functions related to the user's tracking event history */

/** Page load */
if (isReturningUser()) {
    displayName();
}

showGoals();
showEvents();