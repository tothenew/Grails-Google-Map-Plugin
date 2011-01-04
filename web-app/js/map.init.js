var igGoogleMap;
var homeLocation;
var homeMarker;
function ig_mapInit(ig_mapDiv, ig_mapConfiguration, shoHomeMarker){
	homeLocation=ig_mapConfiguration['center'];

	igGoogleMap = new google.maps.Map(document.getElementById(ig_mapDiv), ig_mapConfiguration);
	if(shoHomeMarker){
		homeMarker=new google.maps.Marker({map:igGoogleMap, position:homeLocation, draggable:true});
	}
}

function initAutoComplete(inputSelector, callback) {
	var geocoder = new google.maps.Geocoder();
	jQuery(inputSelector).geo_autocomplete(geocoder, {
		selectFirst: false,
		minChars: 3,
		cacheLength: 50,
		width: 356,
		scroll: true,
		scrollHeight: 330
	}).result(function(_event, _data) {
		if (callback) {
			callback(_event, _data);
		}
	});
}