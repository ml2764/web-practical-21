const STORAGE_KEY = "WADD_rooms";

function getAllRooms() {
    const savedRooms = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedRooms === null) {
        return [];
    } else {
        const allRooms = savedRooms.map(room => {
            // Convert to office / classroom
            if (room.hasOwnProperty("occupants")) {
                return new Office(room.buildingName, room.roomNumber, room.occupants);
            } else {
                return new Classroom(room.buildingName, room.roomNumber, room.numSeats, room.hasProjector);
            }
        });
        return allRooms;
    }  
}

function saveRooms(rooms) {
    const jsonRooms = JSON.stringify(rooms);
    localStorage.setItem(STORAGE_KEY, jsonRooms);
}