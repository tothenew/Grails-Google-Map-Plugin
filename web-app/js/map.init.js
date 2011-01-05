var mapConfiguration = {};
var geoCoder;
var directionService;
var directionRenderer;

function ig_mapInit(ig_mapDiv, ig_mapConfiguration, showHomeMarker) {
	var igGoogleMap = new google.maps.Map(document.getElementById(ig_mapDiv), ig_mapConfiguration);
	mapConfiguration[igGoogleMap] = new Object();
	mapConfiguration[igGoogleMap].homeLocation = ig_mapConfiguration['center'];
	mapConfiguration[igGoogleMap].homeMarker = createMarker(igGoogleMap, mapConfiguration[igGoogleMap].homeLocation);
	if (!showHomeMarker) {
		mapConfiguration[igGoogleMap].homeMarker.setVisible(false);
	}
	return igGoogleMap;
}

function initAutoComplete(inputSelector, settings, callback) {
	jQuery(inputSelector).geo_autocomplete(getGeoCoder(), settings).result(function(_event, _data) {
		if (callback) {
			callback(_event, _data);
		}
	});
}

function getGeoCoder() {
	return geoCoder || new google.maps.Geocoder();
}

function getDirectionService() {
	return directionService || new google.maps.DirectionsService();
}

function getDirectionRenderer() {
	return directionRenderer || new google.maps.DirectionsRenderer();
}

function createMarker(map, position) {
	return new google.maps.Marker({map: map, position: position, draggable:true});
}

function updateHomeLocationMarker(map, address) {
	addressLookUp = getGeoCoder();
	addressLookUp.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				mapConfiguration[map].homeMarker.setPosition(results[0].geometry.location);
				map.setCenter(results[0].geometry.location);
			} else {
				alert("No result found");
			}
		} else {
			alert("GeoCoding failed : " + status);
		}
	});

}
function getTravelMode() {
	var travelModeValue = jQuery('#travel-mode-input').val();
	if (travelModeValue == 'driving') {
		travelModeValue = google.maps.DirectionsTravelMode.DRIVING;
	} else if (travelModeValue == 'bicycling') {
		travelModeValue = google.maps.DirectionsTravelMode.BICYCLING;
	} else if (travelModeValue == 'walking') {
		travelModeValue = google.maps.DirectionsTravelMode.WALKING;
	} else {
		travelModeValue = google.maps.DirectionsTravelMode.WALKING; //Default Mode
	}
	return travelModeValue;
}

function updateDirection(map, panelDivId) {
	var origin = jQuery('#origin').val();
	var destination = jQuery('#destination').val();
	var unitSystem = jQuery('#unitSystem').val();
	showDirection(origin, destination, getTravelMode(), unitSystem, map, panelDivId);
}

function showDirection(origin, destination, travelMode, unitSystem, map, panelDivId) {
	var request = {
		origin:origin,
		destination:destination,
		travelMode: travelMode || google.maps.DirectionsTravelMode.DRIVING,
		unitSystem:unitSystem || google.maps.DirectionsUnitSystem.METRIC
	};
	directionService = getDirectionService();
	directionService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionRenderer = getDirectionRenderer();
			if (panelDivId) {
				directionRenderer.setPanel(document.getElementById(panelDivId));
			}
			directionRenderer.setMap(map);
			directionRenderer.setDirections(response);
		} else {
			alert("Failed to get direction");
		}
	});
}
