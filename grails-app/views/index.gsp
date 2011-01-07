<%@ page import="com.intelligrape.map.misc.MapMarker" contentType="text/html;charset=UTF-8" %>
<html>
<head>
	%{--<g:javascript library="jquery" plugin="jquery"/>--}%
	<script type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-1.4.3.js')}"></script>
	<script type="text/javascript">
		function testFunction(e, d) {
//			alert(d);
		}

		var markersList=[
			{latitude: 40.689299, longitude: -74.044, draggable: true, content: 'Statue of Liberty'},
			{latitude: 40.729884, longitude: -73.990988, draggable: true, content: 'Bank', icon:'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00'},
			{latitude: 40.729559678851025, longitude: -73.99074196815491, draggable: false, content: 'Astro Place', clickHandler:function(m,e){alert("Map Zoom is :"+m.getZoom())}},
			{latitude: 40.730031233910694, longitude: -73.99142861366272, draggable: false, content: 'Bus Stop', icon:'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00'},
			{latitude: 40.72968163306612, longitude: -73.9911389350891, draggable: false, content: 'Cafe'},
			{latitude: 40.698, longitude: -74.0563, draggable: false, content: 'Liberty State Park'}
		];

	</script>
	<ig:mapInit version="3.2" sensor="false" addressAutoComplete="true"/>
	<title>Google Map Demo</title>
</head>
<body>
<table width="100%">
	<tr>
		<td colspan="2">
			Search : <ig:searchAddressInput name="searchAddress" map="googleMap" width="500"
					minChars="3" scrollHeight="400"
					style="width:90%;" language="en"
					onComplete="testFunction"/> <br/>
		</td>
	</tr>
	<tr>
		<td style="vertical-align:top; text-align:left;">
			<g:set var="homeMarker" value="${new MapMarker(latitude: 40.72968163306612, longitude:-73.991138935)}"/>
			<ig:map
					name="googleMap"
					mapDivId="map_canvas"
					zoom="18"
					homeMarker="${homeMarker}"
					showHomeMarker="true"
					mapTypeId="google.maps.MapTypeId.ROADMAP"
			/>

			<div id="map_canvas" style="height:312px;width:576px"></div>

			<div>
				<ig:directionLink map="googleMap" destination="Sector 59 Noida" panel="directionText">Show Route from Home marker to Sector 59 Noida</ig:directionLink><br/>

				<ig:directionLink map="googleMap" origin="Connaught Place, New Delhi, Delhi, India" destination="Sector 59 Noida" panel="directionText">Show Route from : Connaught Place, New Delhi, Delhi, India to: Sector 59 Noida</ig:directionLink><br/>

				<ig:hideDirection map="googleMap">Hide direction from map only</ig:hideDirection><br/>
				<ig:hideDirection map="googleMap" panel="directionText">Hide direction from map and empty textual direction</ig:hideDirection><br/>
				<ig:streetViewLink map="googleMap" address="42.345573,-71.098326">Show Streetview for 42.345573,-71.098326</ig:streetViewLink><br/>

				<ig:streetViewLink map="googleMap" address="761 Harrison Avenue, Boston, Massachusetts, United States">Show Streetview for 761 Harrison Avenue, Boston, Massachusetts, United States</ig:streetViewLink><br/>

				<ig:hideStreetView map="googleMap">Hide Street view</ig:hideStreetView><br/>

				<ig:updateMarkersOnMapLink map="googleMap" markers="markersList" >Load markers</ig:updateMarkersOnMapLink>
			</div>
		</td>
		<td style="vertical-align:top; text-align:left;">
			<ig:directionSearchPanel map="googleMap" panel="directionText"/>
			<div id="directionText"></div>
		</td>
	</tr>
</table>
</body>
</html>