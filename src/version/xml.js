const BaseVersioning = require("./base");
const objectPath = require('object-path')
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

module.exports = class Xml extends BaseVersioning {
  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
   bump = async (releaseType) => {
    	// Read the file
    	const fileContent = this.read()
		const parser = new XMLParser()
    	const xmlContent = parser.parse(fileContent)
    	const oldVersion = objectPath.get(xmlContent, this.versionPath, null)

    	// Get the new version
    	this.newVersion = await bumpVersion(
      		releaseType,
      		oldVersion,
    	)

		// Update the file
		if (oldVersion) {
			// Get the name of where the version is in
			const versionName = this.versionPath.split('.').pop()
	
			core.info(`Bumped file "${this.fileLocation}" from "${oldVersion}" to "${this.newVersion}"`)

			this.update(
		  		// We use replace instead of XMLBuilder so we can preserve white spaces and comments
		  		fileContent.replace(
					`<${versionName}>${oldVersion}</${versionName}>`,
					`<${versionName}>${this.newVersion}</${versionName}>`,
		  		),
			)
		} else {
			// Update the content with the new version
			objectPath.set(xmlContent, this.versionPath, this.newVersion)
			const builder = new XMLBuilder()
			this.update(builder.build(xmlContent))
		}
  	}
}