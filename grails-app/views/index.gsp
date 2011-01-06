<%@ page contentType="text/html;charset=UTF-8" %>
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

<div>
	Search : <ig:searchAddressInput name="searchAddress" map="googleMap" width="380"
			minChars="3" scrollHeight="400"
			style="width:360px;" language="sv"
			onComplete="testFunction"/> <br/>
</div>
<ig:map
		name="googleMap"
		height="300px"
		width="400px"
		lat="40.689299"
		lng="-74.044"
		zoom="13"
		showHomeMarker="true"
		mapTypeId="google.maps.MapTypeId.ROADMAP"/>
<ig:directionLink
		map="googleMap"
		origin="Connaught Place, New Delhi, Delhi, India"
		destination="Sector 59 Noida"
		panel="directionText">Show Route</ig:directionLink>
<ig:directionSearchPanel map="googleMap" panel="directionText"/>
<div id="directionText"></div>

</body>
</html>