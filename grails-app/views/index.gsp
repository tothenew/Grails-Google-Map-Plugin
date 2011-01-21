<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
	<g:javascript library="jquery" />
	<googleMap:init version="3.2" sensor="false" addressAutoComplete="true"/>
	<script type="text/javascript">
		function testFunction(e, d) {
//			alert(d);
		}
		function rightclickHandler(event) {
//			alert(event)
		}
		function streetViewVisibilityChanged(){
//			alert("Street view visibility changed")
		}

		function streetViewErrorHandler(x){
//			console.debug(jQuery(x).text());
		}
		var markersList = [
			{latitude: 40.689299, longitude: -74.044, draggable: true, content: 'Statue of Liberty'},
			{latitude: 40.729884, longitude: -73.990988, draggable: true, content: 'Bank', icon:'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00'},
			{latitude: 40.729559678851025, longitude: -73.99074196815491, draggable: false, content: 'Astro Place', clickHandler:function(m, e) {
				alert("Map Zoom is :" + m.getZoom())
			}},
			{latitude: 40.730031233910694, longitude: -73.99142861366272, draggable: false, content: 'Bus Stop', icon:'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00'},
			{latitude: 40.72968163306612, longitude: -73.9911389350891, draggable: false, content: 'Cafe'},
			{latitude: 40.698, longitude: -74.0563, draggable: false, content: 'Liberty State Park'}
		];

	</script>
	<title>Google Map Demo</title>
</head>
<body>
<table width="100%">
	<tr>
		<td colspan="2">
			Search : <googleMap:searchAddressInput name="searchAddress" map="googleMap" width="500"
					minChars="3" scrollHeight="400"
					style="width:90%;" language="hi"
					onComplete="testFunction"/> <br/>
		</td>
	</tr>
	<tr>
		<td style="vertical-align:top; text-align:left;">
			<googleMap:map
					name="googleMap"
					mapDivId="map_canvas"
					zoom="18"
					homeMarker="[latitude: 40.729883, longitude: -73.990986, draggable: false, visible:true, content: 'Liberty State Park']"
					mapTypeId="google.maps.MapTypeId.ROADMAP"
					latitudeId="latitude"
					longitudeId="longitude"
				  streetViewEventHandlers="[visible_changed 	:'streetViewVisibilityChanged']"
					mapEventHandlers="[dblclick:'function(){alert(10)}', rightclick:'rightclickHandler']"/>

			<div id="map_canvas" style="height:312px;width:576px"></div>

			<div>
				<googleMap:directionLink map="googleMap" destination="Sector 59 Noida" panel="directionText">Show Route from Home marker to Sector 59 Noida</googleMap:directionLink><br/>

				<googleMap:directionLink map="googleMap" origin="Connaught Place, New Delhi, Delhi, India" destination="Sector 59 Noida" panel="directionText">Show Route from : Connaught Place, New Delhi, Delhi, India to: Sector 59 Noida</googleMap:directionLink><br/>

				<googleMap:hideDirection map="googleMap">Hide direction from map only</googleMap:hideDirection><br/>
				<googleMap:hideDirection map="googleMap" panel="directionText">Hide direction from map and empty textual direction</googleMap:hideDirection><br/>

				<googleMap:streetViewLink map="googleMap" address="42.345573,-71.098326" pitch="10" zoom="2">Show Street view for 42.345573,-71.098326</googleMap:streetViewLink><br/>

				<googleMap:streetViewLink map="googleMap" address="761 Harrison Avenue, Boston, Massachusetts, United States">Show Street view for 761 Harrison Avenue, Boston, Massachusetts, United States</googleMap:streetViewLink><br/>

				<googleMap:streetViewLink map="googleMap" address="Sector 59 Noida" errorHandler="streetViewErrorHandler">Show Street view for Sector 59 Noida</googleMap:streetViewLink><br/>

				<googleMap:hideStreetView map="googleMap">Hide Street view</googleMap:hideStreetView><br/>

				<googleMap:updateMarkersOnMapLink map="googleMap" markers="markersList" clearOld="true">Load markers</googleMap:updateMarkersOnMapLink>
			</div>
		</td>
		<td style="vertical-align:top; text-align:left;">
			<table>
				<tr>
					<td>
						<g:message code="directionSearch.travelModeText" default="Travel Mode"/> :
					</td>
					<td>
						<select id="travel-mode">
							<option value="google.maps.DirectionsTravelMode.DRIVING">Driving</option>
							<option value="google.maps.DirectionsTravelMode.BICYCLING" selected="selected">Bicycling</option>
							<option value="google.maps.DirectionsTravelMode.WALKING" selected="selected">Walking</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>
						<g:message code="directionSearch.origin.text" default="Origin"/> :
					</td>
					<td>
						<googleMap:searchAddressInput name="origin" size="42" class="inputType" value=""/>
					</td>
				</tr>
				<tr>
					<td>
						<g:message code="directionSearch.destination.text" default="Destination"/> :
					</td>
					<td>
						<googleMap:searchAddressInput name="destination" size="42" class="inputType" value=""/>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<g:set var="updateLabel" value="${message(code:'directionSearch.button.update', default:'Update')}"/>
						<input type="button" class="button_img" name="updateDirection" value="${updateLabel}"
								onclick="${googleMap.directionSearchHandler(map: 'googleMap', panel: 'directionText', originDomId: 'origin', destinationDomId: 'destination', travelModeDomId: 'travel-mode')}"/>
					</td>
				</tr>
			</table>

			<div id="directionText"></div>
		</td>
	</tr>
</table>
<form action="#">
	<g:hiddenField name="latitude"/>
	<g:hiddenField name="longitude"/>
</form>
</body>
</html>