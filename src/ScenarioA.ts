// Completed route class, holds the route array and distance of each route
class Route {
    route: string[];
    distance: number;

    constructor(route: string[], distance: number) {
        this.route = route;
        this.distance = distance;
    }
}

import fs = require('fs');

var stations: { [name: string]: { [name: string]: number } } = {}; // The data will be stored in a key: value array
var input = JSON.parse(fs.readFileSync("./src/input.json").toString()); // Imports the input data via json file

// The main output
console.log("Input : \n" + input + "\n");
loadData();
console.log("Output : \n" + answerQuestions());



// Loads the JSON data into objects
function loadData() {
    for (let i = 0; i < input.length; i++) {
        // Get the station names and distances
        let stationName = input[i].charAt(0);
        let routeDestination = input[i].charAt(1);
        let routeDistance = +input[i].charAt(2); // The + is an easy way to force the string to be a number

        // If the station's key hasn't been made yet, initialise the routes array
        if (stations[stationName] === undefined) {
            stations[stationName] = {};
        }
        // Set the distination for the route
        stations[stationName][routeDestination] = routeDistance;
    }
}

// Returns the answers to the questions
function answerQuestions() {    
    let answer1 = getDistanceForRoute(['A', 'B', 'C']); // Find the distance of the trip A-B-C   
    let answer2 = getDistanceForRoute(['A', 'E', 'B', 'C', 'D']); // Find the distance of the trip A-E-B-C-D   
    let answer3 = getDistanceForRoute(['A', 'E', 'D']); // Find the distance of the trip A-E-D    
    let answer4 = getRoutesWithXStations('A', 'C', 5); // Find the number of trips starting at A and ending at C making exactly 4 stops (5 stations including the origin).    
    let answer5 = getShortestRoute('B', 'B', 30); // Find the length of the shortest route (in terms of distance to travel) from B to B.    
    let answer6 = getRoutesWithMaxDistance('C', 'C', 30); // Find the number of different routes from C to C with a distance of less than 30. 

    let output = `{
    "1": ${answer1}
    "2": ${answer2}
    "3": ${answer3}
    "4": ${answer4}
    "5": ${answer5}
    "6": ${answer6}
}`

    return output;
}

// Finds the distance for the route provided
function getDistanceForRoute(route: string[]) {
    let distance = null;
    let routes = calculateRoute(route[0], route[route.length - 1], 'MaxStations', route.length); // Calculate the routes from the begging to end station with a maximum station count of the route length
    if (routes !== null) {
        for (let i = 0; i < routes.length; i++) { // Loop through the routes we calculated
            if (JSON.stringify(routes[i].route) === JSON.stringify(route)) { // Convert the arrays to json for easy comparing, and check if the route is the one we are looking for
                distance = routes[i].distance; // Set the answer to the routes distance
            }
        }
    }
    return distance;
}

// Finds the routes betwen station A and station B with exactly the amount of stations asked for
function getRoutesWithXStations(stationA: string, stationB: string, maxStations: number) {
    let routeCount = 0;
    let routes = calculateRoute(stationA, stationB, 'MaxStations', maxStations); // Calculate the routes from begging to end station with a maximum station count provided
    if (routes !== null) {
        for (let i = 0; i < routes.length; i++) { // Loop through the routes we calculated
            if (routes[i].route.length == maxStations) { // Check if the number of stations in the array is the max stations allowed
                routeCount++; // Increment the answer by 1
            }
        }
    }
    return routeCount;
}

// Finds the shortest route betwen station A and station B. A maximum distance to check for is needed to ensure the route calculator doesn't loop forever (This could be fixed with some extra logic)
function getShortestRoute(stationA: string, stationB: string, maxDistance: number) {
    let routes = calculateRoute(stationA, stationB, 'MaxDistance', maxDistance); // Calculate the routes from begging to end station with a maximum distance provided
    let distance = maxDistance;
    if (routes !== null) {
        distance = maxDistance; // Set the distance to the one provided, which is the maximum distance we checked for
        for (let i = 0; i < routes.length; i++) { // Loop through the routes we calculated
            if (routes[i].distance < distance) { // Check if the distance of the route is less than the current answer
                distance = routes[i].distance; // Set the answer to the lowest distance
            }
        }
    }
    return distance;
}

// Gets routes betwen station A and station B with distances less than the one provided
function getRoutesWithMaxDistance(stationA: string, stationB: string, maxDistance: number) {
    let routes = calculateRoute(stationA, stationB, 'MaxDistance', maxDistance); // Calculate the routes from begging to end station with a maximum distance provided
    let routeCount = 0;
    if (routes !== null) {
        routeCount = routes.length; // Set the answer to length of the routes array, which is the total routes we found
    }
    return routeCount;
}

// Take in a starting and ending station, as well as the search type and search parameters (which can be either 'MaxStations' or 'MaxDistance')
function calculateRoute(stationA: string, stationB: string, searchType: string, searchMax: number) {
    if ((stations[stationA] !== undefined) && (stations[stationB] !== undefined)) { //Check if the starting stations exist
        // Sets the starting station variables
        let currentStation = stationA;
        let routes = [[currentStation]];
        let completedRoutes = [];
        let stationCount = 1;
        let maxRoutes = false;
 
        while (!maxRoutes) { // Keep going until we have found the maximum number of routes we can
            let newRoutes = []; // Create a fresh routes array
            let newRoute = false;

            for (let i = 0; i < routes.length; i++) { // Loop through all the current routes we have found
                currentStation = routes[i][routes[i].length - 1]; // Set the current station to the last one in the route

                let currentDistance = 0;
                for (let j = 0; j < (routes[i].length - 1); j++) { // Loop through every station in the route, except the end station
                    currentDistance += stations[routes[i][j]][routes[i][j + 1]]; // Add the distance to the current distance
                }
                for (let station in stations[currentStation]) { // Check all possible destinations from this station
                    if ((searchType === 'MaxStations') || ((searchType === 'MaxDistance') && ((currentDistance + stations[currentStation][station]) < searchMax))) { // Check if the new station would not push the distance over or at the search maximum, if the search type is for distance
                        let route = routes[i].slice(); // Copy the array of the current route
                        route.push(station); // Push the next destination to the copied array
                        newRoutes.push(route); // Push this new route to a new routes array
                        newRoute = true;

                        if (station == stationB) { // If the station we just added ends with the ending station
                            let distance = currentDistance + stations[currentStation][station];
                            let completedRoute = new Route(route, distance);
                            completedRoutes.push(completedRoute); // Push this route to the completed routes array
                        }
                    }
                }
            }
            routes = newRoutes.slice(); // Overwrite the old routes array with the new one
            stationCount++; // Increment the amount of stations in the routes

            // If we have reached the maximum number of stations or maximum distance with no new routes added, end while loop
            if (((searchType === 'MaxStations') && (stationCount >= searchMax)) || ((searchType === 'MaxDistance') && !newRoute)) {
                maxRoutes = true;
            }
        }

        //console.log(completedRoutes); // Debug, prints the found routes to console

        if (completedRoutes.length > 0) {
            return completedRoutes;
        } else {
            return null; // No routes found, return null
        }

    } else {
        return null; // Stations do not exist, return null
    }
}