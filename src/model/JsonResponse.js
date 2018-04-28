module.exports = {
  	AddObjectJsonResponse: function (message, object) {
		return {message: message, object: object}
	},

	GetListJsonResponse: function (objects) {
		return {objects: objects}
	},

	GetObjectJsonResponse: function (message, object) {
		return {message: message, object: object}
	},

	UpdateObjectJsonResponse: function (message, object) {
		return {message: message, object: object}
	},

	DeleteObjectJsonResponse: function (message, id) {
		return {message: message, id: id}
	},

	PrintObjectJsonResponse: function (message, printer, result) {
		return {message: message, printer: printer, result: result}
	},

	GetObjectsByStatusJsonResponse: function (message, objectsByPrinter) {
		return {message: message, objectsByPrinter: objectsByPrinter}
	}
};