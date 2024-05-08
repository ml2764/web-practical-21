const tableBody = document.getElementById("rooms");

/**
 * Creates a new table row containing information about a Room.
 * @param {Room} room 
 * @returns An HTML row element (<tr>) containing information about the room
 */
function createRow(room) {
    const newRow = document.createElement("tr");
    const building = document.createElement("td");
    building.innerText = room.buildingName;
    const roomNumber = document.createElement("td");
    roomNumber.innerText = room.roomNumber;
    const roomType = document.createElement("td");
    if (room.hasOwnProperty("occupants")) {
        roomType.innerText = "Office";
    } else if (room.hasOwnProperty("numSeats")) {
        roomType.innerText = "Classroom"
    }
    else {
        roomType.innerText = "Unspecified"
    }
    newRow.appendChild(building);
    newRow.appendChild(roomNumber);
    newRow.appendChild(roomType);
    return newRow;
}

/**
 * Clears the table and repopulates it with rooms in the rooms array
 */
function showAllRooms() {
    const rooms = getAllRooms();
    // Clear the current table contents
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    for (let room of rooms) {
        tableBody.appendChild(createRow(room));
    }
}

showAllRooms();