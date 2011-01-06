// configuration for plugin testing - will not be included in the plugin zip
grails.views.javascript.library="jquery"

map.api.url="http://maps.google.com/maps/api/js"
map.api.version="3.2"
map.api.sensor="false"

map.div.height="400px"
map.div.width="400px"

map.center.lat="28.627"
map.center.lng= "77.235"

map.zoom= 10
map.myTypeId="google.maps.MapTypeId.ROADMAP"

map.default.travelMode="google.maps.DirectionsTravelMode.WALKING"
map.default.unitSystem ="google.maps.DirectionsUnitSystem.METRIC"

log4j = {
    // Example of changing the log pattern for the default console
    // appender:
    //
    //appenders {
    //    console name:'stdout', layout:pattern(conversionPattern: '%c{2} %m%n')
    //}

    error  'org.codehaus.groovy.grails.web.servlet',  //  controllers
           'org.codehaus.groovy.grails.web.pages', //  GSP
           'org.codehaus.groovy.grails.web.sitemesh', //  layouts
           'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
           'org.codehaus.groovy.grails.web.mapping', // URL mapping
           'org.codehaus.groovy.grails.commons', // core / classloading
           'org.codehaus.groovy.grails.plugins', // plugins
           'org.codehaus.groovy.grails.orm.hibernate', // hibernate integration
           'org.springframework',
           'org.hibernate',
           'net.sf.ehcache.hibernate'

    warn   'org.mortbay.log'
}
