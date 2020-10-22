async function initMap(){       
        
    const options = {
        zoom: 14,
        center: {lat: 37.3230, lng: -122.0322} // Set the center of the map to be Cupertino's coordinates
    }

    let map = new google.maps.Map(document.getElementById("map"), options); 

    let directionsService = new google.maps.DirectionsService(); // Get directions API
    let directionsRenderer = new google.maps.DirectionsRenderer(); // Generate results from direction service
    directionsRenderer.setMap(map);

    // Establish all markers and clickers (with corresponding addresses)
    
    let infoWindow1 = new google.maps.InfoWindow({

        content:"<h2>10300 Torre Avenue, Cupertino, CA</h2>"
    });

    let marker1 = new google.maps.Marker({

        position: {lat: 37.317720, lng: -122.028500},
        map: map
    });
    
    marker1.addListener('click', () => {

        infoWindow1.open(map, marker1);
    });

    let infoWindow2 = new google.maps.InfoWindow({

        content:"<h2>21250 Stevens Creek Boulevard, Cupertino, CA</h2>"
    });
    
    let marker2 = new google.maps.Marker({

        position: {lat: 37.319200, lng: -122.044880},
        map: map
    });

    marker2.addListener("click", function(){

        infoWindow2.open(map, marker2);
    });

    let infoWindow3 = new google.maps.InfoWindow({

        content:"<h2>10185 North Stelling Road, Cupertino, CA</h2>"
    });

    let marker3 = new google.maps.Marker({

        position: {lat: 37.325820, lng: -122.042420},
        map: map
    });

    marker3.addListener("click", function(){

        infoWindow3.open(map, marker3);
    });

    event.preventDefault(); // Prevents page from resetting
    
    // Create the set of all voting site addresses
    const destinations = ["10300 Torre Avenue, Cupertino, CA",
    "21250 Stevens Creek Boulevard, Cupertino, CA",
    "10185 North Stelling Road, Cupertino, CA",
    "22445 Cupertino Road, Cupertino, CA",
    "19624 Homestead Rd, Cupertino, CA"];

    var distances = [];

    for(var i = 0; i < destinations.length; i++){

        await getDistances(directionsService, destinations[i]).then((dist) => {

            distances.push(dist);
        });
    }

    var minDist = Math.min(...distances);
    var closest = destinations[distances.indexOf(minDist)];
    var minDistMiles = minDist/1609;
    var minDistString = minDistMiles.toString();
    console.log(closest);


    document.getElementById("msg").innerHTML = "The nearest ballot drop-off center is " + closest + ", which is " + minDistString.substring(0, 4) + " miles away.";
}

    function getDistances(directionsService, destination) {
    
    return new Promise(function (resolve, reject) {
       
        var route = {
            origin: document.getElementById("Address").value, // User input for their address
            destination: destination,
            travelMode: 'DRIVING'
        }

        directionsService.route(route, function (response, status) {
            if (status !== 'OK') {
                reject({ response, status, reason: 'Directions request failed due to status error' });
            } else {
                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                if (!directionsData) {
                    reject({ response, status, reason: 'Directions request failed' });
                } else {
                    resolve(directionsData.distance.value);
                }
            }
        });
    });
}     	
