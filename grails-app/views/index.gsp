<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
	%{--<g:javascript library="jquery" plugin="jquery"/>--}%
	<script type="text/javascript" src="${resource(dir: 'js/jquery', file: 'jquery-1.4.3.js')}"></script>
	<ig:mapInit version="3.2" sensor="false" addressAutoComplete="true"/>
	<title>Google Map Demo</title>
</head>
<body>
<ig:searchAddressInput name="searchAddress" width="400" minChars="3" scrollHeight="400" style="width:400px;"/>
<ig:map
		height="500px"
		width="600px"
		lat="40.689299"
		lng="-74.044"
		zoom="13"
		shoHomeMarker="true"
		mapTypeId="google.maps.MapTypeId.ROADMAP"/>
</body>
</html>