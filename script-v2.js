
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAxU8S54Kn4bydbPtgg-OkDgR-d9YdQwCA&libraries=places&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var map;
const azusa = {lat: 34.1167014, lng: -117.9011413};
let infowindow;

function initMap () {
  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: azusa,
    zoom: 14
  });

  drawMap();
  drawMap('cafe', google.maps.Animation.BOUNCE);

}

const drawMap = (type = 'laundry', animation = null) => {
  console.log(type, animation);
  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: azusa,
    radius: 5000,
    type: type,
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i], animation);
      }
    } else {
      throw new Error('Nearby search request failed');
    }
  });
}

const createMarker = (place, animation) => {
  const placeLoc = place.geometry.location;
  const list = document.getElementById('locations');
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  marker.setAnimation(animation);

  let website = '';
  let p = new Promise((resolve, reject) => {getWebsite(place.place_id)});
  p.then((val) => website = val);
  callback2(place, placeLoc, map, marker, website);
}

  //const place_website = getWebsite(place.place_id);

const callback2 = (place, placeLoc, map, marker, website) => {
  // console.log(place, placeLoc,website);
  const content = document.createElement('li');
  content.className = "list-group-item";
  content.innerHTML = `
    <h5 class="mb-1">${ place.name }</h5>
    <a style="white-space: normal;" class="list-group-item-text">${website || null}</a><br/>
    <small>${ place.types.filter(word => word !== "point_of_interest" && word !== "establishment").join(", ") }</small>`;

  document.getElementById('locations').appendChild(content);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' + '</div>');
    infowindow.open(map, this);
  });
}

const getWebsite = (place_id) => {
  const service = new google.maps.places.PlacesService(map);
  // console.log(place_id);
  service.getDetails({
    placeId: place_id
  }, function(place, status) {

    console.log(status)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (place.website) {
        // console.log("******", place.website);
        return place.website;
      } else {
        return 'No website';
      }
    } else {
      throw new Error('Get Details request failed');
    }
  });
}
