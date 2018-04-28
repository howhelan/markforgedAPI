var createObject = function (name, materialType, printerType, orientation, density, id) {
    var inputIsValid = true

	if (typeof name != "string" || typeof materialType != "string" || typeof printerType != "string"
		|| typeof orientation  != "number" || typeof density != "number", typeof id != "number" 
		|| name == null || materialType == null || printerType == null || orientation == null
		|| density == null || id == null) {
		inputIsValid = false;
		console.log("Invalid parameter types for Object creation")
	}

	if (inputIsValid) {
		return {name: name, materialType: materialType, printerType: printerType, orientation: orientation,
		 density: density, id: id}
	}
  }

module.exports.createObject = createObject

