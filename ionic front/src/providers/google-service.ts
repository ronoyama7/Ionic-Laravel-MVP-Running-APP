declare let google: any;
const directionsService = new google.maps.DirectionsService;
const directionsDisplay = new google.maps.DirectionsRenderer;
const routesArray = [];


function addRoute(lat1, lon1, lat2, lon2, data) {
    const routeElement = {
        start : [lat1,lon1],
        end : [lat2,lon2],
        data: data,
    }
    routesArray.push(routeElement);
    console.log(routesArray);
}

function isExistRoute(lat1, lon1, lat2, lon2) {
    if (routesArray.length == 0) {
        console.log('here')
        return false;
    }
    return routesArray.filter(element => ( element.start[0] == lat1 && element.start[1] == lon1 && element.end[0] == lat2 && element.end[1] == lon2))[0] ? true : false ;
}

function getRoteFromBuffer(lat1, lon1, lat2, lon2) {
    return routesArray.filter(element => ( element.start[0] == lat1 && element.start[1] == lon1 && element.end[0] == lat2 && element.end[1] == lon2))[0].data;
}

// export function getRoute(lat1,lon1,lat2,lon2) {
//     console.log(isExistRoute(lat1, lon1, lat2, lon2));
//     if (isExistRoute(lat1, lon1, lat2, lon2)) {
//         console.log('from buffer')
//         return new Promise(function(resolve, reject) {
//             resolve(getRoteFromBuffer(lat1, lon1, lat2, lon2));
//         });
//     } else {
//         console.log('from get')
//         let start = {
//             lat: lat1,
//             lng: lon1
//         };
//         let destination = {
//             lat: lat2,
//             lng: lon2
//         };
//         let request = {
//             origin: start,
//             destination: destination,
//             travelMode: google.maps.TravelMode.WALKING
//         };
//         return new Promise(function(resolve, reject) {
//             directionsService.route(request, function (response, status) {
//                 if (status == google.maps.DirectionsStatus.OK) {
//                     addRoute(lat1, lon1, lat2, lon2, response);
//                     resolve(response); 
//                 } else {
//                     reject(status);
//                 }
//             });
//         });
//     }
// }

// export function getRoute2MapData(response, data) {
//     let legs = response.routes[0].legs;
//     for (let i = 0; i < legs.length; i++) {
//         var steps = legs[i].steps;
//         data.saved = true;
//         data.distance = legs[0].distance.text;
//         data.estimate = legs[0].duration.text;
//         data.waypoint = [];
//         data.paths = [];
//         data.instructions = [];
//         for (let j = 0; j < steps.length; j++) {
//           var nextSegment = steps[j].path;
//           data.waypoint.push([steps[j].end_location.lat(),steps[j].end_location.lng()]);
//           data.paths.push(steps[j].path);
//           let instruction = {
//               distance: steps[j].distance,
//               estimate: steps[j].duration,
//               instruction: steps[j].instructions
//           }
//           data.instructions.push(instruction);
//         }
//       }
//       return new Promise(function(resolve, reject) {
//         console.log(data);
//         resolve(data);
//     });
// }

export function getRouteDistanceText(response) {
    return response.routes[0].legs[0].distance.text;
}

export function getRouteDistanceValue(response) {
    return response.routes[0].legs[0].distance.value;
}

export function getRouteEstimateText(response) {
    return response.routes[0].legs[0].duration.text;
}

export function getRouteEstimateValue(response) {
    return response.routes[0].legs[0].duration.value;
}