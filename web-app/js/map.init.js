var ig_mapConfiguration = {};
var geoCoder;
var directionService;
var streetViewService;
var panorama;

var directionRenderer;

function ig_mapInit(ig_mapDiv, configurationForMap, showHomeMarker) {
	var igGoogleMap = new google.maps.Map(document.getElementById(ig_mapDiv), configurationForMap);
	ig_mapConfiguration[igGoogleMap] = new Object();
	ig_mapConfiguration[igGoogleMap].homeMarker = ig_createMarker(igGoogleMap, configurationForMap['center']);
	if (!showHomeMarker) {
		ig_mapConfiguration[igGoogleMap].homeMarker.setVisible(false);
	}
	ig_mapConfiguration[igGoogleMap].infoWindow = new google.maps.InfoWindow({
		content:"",
		size: new google.maps.Size(100, 150)
	});

	return igGoogleMap;
}

function ig_initAutoComplete(inputSelector, settings, callback) {
	jQuery(inputSelector).geo_autocomplete(ig_getGeoCoder(), settings).result(function(_event, _data) {
		if (callback) {
			callback(_event, _data);
		}
	});
}

function ig_getGeoCoder() {
	if (!geoCoder) {
		geoCoder = new google.maps.Geocoder();
	}
	return geoCoder;
}

function ig_getDirectionService() {
	if (!directionService) {
		directionService = new google.maps.DirectionsService();
	}
	return directionService;
}

function ig_getDirectionRenderer(map) {
	if (!ig_mapConfiguration[map].directionRenderer) {
		ig_mapConfiguration[map].directionRenderer = new google.maps.DirectionsRenderer();
	}
	return ig_mapConfiguration[map].directionRenderer;
}

function ig_getStreetViewService() {
	if (!streetViewService) {
		streetViewService = new google.maps.StreetViewService();
	}
	return streetViewService;
}

function ig_createMarker(map, position) {
	return new google.maps.Marker({map: map, position: position, draggable:true});
}

function ig_updateHomeLocationMarker(map, address) {
	addressLookUp = ig_getGeoCoder();
	addressLookUp.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				ig_mapConfiguration[map].homeMarker.setPosition(results[0].geometry.location);
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

function ig_updateDirection(map, panelDivId) {
	var origin = jQuery('#origin').val();
	var destination = jQuery('#destination').val();
	var unitSystem = jQuery('#unitSystem').val();
	ig_showDirection(origin, destination, getTravelMode(), unitSystem, map, panelDivId);
}

function ig_showDirection(origin, destination, travelMode, unitSystem, map, panelDivId) {
	var request = {
		origin:origin,
		destination:destination,
		travelMode: travelMode || google.maps.DirectionsTravelMode.DRIVING,
		unitSystem:unitSystem || google.maps.DirectionsUnitSystem.METRIC
	};
	directionService = ig_getDirectionService();
	directionService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var directionRenderer = ig_getDirectionRenderer(map);
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

function ig_showStreetView(address, map) {
	ig_codeLatLng(address, function(results) {
		var latLng = results[0].geometry.location;
		var sv = ig_getStreetViewService();
		sv.getPanoramaByLocation(latLng, 50, function(data, status) {
			if (status == google.maps.StreetViewStatus.OK) {
				var markerPanoID = data.location.pano;
				panorama = map.getStreetView();
				panorama.setPano(markerPanoID);
				panorama.setPov({
					heading: 270,
					pitch: 0,
					zoom: 1
				});
				panorama.setVisible(true);
			} else {
				alert("No street view available for this location")
			}
		});

	});
}

function ig_codeLatLng(address, callBackFunction) {
	var addressLookup = ig_getGeoCoder();
	if (addressLookup) {
		addressLookup.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				callBackFunction(results);
			} else {
				alert("Failed to geoCode for : " + address + " Status : " + status);
			}
		});
	}
}

function ig_hideDirection(map, directionDiv) {
	ig_mapConfiguration[map].directionRenderer.setMap(null)
	jQuery('#' + directionDiv).empty();
}

function ig_hideStreetView(map, streetViewDiv) {
	var panorama = map.getStreetView();
	if (panorama) {
		panorama.setVisible(false);
	}
	jQuery('#' + streetViewDiv).empty();
}

function ig_updateMarkersOnMap(map, markers, clearOld) {
	jQuery(markers).each(function(key, markerInfo) {
		var configuration = {};
		configuration.map = map;
		configuration.position = new google.maps.LatLng(markerInfo["latitude"], markerInfo["longitude"]);
		var propertiesList = ["zIndex",	"draggable", "visible", "title", "icon", "shadow", "clickable", "flat", "cursor","raiseOnDrag", "content"]
		jQuery.each(propertiesList, function(index, property) {
			if (typeof markerInfo[property] != 'undefined') {
				configuration[property] = markerInfo[property]
			}
		});

		var marker = new google.maps.Marker(configuration);
		var infoWindow = ig_mapConfiguration[map].infoWindow;

		google.maps.event.addListener(marker, 'click', function(event) {
			infoWindow.close();
			if (typeof markerInfo["clickHandler"] != 'undefined') {
				(markerInfo["clickHandler"])(map, event);
			} else {
				infoWindow.setContent(markerInfo.content)
				infoWindow.open(map, marker);
			}
		});
	})
}