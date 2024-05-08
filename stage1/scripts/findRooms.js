const typeSelect = document.getElementById("type");

/** Show / hide the form inputs that are relevant to the selected room type */
typeSelect.addEventListener("change", showRoomTypeFields);

document.getElementById("search").addEventListener("click", function (event) {
    event.preventDefault();
    const rooms = getAllRooms();
    console.log(rooms);
    if (typeSelect.value === "office") {
        populateResults(rooms.filter(room => room instanceof Office && room.occupants.length === 0));
    } else {
        const seatsNeeded = document.getElementById("numSeats").value === "" ? 0 : document.getElementById("numSeats").value;
        const projectorNeeded = document.getElementById("projector-yes").checked;
        populateResults(rooms.filter(room => room instanceof Classroom && seatsNeeded <= room.numSeats && (!projectorNeeded || room.hasProjector)));
    }
});

function populateResults(selectedRooms) {
    const results = document.getElementById("results");
    const p = document.createElement("p");
    if (selectedRooms.length === 0) {
        p.innerText = "No matching rooms found";
    } else {
        p.innerText = `Matching rooms: ${selectedRooms.map(room => `${room.buildingName}/${room.roomNumber}`).join(", ")}`;
    }
    while (results.children.length > 0) {
        results.removeChild(results.firstChild);
    }
    results.appendChild(p);
}