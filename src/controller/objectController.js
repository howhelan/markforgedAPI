var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectModel = require('../model/ObjectModel.js')
var JsonResponse = require('../model/JsonResponse.js')
var Storage = require('../storage/MemoryStorage.js')

router.use(bodyParser.urlencoded({ extended: true }));

/**
 * @api {post} /objects Add an object to the object database
 * @apiName AddObject
 * @apiGroup Objects
 *
 * @apiParam {String} name          the unique name of the object
 * @apiParam {String} materialType  the materialType of the object
 * @apiParam {String} printerType   the printerType of the object
 * @apiParam {String} orientation   the orientation of the object
 * @apiParam {String} density       the density of the object
 */
router.post('/', function (req, res) {
    var result

    //use -1 as the placeholder ID and allow storage to generate unique ID
    var object = ObjectModel.createObject(req.body.name, req.body.materialType, req.body.printerType,
        parseInt(req.body.orientation), parseInt(req.body.density), -1)
    if (object != null) {
        result = Storage.addObject(object)
    }

    if (result != null) {
        res.status(200).send(JsonResponse.AddObjectJsonResponse("Success", object))
    } else if (object != null) {
        //The request was valid but the storage failed
        res.status(400).send(JsonResponse.AddObjectJsonResponse("An error occured while adding the object", null))
    } else {
        //bad request
        res.status(400).send(JsonResponse.AddObjectJsonResponse("An object already exists with that name", null))
    }

});

/**
 * @api {get} /objects Get all the objects in the database
 * @apiName GetObjectsAll
 * @apiGroup Objects
 */
router.get('/', function (req, res) {
    var objects = Storage.getAllObjects()
    res.status(200).send(JsonResponse.GetListJsonResponse(objects))
});

/**
 * @api {get} /objects Get an object by its unique name
 * @apiName GetObjectsByName
 * @apiGroup Objects
 *
 * @apiParam {String} name  The unique name of the object
 */
router.get('/name/:name', function (req, res) {
    var obj = Storage.getObjectByName(req.params.name)

    if (obj != null) {
        res.status(200).send(JsonResponse.GetObjectJsonResponse("Success", obj))
    } else {
        res.status(200).send(JsonResponse.GetObjectJsonResponse("Not found", null))
    }

});

/**
 * @api {put} /objects Update an object
 * @apiName UpdateObject
 * @apiGroup Objects
 *
 * @apiParam {String} name          The unique name of the object to be updated
 * @apiParam {String} name          optional: The new name of the object
 * @apiParam {String} materialType  optional: The new materialType of the objet
 * @apiParam {String} printerType   optional: The new printerType of the object
 * @apiParam {String} orientation   optional: The new orientation of the object
 * @apiParam {String} density       optional: The new density of the object
 */
router.put('/name/:name', function (req, res) {
    var name = req.params.name
    var obj = Storage.updateObject(name, req.body.name, req.body.materialType, req.body.printerType, req.body.orientation, 
        req.body.density)

    if (obj != null) {
        res.status(200).send(JsonResponse.UpdateObjectJsonResponse("Success", obj))
    } else {
        res.status(400).send(JsonResponse.UpdateObjectJsonResponse("Object not found", null))
    }
});

/**
 * @api {delete} /objects Delete an object from the database
 * @apiName DeleteObject
 * @apiGroup Objects
 *
 * @apiParam {String} name          The unique name of the object to be deleted
 */
router.delete('/name/:name', function (req, res) {
    var name = req.params.name
    var success = Storage.deleteObject(name)

     if (success) {
        res.status(200).send(JsonResponse.DeleteObjectJsonResponse("Success", name))
    } else {
        res.status(400).send(JsonResponse.UpdateObjectJsonResponse("Object not found", name))
    }
});

module.exports = router;
