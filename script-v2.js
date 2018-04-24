
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBcSXlSamiM6dQPrXpU86_ARlGGyNLkcnw&libraries=places&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

var map, service,markers,bounds,infoWindow;
const azusa = {lat: 34.1167014, lng: -117.9011413};


function initMap () {

  map = new google.maps.Map(document.getElementById('map'), {
    center: azusa,
    zoom: 14
  });

 service = new google.maps.places.PlacesService(map);
 infoWindow = new google.maps.InfoWindow();
 markers = [];

 drawMap()
 .then( (results) => {
   console.log("$$$$", results);
   return Promise.all(
            results.map(getWebsite)
          );
 })
 .then((results) => {
   console.log("$$$$$$$", results);
  //  bounds = new google.maps.LatLngBounds();
  //  results.forEach(createMarker);
  //  map.fitBounds(bounds);
  });

 //    const placeWebsites = results.map((place) => getWebsite( place ));
 //    console.log("$$$$$", placeWebsites);
 //    newresult.map((place) => createMarker(place, animation));
//      secondnewresult.map( (place) => {
//        placeListUi(place, placeLoc, map, marker, website);
//      }) );
//drawMap('cafe', google.maps.Animation.BOUNCE);
}

const drawMap = (type = 'cafe', animation = null) => {
  return new Promise ((resolve, reject) => {
    service.nearbySearch({
      location: azusa,
      radius: 5000,
      type: type,
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(")))))", results);
        resolve(results);
      } else {
        throw new Error('Nearby search request failed');
        reject(status);
      }
    });
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
}

  //const place_website = getWebsite(place.place_id);

const placeListUi = (place, placeLoc, map, marker, website) => {
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


const getWebsite = (place) => {
  return new Promise ((resolve, reject) => {
    service.getDetails({
      placeId: place.place_id
    }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("_____", place);
        resolve(place);
      } else {
        throw new Error('Get Details request failed');
        reject(status);
      }
    });
  });
}
