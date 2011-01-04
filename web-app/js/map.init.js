var mapConfiguration={};
var geoCoder;
function ig_mapInit(ig_mapDiv, ig_mapConfiguration, showHomeMarker){
	var igGoogleMap = new google.maps.Map(document.getElementById(ig_mapDiv), ig_mapConfiguration);
	mapConfiguration[igGoogleMap]=new Object();
	mapConfiguration[igGoogleMap].homeLocation=ig_mapConfiguration['center'];
	mapConfiguration[igGoogleMap].homeMarker=createMarker(igGoogleMap, mapConfiguration[igGoogleMap].homeLocation);
	if(!showHomeMarker){
		mapConfiguration[igGoogleMap].homeMarker.setVisible(false);
	}
	return igGoogleMap;
}

function initAutoComplete(inputSelector,settings, callback) {
	jQuery(inputSelector).geo_autocomplete(getGeoCoder(), settings).result(function(_event, _data) {
		if (callback) {
			callback(_event, _data);
		}
	});
}

function getGeoCoder(){
	return geoCoder || new google.maps.Geocoder();
}

function createMarker(map, position){
	return new google.maps.Marker({map: map, position: position, draggable:true});
}

function updateHomeLocationMarker(map, address){
	addressLookUp=getGeoCoder();
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

function getDisplayAddress(result) {
	var address_components = result.address_components;
	var streetNumber;
	var streetName;
	var locality;
	for (component = 0; component < address_components.length; component++) {
		if (jQuery.inArray("street_number", address_components[component].types) > -1) {
			streetNumber = address_components[component].long_name;
		}
		if (jQuery.inArray("locality", address_components[component].types) > -1) {
			locality = address_components[component].long_name;
		}
		if (jQuery.inArray("route", address_components[component].types) > -1) {
			streetName = address_components[component].long_name;
		}

	}
	var address = streetName ? streetName + " " : "";
	address = streetNumber ? address + streetNumber + ", " : "";
	address = locality ? address + locality : address;
	if (address == "") {
		address = result.formatted_address;
	}
	return address;
}