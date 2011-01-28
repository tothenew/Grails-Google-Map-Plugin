import org.codehaus.groovy.grails.commons.ConfigurationHolder
import grails.util.GrailsUtil

class GoogleMapGrailsPlugin {
	// the plugin version
	def version = "0.1"
	// the version or versions of Grails the plugin is designed for
	def grailsVersion = "1.3.6 > *"
	// the other plugins this plugin depends on
	def dependsOn = [:]
	// resources that are excluded from plugin packaging
	def pluginExcludes = [
			"grails-app/views/error.gsp",
			"grails-app/views/index.gsp"
	]

	def author = "Bhagwat Kumar"
	def authorEmail = "bhagwat@intelligrape.com"
	def title = "Google Map"
	def description = '''\\
Integrate Google map version 3 into your grails application
'''

	// URL to the plugin's documentation
	def documentation = "http://grails.org/plugin/google-map"

	def doWithWebDescriptor = { xml ->
		// TODO Implement additions to web.xml (optional), this event occurs before
	}

	def doWithSpring = {
		loadQuartzConfig()
	}

	def doWithDynamicMethods = { ctx ->
		// TODO Implement registering dynamic methods to classes (optional)
	}

	def doWithApplicationContext = { applicationContext ->
		// TODO Implement post initialization spring config (optional)
	}

	def onChange = { event ->
		// TODO Implement code that is executed when any artefact that this plugin is
		// watching is modified and reloaded. The event contains: event.source,
		// event.application, event.manager, event.ctx, and event.plugin.
	}

	def onConfigChange = { event ->
		// TODO Implement code that is executed when the project configuration changes.
		// The event is the same as for 'onChange'.
	}

	private void loadQuartzConfig() {
		def config = ConfigurationHolder.config
		GroovyClassLoader classLoader = new GroovyClassLoader(getClass().classLoader)

		config.merge(new ConfigSlurper(GrailsUtil.environment).parse(classLoader.loadClass('DefaultGoogleMapConfig')))

		try {
			config.merge(new ConfigSlurper(GrailsUtil.environment).parse(classLoader.loadClass('GoogleMapConfig')))
		} catch (Exception ignored) {
		}
	}

}