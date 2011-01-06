package com.intelligrape.map.taglib

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
		checkRequiredAttributes("map", attrs, ["name"])

		String name = attrs.remove("name")
		String width = attrs.remove("width") ?: config.map.div.width
		String height = attrs.remove("height") ?: config.map.div.height
		String lat = attrs.remove("lat") ?: config.map.center.lat
		String lng = attrs.remove("lng") ?: config.map.center.lng
		String zoomString = attrs.remove("zoom")
		Integer zoom = zoomString ? zoomString.toInteger() : config.map.zoom
		String mapTypeId = attrs.remove("mapTypeId") ?: config.map.mapTypeId
		Boolean showHomeMarker = attrs.remove("showHomeMarker")?.toBoolean() ?: false

		List mapSettingsList = attrs.collect { k, v -> "$k:$v"}
		mapSettingsList.addAll(["mapTypeId:${mapTypeId}", "zoom:${zoom}", "center: new google.maps.LatLng(${lat}, ${lng})"])
		String mapSettings = mapSettingsList.join(", ")

		out << """
		<script type="text/javascript">
				var ${name};
				jQuery(function () {${name}=ig_mapInit('${name}_Canvas',{${mapSettings}}, ${showHomeMarker})});
		</script>
	<div id="${name}_Canvas" style="height:${height};width:${width}"></div>
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
		checkRequiredAttributes("directionSearchPanel", attrs, ["map"])
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

	private void checkRequiredAttributes(String tagName, def attrs, List requiredAttributesList) {
		List missingAttributes = requiredAttributesList - attrs.keySet()
		if (missingAttributes) {
			throwTagError("Tag ${tagName} is missing required attribute(s) : [${missingAttributes.join(',')}]")
		}
	}
}
