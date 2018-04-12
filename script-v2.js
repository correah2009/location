
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAX7KAi2uUjpmYix_KbqNZSsBJ6JwTdq-g&libraries=places&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var map;


function initMap (){
  console.log(google);
  const azusa = {lat: 34.1167014, lng: -117.9011413};

  map = new google.maps.Map(document.getElementById('map'), {
    center: azusa,
    zoom: 14
  });

  const infowindow = new google.maps.InfoWindow();
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: azusa,
    radius: 5000,
    type: ['laundry'],
  }, callback);
}

const callback = (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  } else {
    throw new Error('Nearby search request failed');
  }
}


const createMarker = (place) => {
  const placeLoc = place.geometry.location;
  const list = document.getElementById('locations');
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  })
  callback2(place, placeLoc, map, marker, getWebsite(place.place_id));
}

  //const place_website = getWebsite(place.place_id);

const callback2 = (place, placeLoc, map, marker, website) => {

  const content = document.createElement('li');
  content.className = "list-group-item";
  content.innerHTML = `
    <h5 class="mb-1">${ place.name }</h5>
    <a style="white-space: normal;" class="list-group-item-text">${website || null}</a><br/>
    <small>${ place.types.filter(word => word !== "point_of_interest" && word !== "establishment").join(", ") }</small>`;

  console.log(place);
  document.getElementById('locations').appendChild(content);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' + '</div>');
    infowindow.open(map, this);
  });
}

const getWebsite = (place_id) => {
  const service = new google.maps.places.PlacesService(map);
  console.log(place_id);
  service.getDetails({
    placeId: place_id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (place.website) {
        console.log("******", place.website);
        return place.website;
      } else {
        return 'No website';
      }
    } else {
      throw new Error('Get Details request failed');
    }
  });
}
