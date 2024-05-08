/**
 * A class representing a room
 */
class Room {
    buildingName;
    roomNumber;

    /**
     * Creates a new Room
     * @param {string} buildingName 
     * @param {number | string} roomNumber 
     */
    constructor(buildingName, roomNumber) {
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
    }

    /**
     * Creates a string for display purposes.
     * @returns A formatted string representing the room
     */
    display() {
        return this.buildingName + "/" + this.roomNumber;
    }
}

/**
 * A class representing an office
 */
class Office extends Room {
    occupants;

    /**
     * Creates a new office
     * @param {string} buildingName 
     * @param {number | string} roomNumber 
     * @param {string[]} occupants 
     */
    constructor(buildingName, roomNumber, occupants) {
        super(buildingName , roomNumber);
        this.occupants = occupants
    }

    /**
     * Checks if the room has occupants 
     * @returns {Boolean}
     */
    isOccupied() {
        return this.occupants.length > 0;
    }
}

/**
 * A Classroom class
 */
class Classroom extends Room {
    numSeats;
    hasProjector;

    /**
     * Constructs a Classroom
     * @param {string} buildingName 
     * @param {string | number} roomNumber 
     * @param {number} numSeats The number of seats
     * @param {Boolean} hasProjector Does the room have a projector
     */
    constructor(buildingName, roomNumber, numSeats, hasProjector) {
        super(buildingName, roomNumber);
        this.numSeats = parseInt(numSeats);
        this.hasProjector = hasProjector;
    }

    /**
     * Checks if the classroom is can accommodate the request
     * @param {number} requiredSeats Seats required
     * @param {Boolean} projectorRequired Whether a projector is required
     * @returns {Boolean}
     */
    isSuitable(requiredSeats, projectorRequired) {
        return this.numSeats >= requiredSeats && (this.hasProjector || !projectorRequired);
    }
}