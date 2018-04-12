      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
    // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
import * as mapObj from "./modules/map";

   function initMap (){
    const azusa = {lat: 34.1167014, lng: -117.9011413};

    const map = new google.maps.Map(document.getElementById('map'), {
      center: azusa,
      zoom: 10
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: azusa,
      radius: 1,
      type: ['store'],
      rankBy: google.maps.places.RankBy.PROMINENCE,
    }, callback);
  }

  const callback = (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }


  createMarker = (place) => {
    const placeLoc = place.geometry.location;
    const list = document.getElementById('locations');
    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            'Place ID: ' + place.place_id + '<br>' + '</div>');
      infowindow.open(map, this);
    });
  }

  google.maps.event.addDomListener(window, 'load', initMap);
