package com.intelligrape.map.taglib

import com.intelligrape.map.misc.MapMarker

/*
*
* @author Bhagwat Kumar
*/

class MapTagLib {
	static namespace = "ig"

	def config = grailsApplication.config

	def mapInit = {attrs ->
		String version = attrs.remove('version') ?: config.map.api.version
		String sensor = attrs.remove('sensor') ?: config.map.api.sensor
		String language = attrs.remove('language') ?: config.map.api.language ?: null
		Boolean includeAddressAutoComplete = attrs.remove("addressAutoComplete") ?: false
		Map mapOptions = [version: version, sensor: sensor]
		if (language) {
			mapOptions += [language: language]
		}

		out << """
		<script type="text/javascript" src="${grailsApplication.config.map.api.url}?${mapOptions.collect {k, v -> k + "=" + v}.join("&")}"></script>
		<script type="text/javascript" src="${resource(dir: 'js', file: 'map.init.js')}"></script>
		 """
		if (includeAddressAutoComplete) {
			out << """
			<script type="text/javascript" src="${resource(dir: 'js/jquery-autocomplete', file: 'geo_autocomplete.js')}"></script>
			<script type="text/javascript" src="${resource(dir: 'js/jquery-autocomplete', file: 'jquery.autocomplete_geomod.js')}"></script>
	    <link rel="stylesheet" type="text/css" href="${resource(dir: 'css/jquery-autocomplete', file: 'jquery.autocomplete.css')}"/>
			 """
		}
	}

	def map = {attrs ->
		checkRequiredAttributes("map", attrs, ["name", "mapDivId"])

		String name = attrs.remove("name")
		String mapDivId=attrs.remove("mapDivId")
		String zoomString = attrs.remove("zoom")
		Integer zoom = zoomString ? zoomString.toInteger() : config.map.zoom
		String mapTypeId = attrs.remove("mapTypeId") ?: config.map.mapTypeId
		Boolean showHomeMarker = attrs.remove("showHomeMarker")?.toBoolean() ?: false

		MapMarker homeMarker=attrs.remove('homeMarker');

		String latitude = attrs.remove("latitude") ?: config.map.center.lat
		String longitude = attrs.remove("longitude") ?: config.map.center.lng

		if(homeMarker){
			latitude=homeMarker.latitude
			longitude=homeMarker.longitude
		}

		List mapSettingsList = attrs.collect { k, v -> "$k:$v"}
		mapSettingsList.addAll(["mapTypeId:${mapTypeId}", "zoom:${zoom}", "center: new google.maps.LatLng(${latitude}, ${longitude})"])
		String mapSettings = mapSettingsList.join(", ")

		out << """
		<script type="text/javascript">
				var ${name};
				jQuery(function () {${name}=ig_mapInit('${mapDivId}',{${mapSettings}}, ${showHomeMarker})});
		</script>
		 """
	}

	def searchAddressInput = {attrs ->
//		checkRequiredAttributes("searchAddressInput", attrs, ["map"])
		String inputElementId = attrs.id ?: attrs.name
		String language = attrs.remove("language")
		Boolean selectFirst = attrs.remove('selectFirst') ?: false
		int minChars = attrs.remove('minChars')?.toInteger() ?: 3
		int cacheLength = attrs.remove('cacheLength')?.toInteger() ?: 50
		int width = attrs['width']?.toInteger() ?: 356
		boolean scroll = attrs.remove('scroll') ?: true
		int scrollHeight = attrs.remove('scrollHeight')?.toInteger() ?: 330

		String callBackFunctionPassed = attrs.remove('onComplete')
		String map = attrs.remove("map")
		String callBackFunction = "function(event, data){"
		if (callBackFunctionPassed) {
			callBackFunction += "${callBackFunctionPassed}(event,data);"
		}
		if (map) {
			callBackFunction += "updateHomeLocationMarker(${map}, jQuery('#${inputElementId}').val());"
		}
		callBackFunction += "}"

		out << g.textField(attrs)

		Map searchAutoCompleteSettingsMap = [selectFirst: selectFirst, minChars: minChars, cacheLength: cacheLength, width: width, scroll: scroll, scrollHeight: scrollHeight]
		//Todo: use lang settings
//		if(language){searchAutoCompleteSettingsMap+=['lang':language]}
		String searchSettings = "{" + searchAutoCompleteSettingsMap.collect { k, v -> "$k:$v"}.join(",") + "}"
		out << """
		<script type="text/javascript">
				jQuery(function () {initAutoComplete('#${inputElementId}',${searchSettings} ${callBackFunction ? ',' + callBackFunction : ''});});
		</script>
		"""

	}

	def directionSearchPanel = {attrs ->
		checkRequiredAttributes("directionSearchPanel", attrs, ["map"])
		String map = attrs.remove("map")
		String panel = attrs.remove("panel")
		out << render(template: '/map/searchPanel', model: [mapVarName: map, panel: panel])

	}

	def directionLink = {attrs, body ->
		checkRequiredAttributes("directionLink", attrs, ["map", 'destination'])
		String map = attrs.remove("map")
		String panel = attrs.remove("panel")
		String origin = attrs.remove("origin")		 // address or (lat, long) pair
		String destination = attrs.remove("destination") // address or (lat, long) pair
		String travelMode = attrs.remove("travelMode") ?: "${config.map.default.travelMode}"
		String unitSystem = attrs.remove("unitSystem") ?: "${config.map.default.unitSystem}"

		String onClickHandler = ""

		if (origin) {
			onClickHandler = "showDirection('${origin}', '${destination}', ${travelMode}, ${unitSystem}, ${map}, '${panel}');"
		} else {
			origin = "mapConfiguration[$map].homeMarker.getPosition()"
			onClickHandler = "showDirection(${origin}, '${destination}', ${travelMode}, ${unitSystem}, ${map}, '${panel}');"
		}

		out << "<a href=\"#\" onClick=\"${onClickHandler}\" >${body()}</a>"
	}

	def hideDirection = {attrs, body ->
		checkRequiredAttributes("hideDirection", attrs, ["map"])
		String map = attrs.remove("map")
		String panel = attrs.remove("panel")

		String onClickHandler = "hideDirection(${map}, '${panel}');"

		out << "<a href=\"#\" onClick=\"${onClickHandler}\" >${body()}</a>"
	}

	def streetViewLink = {attrs, body ->
		checkRequiredAttributes("streetViewLink", attrs, ["map", "address"])
		String map = attrs.remove("map")
		String address = attrs.remove("address")		 // address or (lat, long) pair

		String onClickHandler = "showStreetView('${address}', ${map});"

		out << "<a href=\"#\" onClick=\"${onClickHandler}\" >${body()}</a>"
	}

	def hideStreetView = {attrs, body ->
		checkRequiredAttributes("hideStreetView", attrs, ["map"])
		String map = attrs.remove("map")
		String panel = attrs.remove("panel")

		String onClickHandler = "hideStreetView(${map}, '${panel}');"

		out << "<a href=\"#\" onClick=\"${onClickHandler}\" >${body()}</a>"
	}

	private void checkRequiredAttributes(String tagName, def attrs, List requiredAttributesList) {
		List missingAttributes = requiredAttributesList - attrs.keySet()
		if (missingAttributes) {
			throwTagError("Tag ${tagName} is missing required attribute(s) : [${missingAttributes.join(',')}]")
		}
	}
}
