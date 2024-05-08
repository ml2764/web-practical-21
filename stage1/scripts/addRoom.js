/** Show / hide the form inputs that are relevant to the selected room type */
document.getElementById("type").addEventListener("change", showRoomTypeFields);

/**
 * Adds a new room when the form is submitted. Does not do any input validation.
 */
document.getElementById("add").addEventListener("click", function (event) {
    const roomType = document.getElementById("type").value;
    const building = document.getElementById("building").value.toUpperCase();
    const number = document.getElementById("number").value;
    let newRoom;
    /** IMPORTANT - this code is missing input validation, which would be important for a real form */
    if (roomType === "office") {
        const occupants = document.getElementById("occupants").value.length > 0 ?
                            document.getElementById("occupants").value
                                                              .split(",") // Splits the string at each comma and returns an array of strings
                                                              .map(name => name.trim()) // Trims whitespace from each entry in the array
                            : [];
        newRoom = new Office(building, number, occupants);
    } else if (roomType === "classroom") {
        const numSeats = document.getElementById("numSeats").value;
        const hasProjector = document.getElementById("projector").checked;
        newRoom = new Classroom(building, number, numSeats, hasProjector);
    }
    const rooms = getAllRooms();
    saveRooms([...rooms, newRoom]);
    event.preventDefault();
});