/**
 * @name Google Map Plugin Utility
 * @author Bhagwat Kumar
 */
var geoCoder = null;

function getGeoCoder() {
	if (!geoCoder) {
		geoCoder = new google.maps.Geocoder();
	}
	return geoCoder;
}

function MarkerManager(m) {
	var markers_array;
	var map = m;
	return {
		getMap : function() {
			return map;
		},

		addMarkers : function(temp_markers_array) {
			if (!markers_array) {
				markers_array = new Array();
			}
			for (counter = 0; counter < temp_markers_array.length; counter++) {
				var marker = temp_markers_array[counter];
				marker.setMap(map);
				markers_array.push(marker);
			}
			return markers_array;
		},

		clearMarkers : function() {
			if (markers_array) {
				for (counter = 0; counter < markers_array.length; counter++) {
					var marker = markers_array[counter];
					marker.setMap(null)
				}
			}
			markers_array = null;
		},

		findMarker : function(lat, lng) {
			var marker = null;
			if (markers_array) {
				for (counter = 0; counter < markers_array.length; counter++) {
					var temp_marker = markers_array[counter];
					if (temp_marker.lat() == lat && temp_marker.lng() == lng) {
						marker = temp_marker;
						break;
					}
				}
			}
			return marker;
		},

		setVisible:function(isVisible) {
			for (counter = 0; counter < markers_array.length; counter++) {
				markers_array[counter].setVisible(isVisible)
			}
		} ,

		getMarkers : function() {
			return markers_array;
		},

		getMarkersCount : function() {
			return markers_array.length || 0;
		}
	};
}

function GoogleMapManager() {
	mapConfiguration = {};
	directionService = null;
	streetViewService = null;

	messages = {
		noGeoCodeResult:"No result found",
		geoCodingFailed:"GeoCoding failed",
		noStreetViewAvailable:"No street view available for this location",
		getDirectionFailed:"Failed to get direction"
	};
	function createMarker(map, position) {
		return new google.maps.Marker({map: map, position: position, draggable:true});
	}

	function bindLatLngDomElements(homeMarker, latitudeDomId, longitudeDomId) {
		var latitudeDom = jQuery("#" + latitudeDomId);
		var longitudeDom = jQuery("#" + longitudeDomId);

		if (latitudeDom.length || longitudeDom.length) {
			google.maps.event.addListener(homeMarker, 'position_changed', function() {
				var latLng = homeMarker.getPosition();
				jQuery("#" + latitudeDomId).val(latLng.lat());
				jQuery("#" + longitudeDomId).val(latLng.lng());
			});
		}
	}

	function bindPanoramaDomElements(map) {
		var panorama = map.getStreetView();

		google.maps.event.addListener(panorama, 'pov_changed', function() {
			updatePovDataAndPano(panorama.getPov(), panorama.getPano());
		});

		google.maps.event.addListener(panorama, 'pano_changed', function() {
			updatePanoId(panorama.getPano());
		});
	}

	function getHomeMarker(map) {
		var marker = null;
		if (mapConfiguration[map]) {
			marker = mapConfiguration[map].homeMarker
		}
		return marker;
	}

	function getDirectionService() {
		if (!directionService) {
			directionService = new google.maps.DirectionsService();
		}
		return directionService;
	}

	function getDirectionRenderer(map) {
		if (!mapConfiguration[map].directionRenderer) {
			mapConfiguration[map].directionRenderer = new google.maps.DirectionsRenderer();
		}
		return mapConfiguration[map].directionRenderer;
	}

	function getStreetViewService() {
		if (!streetViewService) {
			streetViewService = new google.maps.StreetViewService();
		}
		return streetViewService;
	}

	function codeLatLng(addressOrLatLng, callBackFunction) {
		var addressLookup = getGeoCoder();
		if (addressLookup) {
			addressLookup.geocode({'address': addressOrLatLng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					callBackFunction(results);
				} else {
					alert(messages["geoCodingFailed"]);
				}
			});
		}
	}

	function getMarkerManager(map) {
		var markerManager = mapConfiguration[map].markerManager;
		if (!markerManager) {
			markerManager = new MarkerManager(map);
			mapConfiguration[map].markerManager = markerManager;
		}
		return markerManager;
	}

	function getTravelMode(travelModeDomId) {
		var travelModeValue = jQuery('#' + travelModeDomId).val();
		if (travelModeValue == 'google.maps.DirectionsTravelMode.DRIVING') {
			travelModeValue = google.maps.DirectionsTravelMode.DRIVING;
		} else if (travelModeValue == 'google.maps.DirectionsTravelMode.BICYCLING') {
			travelModeValue = google.maps.DirectionsTravelMode.BICYCLING;
		} else if (travelModeValue == 'google.maps.DirectionsTravelMode.WALKING') {
			travelModeValue = google.maps.DirectionsTravelMode.WALKING;
		} else {
			travelModeValue = google.maps.DirectionsTravelMode.WALKING; //Default Mode
		}
		return travelModeValue;
	}

	function getUnitSystemMode(unitSystemModeDomId) {
		var unitSystemModeValue = jQuery('#' + unitSystemModeDomId).val();
		if (unitSystemModeValue == 'google.maps.DirectionsUnitSystem.IMPERIAL') {
			unitSystemModeValue = google.maps.DirectionsUnitSystem.IMPERIAL;
		} else {
			unitSystemModeValue = google.maps.DirectionsUnitSystem.METRIC; //Default Mode
		}
		return unitSystemModeValue;
	}

	return {

		initAutoComplete:function(inputSelector, settings, callback) {
			jQuery(inputSelector).geo_autocomplete(getGeoCoder(), settings).result(function(_event, _data) {
				if (callback) {
					callback(_event, _data);
				}
			});
		},

		updateHomeLocationMarker:function (map, addressOrLatLng) {
			addressLookUp = getGeoCoder();
			addressLookUp.geocode({'address': addressOrLatLng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						var marker = getHomeMarker(map)
						marker.setPosition(results[0].geometry.location);
						map.setCenter(results[0].geometry.location);
					} else {
						alert(messages["noGeoCodeResult"]);
					}
				} else {
					alert(messages["geoCodingFailed"]);
				}
			});
		},

		hideDirection : function (map, directionDiv) {
			getDirectionRenderer(map).setMap(null)
			jQuery('#' + directionDiv).empty();
		},

		hideStreetView : function (map, streetViewDiv) {
			var panorama = map.getStreetView();
			if (panorama) {
				panorama.setVisible(false);
			}
			jQuery('#' + streetViewDiv).empty();
		},

		showStreetView: function (address, map) {
			codeLatLng(address, function(results) {
				var latLng = results[0].geometry.location;
				var sv = getStreetViewService();
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
						//TODO: there should be a callback
						alert(messages["noStreetViewAvailable"])
					}
				});
			});
		},

		directionSearchHandler:function (map, directionDiv, originDomId, destinationDomId, travelModeDomId, unitSystemDomId, avoidHighways, avoidTolls) {
			var origin = jQuery('#' + originDomId).val();
			var destination = jQuery('#' + destinationDomId).val();
			var travelMode = getTravelMode(travelModeDomId);
			var unitSystem = getUnitSystemMode(unitSystemDomId);
			this.showDirectionHandler(map, directionDiv, origin, destination, travelMode, unitSystem, avoidHighways, avoidTolls);
		},

		showDirectionHandler:function (map, directionDiv, origin, destination, travelMode, unitSystem, avoidHighways, avoidTolls) {
			var request = {
				origin:origin,
				destination:destination,
				travelMode: travelMode,
				unitSystem:unitSystem,
				avoidHighways:avoidHighways,
				avoidTolls:avoidTolls
			};
			directionService = getDirectionService();
			directionService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					var directionRenderer = getDirectionRenderer(map);
					if (directionDiv) {
						directionRenderer.setPanel(document.getElementById(directionDiv));
					}
					directionRenderer.setMap(map);
					directionRenderer.setDirections(response);
				} else {
					alert(messages["getDirectionFailed"]);
				}
			});
		},

		createMap: function (mapDivId, configurationForMap, homeMarkerVisible, latitudeDomId, longitudeDomId) {
			var tempMap = new google.maps.Map(document.getElementById(mapDivId), configurationForMap);
			mapConfiguration[tempMap] = new Object();
			mapConfiguration[tempMap].markerManager = null;

			var homeMarker;
			homeMarker = createMarker(tempMap, configurationForMap['center']);

			if (!homeMarkerVisible) {
				homeMarker.setVisible(false);
			}
			mapConfiguration[tempMap].infoWindow = new google.maps.InfoWindow({
				content:"",
				size: new google.maps.Size(100, 150)
			});

			bindLatLngDomElements(homeMarker, latitudeDomId, longitudeDomId);
			//bindPanoramaDomElements(tempMap);
			mapConfiguration[tempMap].homeMarker = homeMarker;

			return tempMap;
		},

		updateMarkersOnMap:function (map, markers, removeOldMarkers) {
			markerManager = getMarkerManager(map);
			if (removeOldMarkers) {
				markerManager.clearMarkers();
			}

			var toBeAddedToManager = [];
			jQuery(markers).each(function(key, markerInfo) {
				var configuration = {};
				configuration.position = new google.maps.LatLng(markerInfo["latitude"], markerInfo["longitude"]);
				var propertiesList = ["zIndex",	"draggable", "visible", "title", "icon", "shadow", "clickable", "flat", "cursor","raiseOnDrag", "content"]
				jQuery.each(propertiesList, function(index, property) {
					if (typeof markerInfo[property] != 'undefined') {
						configuration[property] = markerInfo[property]
					}
				});

				var marker = new google.maps.Marker(configuration);
				var infoWindow = mapConfiguration[map].infoWindow;

				google.maps.event.addListener(marker, 'click', function(event) {
					infoWindow.close();
					if (typeof markerInfo["clickHandler"] != 'undefined') {
						(markerInfo["clickHandler"])(map, event);
					} else {
						infoWindow.setContent(markerInfo.content);
						infoWindow.open(map, marker);
					}
				});
				toBeAddedToManager.push(marker);
			});
			markerManager.addMarkers(toBeAddedToManager);
		},

		updatePovData:function (pov) {
			jQuery('#pov-heading').val(pov.heading);
			jQuery('#pov-pitch').val(pov.pitch);
			jQuery('#pov-zoom').val(pov.zoom);
		},

		updatePanoId:function (panoId) {
			jQuery('#pov-panoId').val(panoId);
		},

		getMapConfiguration:function() {
			return mapConfiguration;
		},

		getHomeMarker:	function (map) {
			var marker = null;
			if (mapConfiguration[map]) {
				marker = mapConfiguration[map].homeMarker;
			}
			return marker;
		}

	}
}

var googleMapManager = new GoogleMapManager();
