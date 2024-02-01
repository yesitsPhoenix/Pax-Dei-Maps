function createOptionElement(name, category) {
    const option = document.createElement("div");
    option.className = "option";
    option.textContent = name;
    option.addEventListener("click", (event) => {
        onOptionSelect(event, category, name);
    });
    return option;
}

function toggleAndCloseSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const resourcesButton = document.getElementById('resources-button');
    const clearAllButton = document.querySelector('.clear-all-button');
    const loginButton = document.querySelector('.login-button');

    if (sidebar.classList.contains('open')) {
        // Sidebar is open, close it
        sidebar.classList.remove('open');

        // Reset the left positions to their default values
        resourcesButton.style.left = '105px';
        clearAllButton.style.left = '225px';
        loginButton.style.left = '10px';
    } else {
        // Sidebar is closed, open it
        sidebar.classList.add('open');

        // Calculate new left positions if sidebar is open based on initial positions in CSS
        const initialPositions = {
            resources: 105,
            clearAll: 225,
            login: 10,
        };

        resourcesButton.style.left = `${initialPositions.resources + 255}px`;

        if (clearAllButton) {
            clearAllButton.style.left = `${initialPositions.clearAll + 255}px`;
        }

        loginButton.style.left = `${initialPositions.login + 255}px`;
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar.open');
    if (sidebar) {
        sidebar.classList.remove('open');

        // Reset the left positions to their default values
        document.getElementById('resources-button').style.left = '105px';
        const clearAllButton = document.querySelector('.clear-all-button');
        if (clearAllButton) {
            clearAllButton.style.left = '225px';
        }

        const loginButton = document.querySelector('.login-button');
        if (loginButton) {
            loginButton.style.left = '10px';
        }
    }
}

const clearAllButton = document.querySelector('.clear-all-button');

if (clearAllButton) {
    clearAllButton.addEventListener('click', closeSidebar);
}


const closeButton = document.querySelector('.close-button');

if (closeButton) {
    closeButton.addEventListener('click', toggleSidebar);
}

document.addEventListener('DOMContentLoaded', () => {
    const infoButton = document.getElementById('info-button');
    const infoBox = document.querySelector('.info-box');
    let timeoutId;

    if (infoButton && infoBox) {
        infoButton.addEventListener('click', () => {
            clearTimeout(timeoutId);
            infoBox.classList.add('active');
        });

        infoButton.addEventListener('mouseout', () => {
            timeoutId = setTimeout(() => {
                infoBox.classList.remove('active');
            }, 5000);
        });
    }
});

// Function to handle dropdown menu selection
function onOptionSelect(event, category, name, lat, lng, rarity, iconUrl) {
    const selectedOption = event.target.textContent;
    const dropdownTitle = document.querySelector(`.${category}-dropdown .dropdown-title`);

    // Toggle the option selection
    if (selectedFruits.includes(selectedOption)) {
        // If the option is already selected, remove it from the selectedFruits array
        const index = selectedFruits.indexOf(selectedOption);
        if (index > -1) {
            selectedFruits.splice(index, 1);
        }
    } else {
        // If the option is not selected, add it to the selectedFruits array
        selectedFruits.push(selectedOption);
    }

    // Toggle the option selection for players
    if (selectedPlayers.includes(selectedOption)) {
        // If the option is already selected, remove it from the selectedPlayers array
        const index = selectedPlayers.indexOf(selectedOption);
        if (index > -1) {
            selectedPlayers.splice(index, 1);
        }
    } else {
        // If the option is not selected, add it to the selectedPlayers array
        selectedPlayers.push(selectedOption);
    }

    // Call updateMarkers() after selection to update the map markers
    updateMarkers();

    // Update the dropdown menu appearance to highlight orange
    updateDropdownAppearance();
}


// Function to add Orange color to selected menu options
function updateDropdownAppearance() {
    const dropdownOptions = document.querySelectorAll(".option");
    const dropdownTitle = document.querySelector(".dropdown-title");

    dropdownOptions.forEach((option) => {
        const name = option.textContent;
        const category = name === "Fruit" ? "fruit" : "animals";

        if (selectedPlayers.includes(name)) {
            option.style.backgroundColor = "orange";
            option.style.color = "black";
        } else {
            option.style.backgroundColor = "white";
            option.style.color = category === "fruit" ? "green" : "blue";
        }
    });

    // // Check if selectedPlayers array is empty to remove orange highlight from menu
    // const allDeselected = dropdownOptions.length === selectedPlayers.length;
    // if (allDeselected) {
    //     dropdownTitle.style.backgroundColor = category === "fruit" ? "green" : "blue";
    //     dropdownTitle.style.color = "transparent";
    // }
}
