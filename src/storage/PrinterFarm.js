var Queue = require('queue-fifo')

//Defines the array of printer objects
var printers = 
	{ "printer1" : 
		{
			name: "printer1",
			inProgress: new Queue(),
			complete: [],
			materialTypes: ["metal"]
		}
	}

/**
 * Send the command to the printer with the specified name to print the object
 */
var printObject = function(printerName, object) {
	var printer = printers[printerName]

	if (!printerName || printerName.length == 0) {
		//handle auto printer select
		return {message: "Error: Printer must be specified"}
	}
	if (object == null) {
		return {message : "The object does not exist"}	
	}
	if (printer == null) {
		return {message: "Error: The printer with the name '" + printerName + "' does not exist"}
	}
		
	printer.inProgress.enqueue(object)
	return {message: "Object " + object.name + " was added to the print queue", object: object, printer: printerName}
}

/**
 * For each printer, get all objects that have the status specified
 */
var getByStatus = function(status) {
	if (status === "inProgress") {
		var queuedObjectsByPrinter = {}
		
		for (var i in printers) {
			var printer = printers[i]
			var inProgressArray = []
			var inProgressQueue = printer.inProgress
			
			while (inProgressQueue.size() !== 0) {
				inProgressArray.push(inProgressQueue.dequeue())
			}
			queuedObjectsByPrinter[printer.name] = inProgressArray
		}

		return {message: "Success", objectsByPrinter: queuedObjectsByPrinter}
	} else if (status === "complete") {
		var completedObjectsByPrinter = {}
		
		for (var i in printers) {
			var printer = printers[i]
			completedObjectsByPrinter[printer.name] = printer.complete
		}

		return {message: "success", objectsByPrinter: completedObjectsByPrinter}
	} else {
		return {message: "Invalid status", objectsByPrinter: null}
	}
}

/**
 * resets all data for testing purposes
 */
var reset = function() {
	printers = {
		"printer1" : {
			name: "printer1",
			inProgress: new Queue(),
			complete: [],
			materialTypes: ["metal"]
		}
	}
}

module.exports.printObject = printObject
module.exports.getByStatus = getByStatus
module.exports.reset = reset
