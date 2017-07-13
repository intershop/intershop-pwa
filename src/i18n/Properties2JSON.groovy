package i18n

import org.gradle.api.Plugin
import org.gradle.api.Project

class Properties2JSON implements Plugin<Project> {

  @Override
  void apply(Project project) {
    collectFiles(project).reverseEach { file ->
      if (file?.exists()) {
        file.withInputStream {
          def properties = new Properties()
          //noinspection GroovyAssignabilityCheck
          properties.load(it)
          properties.stringPropertyNames().each {
            //...
          }
        }
      }
    }
  }

  private static def collectFiles(Project project) {
    def files = []
    while (project != null) {
      files.add project.file("local.properties")
      project = project.parent
    }
    return files
  }
}
