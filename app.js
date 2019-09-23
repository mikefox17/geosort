const sortByDistance = require("sort-by-distance");
const stores = require("./stores.json");

// HTML5 get Current Position
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    let userLat = position.coords.latitude;
    let userLong = position.coords.longitude;
    console.log("CURRENT LOCATION IS...", userLat, userLong);
    //Dummy DATA for sort.js of store locations
    const points = [
      { lat: 101, lng: -1, name: "Target" },
      { lat: 80, lng: 34, name: "Bestbuy" },
      { lat: 3, lng: 7, name: "Franklins" },
      { lat: 22, lng: 88, name: "Chipotle" },
      { lat: 100, lng: 60, name: "Tiger Fork" },
      { lat: 56, lng: 13, name: "Taco Bell" }
    ];
    //Options for sort.js
    const opts = {
      yName: "lat",
      xName: "lng"
    };
    // Origin is set to users current location grabbed from Current position
    const origin = { lat: userLong, lng: userLat };

    // Console of dummy data distance from the user
    console.log(sortByDistance(origin, points, opts));

    //Parsing the sort function results

    var obj = sortByDistance(origin, points, opts);
    obj.forEach(element => {
      console.log(element.name + "Distance Away: " + element.distance);
    });

    //displaying the results

    obj.forEach(function(item, i) {
      document.querySelector("#demo").innerHTML +=
        i +
        " : " +
        item.name +
        "  Distance Away: " +
        item.distance.toFixed(2) +
        " miles" +
        "<br>";
    });
  });
}

//init of google maps api

var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 14
  });

  infoWindow = new google.maps.InfoWindow();

  // Using HTML5 geolocation again to set the map to the users position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Your location");
        infoWindow.open(map);
        map.setCenter(pos);
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  function markStore(storeInfo) {
    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: storeInfo.location,
      title: storeInfo.name
    });

    // show store info when marker is clicked
    marker.addListener("click", function() {
      showStoreInfo(storeInfo);
    });
  }

  // show store info in text box
  function showStoreInfo(storeInfo) {
    var info_div = document.getElementById("info_div");
    info_div.innerHTML =
      "Store name: " +
      storeInfo.name +
      "<br>Hours: " +
      storeInfo.hours +
      "Store Info" +
      storeInfo.title;
  }

  //dummy object for store markers
  var stores = [
    {
      name: "Store 1",
      location: { lat: 38.889931, lng: -77.009003 },
      hours: "8AM to 10PM",
      title: "testing"
    },
    {
      name: "Store 2",
      location: { lat: 40.790091, lng: -73.968285 },
      hours: "9AM to 9PM"
    }
  ];

  stores.forEach(function(store) {
    markStore(store);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
