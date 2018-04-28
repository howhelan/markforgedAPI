var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var JsonResponse = require('../model/JsonResponse.js')
var PrinterFarm = require('../storage/PrinterFarm.js')
var Storage = require('../storage/MemoryStorage.js')

router.use(bodyParser.urlencoded({ extended: true }));

/**
 * @api {post} /prints Print an object identified by the name
 * @apiName AddPrint
 *
 * @apiParam {String} objectName    the name of the object to print
 * @apiParam {String} printer       the name of the printer to print with
 */
router.post('/', function (req, res) {
    var result
    var object = Storage.getObjectByName(req.body.objectName)
    
    if (object != null) {
        result = PrinterFarm.printObject(req.body.printer, object)
    } else {
    	console.log("requested object with name : " + req.body.objectName + " could not be found")
    }

    if (object == null) {
        res.status(400).send(JsonResponse.PrintObjectJsonResponse("Bad request: The object was not found", null))
    } else if (result.object != null && result.printer != null) {
        res.status(200).send(JsonResponse.PrintObjectJsonResponse(result.message, result.printer, result.object))
    } else {
        res.status(400).send(JsonResponse.PrintObjectJsonResponse(result.message, null))
    } 

});

/**
 * @api {get} /prints/status Get all objects in all printers with the status matching the specified status
 * @apiName GetPrintsByStatus
 *
 * @apiParam {string} status The status
 */
router.get('/status/:status', function (req, res) {
    var result = PrinterFarm.getByStatus(req.params.status)
	res.status(200).send(JsonResponse.GetObjectsByStatusJsonResponse(result.message, result.objectsByPrinter))
});

module.exports = router;
