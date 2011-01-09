<table>
	<tr>
		<td>
			<g:message code="directionSearch.travelModeText" default="Travel Mode"/> :
		</td>
		<td>
			<g:set var="byCar" value="${message(code:'directionSearch.travelModeText.byCar', default:'By Car')}"/>
			<g:set var="walking" value="${message(code:'directionSearch.travelModeText.walking', default:'Walking')}"/>
			<select id="travel-mode-input">
				<option value="driving">${byCar}</option>
				<option value="walking" selected="selected">${walking}</option>
			</select>
		</td>
	</tr>
	<tr>
		<td>
			<g:message code="directionSearch.origin.text" default="Origin"/> :
		</td>
		<td>
			<googleMap:searchAddressInput name="origin" size="42" class="inputType"/>
		</td>
	</tr>
	<tr>
		<td>
			<g:message code="directionSearch.destination.text" default="Destination"/> :
		</td>
		<td>
			<googleMap:searchAddressInput name="destination" size="42" class="inputType"/>
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<g:set var="updateLabel" value="${message(code:'directionSearch.button.update', default:'Update')}"/>
			<input type="button" class="button_img" name="ig_updateDirection" value="${updateLabel}" onclick="ig_updateDirection(${mapVarName}, '${panel}');"/>
		</td>
	</tr>
</table>
