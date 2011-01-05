<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
	%{--<g:javascript library="jquery" plugin="jquery"/>--}%
	<script type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-1.4.3.js')}"></script>
	<script type="text/javascript">
		function testFunction(e,d){
//			alert(d);
		}
	</script>
	<ig:mapInit version="3.2" sensor="false" addressAutoComplete="true"/>
	<title>Google Map Demo</title>
</head>
<body>
Search <ig:searchAddressInput name="searchAddress" map="googleMap" width="400"
		minChars="3" scrollHeight="400"
		style="width:400px;" language="sv"
	  onComplete="testFunction"
/> <br/>
<ig:map
		name="googleMap"
		height="300px"
		width="400px"
		lat="40.689299"
		lng="-74.044"
		zoom="13"
		showHomeMarker="true"
		mapTypeId="google.maps.MapTypeId.ROADMAP"/>

<ig:directionSearchPanel map="googleMap" panel="directionText"/>
<div id="directionText"></div>

</body>
</html>