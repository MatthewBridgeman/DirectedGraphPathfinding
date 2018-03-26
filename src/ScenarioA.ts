class Route {
    constructor(station: string, distance: number) { }
}

import fs = require('fs');

var stations: { [name: string]: { [name: string]: number } } = {}; // The data will be stored in a key: value array
var input = JSON.parse(fs.readFileSync("./src/input.json").toString()); // Imports the input data via json file

// The main output
console.log("Input : \n" + input + "\n");
loadData();
console.log("Output : \n" + outputAnswers());

// Loads the JSON data into objects
function loadData() {
    for (let i = 0; i < input.length; i++) {
        // Get the station names and distances
        let stationName = input[i].charAt(0);
        let routeDestination = input[i].charAt(1);
        let routeDistance = +input[i].charAt(2); // The + is an easy way to force the string to be a number

        // If the station's key hasn't been made yet, initialise the routes array
        if (stations[stationName] == null) {
            stations[stationName] = {};
        }
        // Set the distination for the route
        stations[stationName][routeDestination] = routeDistance;
    }
}

// Outputs the answers
function outputAnswers() {
    let output = `{
    "1": ${solveQ1()}
    "2": ${solveQ2()}
    "3": ${solveQ3()}
    "4": ${solveQ4()}
    "5": ${solveQ5()}
    "6": ${solveQ6()}
}`
    return output;
}

// Find the distance of the trip A-B-C
function solveQ1() {
    if ((stations['A'] != null) && (stations['B'] != null)) { //Check if the starting stations exist
        if ((stations['A']['B'] != null) && (stations['B']['C'] != null)) { // Check if the destinations for the starting stations exist
            let distanceAB: number = stations['A']['B'];
            let distanceBC: number = stations['B']['C'];
            let totalDistance = distanceAB + distanceBC
            return totalDistance; // Return the answer
        } else {
            return 'null'; // Routes do not exist for station, return null
        }
    } else {
        return 'null'; // Stations do not exist, return null
    }
}

// Find the distance of the trip A-E-B-C-D
function solveQ2() {
    if ((stations['A'] != null) && (stations['E'] != null) && (stations['B'] != null) && (stations['C'] != null)) { //Check if the starting stations exist
        if ((stations['A']['E'] != null) && (stations['E']['B'] != null) && (stations['B']['C'] != null) && (stations['C']['D'] != null)) { // Check if the destinations for the starting stations exist
            let distanceAE: number = stations['A']['E'];
            let distanceEB: number = stations['E']['B'];
            let distanceBC: number = stations['B']['C'];
            let distanceCD: number = stations['C']['D'];
            let totalDistance = distanceAE + distanceEB + distanceBC + distanceCD;
            return totalDistance; // Return the answer
        } else {
            return 'null'; // Routes do not exist for station, return null
        }
    } else {
        return 'null'; // Stations do not exist, return null
    }
}

// Find the distance of the trip A-E-D
function solveQ3() {
    if ((stations['A'] != null) && (stations['E'] != null)) { //Check if the starting stations exist
        if ((stations['A']['E'] != null) && (stations['E']['D'] != null)) { // Check if the destinations for the starting stations exist
            let distanceAE: number = stations['A']['E'];
            let distanceED: number = stations['E']['D'];
            let totalDistance = distanceAE + distanceED;
            return totalDistance; // Return the answer
        } else {
            return 'null'; // Routes do not exist for station, return null
        }
    } else {
        return 'null'; // Stations do not exist, return null
    }
}

// Find the number of trips starting at A and ending at C making exactly 4 stops (5 stations including the origin).
function solveQ4() {
    if (stations['A'] != null) { //Check if the starting station exists
        let tripCount = 0;

        // Sets the starting station variables
        let currentStation = 'A';
        let trips = [[currentStation]]; 
        let stationCount = 1;

        while (stationCount < 5) { // Limit the stations we check to 5
            let newTrips = []; // Create a fresh routes array
            for (let i = 0; i < trips.length; i++) { // Loop through all the current routes we have found
                currentStation = trips[i][trips[i].length - 1]; // Set the current station to the last one in the route
                for (let route in stations[currentStation]) { // Check all possible destinations from this station
                    let newTrip = trips[i].slice(); // Copy the array of the current route
                    newTrip.push(route); // Push the next destination to the copied array
                    newTrips.push(newTrip); // Push this new route to a new routes array
                }
            }
            trips = newTrips.slice(); // Overwrite the old routes array with the new one       
        stationCount++; // Increment the amount of stations in the routes
        }

        //console.log(trips); // Debug, prints the found trips to console

        // Counts the trips we managed to find from A to C in exactly 4 stops
        for (let i = 0; i < trips.length; i++) {
            if (trips[i][trips[i].length - 1] == 'C') {
                tripCount++
            }
        }

        return tripCount; // Returns the trip count 
        
    } else {
        return 'null'; // Station does not exist, return null
    }
}

// Find the length of the shortest route (in terms of distance to travel) from B to B.
function solveQ5() {
    if (stations['B'] != null) { //Check if the starting station exists
        let distance = -1;

        // Sets the starting station variables
        let currentStation = 'B';
        let trips = [[currentStation]];
        let stationCount = 1;
        let stationFound = false;

        while ((stationCount < 20) && !stationFound) { // Limit the stations we check to 10
            let newTrips = []; // Create a fresh routes array
            for (let i = 0; i < trips.length; i++) { // Loop through all the current routes we have found
                currentStation = trips[i][trips[i].length - 1]; // Set the current station to the last one in the route
                for (let route in stations[currentStation]) { // Check all possible destinations from this station
                    let newTrip = trips[i].slice(); // Copy the array of the current route
                    newTrip.push(route); // Push the next destination to the copied array
                    newTrips.push(newTrip); // Push this new route to a new routes array
                }
            }
            trips = newTrips.slice(); // Overwrite the old routes array with the new one       
            stationCount++; // Increment the amount of stations in the routes


            for (let i = 0; i < trips.length; i++) { // Loop through all the current routes we have found to check if we found B yet
                if (trips[i][trips[i].length - 1] == 'B') { // I check for station B here because we want to make sure we've grabed every new route we could possibly have in this iteration
                    stationFound = true;
                }
            }
        }
        if (!stationFound) {
            return 'null'; // Route could not be found within 20 stations, assume no route can be found and return null
        }

        //console.log(trips); // Debug, prints the found trips to console

        // Counts the distance for the route we managed to find from B to B
        for (let i = 0; i < trips.length; i++) {
            if (trips[i][trips[i].length - 1] == 'B') { // Check all routes that ended in B
                let routeDistance = 0; 
                for (let j = 0; j < (trips[i].length - 1); j++) { // Loop through every station in the route, except the end station
                    routeDistance += stations[trips[i][j]][trips[i][j+1]]; // Add the distance to the route distance
                }
                if (distance != -1) { // If this isn't the first time setting distance
                    if (routeDistance < distance) { // Is the route distance we found smaller than the previous distance?
                        distance = routeDistance; // Set new shorter distance
                    }
                } else {
                    distance = routeDistance;
                }
            }
        }

        return distance; // Returns the trip count 

    } else {
        return 'null'; // Station does not exist, return null
    }
}

// Find the number of different routes from C to C with a distance of less than 30. 
function solveQ6() {
    if (stations['C'] != null) { //Check if the starting station exists
        let tripCount = 0;

        // Sets the starting station variables
        let currentStation = 'C';
        let trips = [[currentStation]];
        let completeTrips = [];
        let maxRoutes = false;

        while (!maxRoutes) { // Keep going until we have found the maximum number of routes we can
            let newTrips = []; // Create a fresh routes array
            let newStation = false;
            for (let i = 0; i < trips.length; i++) { // Loop through all the current routes we have found
                currentStation = trips[i][trips[i].length - 1]; // Set the current station to the last one in the route
                if ((currentStation == 'C') && (trips[i].length != 1)) { // If the route ends in C and isn't the first station
                    let newTrip = trips[i].slice(); // Copy the array of the current route
                    completeTrips.push(newTrip); // Push this route to the completed routes array
                }
                let currentDistance = 0;
                for (let j = 0; j < (trips[i].length - 1); j++) { // Loop through every station in the route, except the end station
                    currentDistance += stations[trips[i][j]][trips[i][j + 1]]; // Add the distance to the current distance
                }
                for (let route in stations[currentStation]) { // Check all possible destinations from this station
                    if ((currentDistance + stations[currentStation][route]) < 30) { // Check if the new station would not push the distance over 30
                        let newTrip = trips[i].slice(); // Copy the array of the current route
                        newTrip.push(route); // Push the next destination to the copied array
                        newTrips.push(newTrip); // Push this new route to a new routes array
                        newStation = true;
                    }
                }                
            }
            trips = newTrips.slice(); // Overwrite the old routes array with the new one

            if (!newStation) {
                maxRoutes = true; // If there have been no new stations found, end the while loop 
            }
        }

        //console.log(completeTrips); // Debug, prints the found trips to console

        // Counts the trips we managed to find from C to C in under 30 distance
        for (let i = 0; i < completeTrips.length; i++) {
            if (completeTrips[i][completeTrips[i].length - 1] == 'C') {
                tripCount++
            }
        }

        return tripCount; // Returns the trip count 

    } else {
        return 'null'; // Station does not exist, return null
    }
}



