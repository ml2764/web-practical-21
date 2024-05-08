/**
 * Toggles form specific to each room type depending on room type selection
 */
const showRoomTypeFields = () => {
    if (document.getElementById("type").value === "office") {
        document.getElementById("office-details").style.display = "block";
        document.getElementById("classroom-details").style.display = "none";
    }
    else if (document.getElementById("type").value === "classroom") {
        document.getElementById("classroom-details").style.display = "block";
        document.getElementById("office-details").style.display = "none";
    }
}