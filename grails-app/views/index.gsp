<%@ page import="com.intelligrape.map.misc.MapMarker" contentType="text/html;charset=UTF-8" %>
<html>
<head>
	%{--<g:javascript library="jquery" plugin="jquery"/>--}%
	<script type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-1.4.3.js')}"></script>
	<script type="text/javascript">
		function testFunction(e, d) {
//			alert(d);
		}
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
			<g:set var="homeMarker" value="${new MapMarker(latitude: 40.689299, longitude:-74.044)}"/>
			<ig:map
					name="googleMap"
					mapDivId="map_canvas"
					zoom="13"
					homeMarker="${homeMarker}"
					showHomeMarker="true"
					mapTypeId="google.maps.MapTypeId.ROADMAP"/>

			<div id="map_canvas" style="height:312px;width:576px"></div>

			<div>
				<ig:directionLink map="googleMap" destination="Sector 59 Noida" panel="directionText">Show Route from Home marker to Sector 59 Noida</ig:directionLink><br/>

				<ig:directionLink map="googleMap" origin="Connaught Place, New Delhi, Delhi, India" destination="Sector 59 Noida" panel="directionText">Show Route from : Connaught Place, New Delhi, Delhi, India to: Sector 59 Noida</ig:directionLink><br/>

				<ig:hideDirection map="googleMap">Hide direction from map only</ig:hideDirection><br/>
				<ig:hideDirection map="googleMap" panel="directionText">Hide direction from map and empty textual direction</ig:hideDirection><br/>
				<ig:streetViewLink map="googleMap" address="42.345573,-71.098326">Show Streetview for 42.345573,-71.098326</ig:streetViewLink><br/>

				<ig:streetViewLink map="googleMap" address="761 Harrison Avenue, Boston, Massachusetts, United States">Show Streetview for 761 Harrison Avenue, Boston, Massachusetts, United States</ig:streetViewLink><br/>

				<ig:hideStreetView map="googleMap">Hide Street view</ig:hideStreetView><br/>
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