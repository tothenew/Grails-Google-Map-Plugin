<div id="top-direction" class="clearfix">
	<ul>
		<li class="topborder"><g:message code="rover.publicSite.directionSearch.travelModeText" default="Travel Mode"/> :
		<g:set var="byCar" value="${message(code:'rover.publicSite.directionSearch.travelModeText.byCar', default:'By Car')}"/>
		<g:set var="walking" value="${message(code:'rover.publicSite.directionSearch.travelModeText.walking', default:'Walking')}"/>
			<select id="travel-mode-input">
				<option value="driving">${byCar}</option>
				<option value="walking" selected="selected">${walking}</option>
			</select>
		</li>
		<li>A : <ig:searchAddressInput name="origin" size="42" class="inputType"/></li>
		<li>B : <ig:searchAddressInput name="destination" size="42" class="inputType"/></li>
		<li class="right"><g:set var="updateLabel" value="${message(code:'rover.publicSite.directionSearch.button.update', default:'Update')}"/>
		<g:set var="swapLabel" value="${message(code:'rover.publicSite.directionSearch.button.swap', default:'Swap')}"/>
			<input type="button" class="button_img" name="updateDirection" value="${updateLabel}" onclick="updateDirection(${mapVarName}, '${panel}');"/>
	</ul>
</div>
<div id="directionsPanel"></div>
