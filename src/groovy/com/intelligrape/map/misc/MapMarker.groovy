package com.intelligrape.map.misc

/*
*
* @author Bhagwat Kumar
*/

class MapMarker {
	double latitude //Marker position latitude. Required.
	double longitude //Marker position longitude. Required.
	int zIndex
	Boolean draggable=false	 //If true, the marker can be dragged. Default value is false.
	Boolean visible=true	 //If true, the marker is visible
	String title	 //Rollover text
	String icon	 //Url of Icon for the foreground
	String shadow	 //Shadow image url
	Boolean clickable=false	 //	If true, the marker receives mouse and touch events. Default value is true.
	Boolean flat=false	 //	If true, the marker shadow will not be displayed.
	String cursor	 //Mouse cursor to show on hover
	Boolean raiseOnDrag=true	 //If false, disables raising and lowering the marker on drag. This option is true by default.
	String infoWindowText
}
