var ObjectModel = require('../model/ObjectModel.js')

var mem = {}

/**
 * Add a print object to the object storage
 */
var addObject = function (object) {
	if (mem[object.name] == null) {
		mem[object.name] = object
		return object
	} else {
		return null
	}
	
}

/**
 * Get a collection of all objects in the object storage
 */
var getAllObjects = function() {
	var objects = []

	for (var objName in mem) {
		objects.push(mem[objName])
	}

    return objects
}

/**
 * Get a single object by its unique name
 */
var getObjectByName = function (name) {
	return mem[name]
}

/**
 * Get a single object by its unique id
 */
var getObjectById = function (id) {
	if (id == null) {
		return null
	} else {
		return ObjectModel.createObject("dummy", "dummy", "dummy", 0, 0, id)
	}
}

/**
 * Update a single object, identified by unique name
 */
var updateObject = function (oldName, newName, materialType, printerType, orientation, density) {
	var obj = mem[oldName]

	if (obj != null) {
		if (materialType != null) {
	        obj.materialType = materialType
	    }
	    if (printerType != null) {
	        obj.printerType = printerType
	    }
	    if (parseInt(orientation) != null) {
	        obj.orientation = parseInt(orientation)
	    }
	    if (parseInt(density) != null) {
	        obj.density = parseInt(density)
	    }

	    if (newName != null) {
	    	if (mem[newName] == null && newName !== oldName && newName) {

	    		mem[oldName] = null
	    		mem[newName] = obj
	    	} else {
	    		//cannot update this document as a document with the same name already exists
	    		obj = null
	    	}
	    } else {
			mem[oldName] = obj
		}
	}
    return obj
}

/**
 * Delete an object by name
 */
var deleteObject = function (name) {
	var obj = mem[name]
	if (obj != null) {
		mem[name] = null
		return true
	} else {
		return false
	}
}

/**
 * remove all objects from the DB
 */
var clearDB = function() {
	mem = {}
}

module.exports.addObject = addObject
module.exports.getAllObjects = getAllObjects
module.exports.getObjectByName = getObjectByName
module.exports.getObjectById = getObjectById
module.exports.updateObject = updateObject
module.exports.deleteObject = deleteObject
module.exports.clearDB = clearDB