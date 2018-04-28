process.env.NODE_ENV = 'test';

var ObjectController = require('../src/controller/objectController.js')
var Storage = require('../src/storage/MemoryStorage.js')

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/config/server');
var should = chai.should();

chai.use (chaiHttp)

describe ('ObjectController', () => {
	beforeEach ((done) => {
		Storage.clearDB()
		done()
	})

	describe('/POST objects_noName', () => {
      	var noname = {
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}

      	it('Try to add a object without a name', (done) => {
       		chai.request(server)
            	.post('/objects')
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.send(noname)
            	.end((err, res) => {
               		res.should.have.status(400)
              		done()
        	})
  		})
	})


	describe('/GET objects_listNoneInDb', () => {
      it('should get no objects since there are none in the DB', (done) => {
        chai.request(server)
            .get('/objects')
            .end((err, res) => {
                res.should.have.status(200) 
                res.body.objects.should.be.a('array')
                res.body.objects.length.should.be.eql(0)
              	done()
            })
      	})
	})

	describe('/GET objects_list', () => {
		var newObject1 = {
			name: "testSTL1",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
		var newObject2 = {
			name: "testSTL2",
			materialType: "carbon fiber",
			printerType: "cfPrinter1",
			orientation: 20,
			density: 13
		}
     	it('retrieving all objects', (done) => {
        	chai.request(server)
        		.post('/objects')
        		.send(newObject1)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
			})
        	chai.request(server)
        		.post('/objects')
        		.send(newObject2)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
			})

        	chai.request(server)
            	.get('/objects')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                res.body.objects.should.be.a('array')
	                res.body.objects.length.should.be.eql(2)
	                if (res.body.objects[0].name === newObject1.name) {
	                	res.body.objects[0].materialType.should.be.eql(newObject1.materialType)
						res.body.objects[1].materialType.should.be.eql(newObject2.materialType)
	                } else {
						res.body.objects[1].materialType.should.be.eql(newObject1.materialType)
						res.body.objects[0].materialType.should.be.eql(newObject2.materialType)
	                }
	              	done()
        	})
    	})
  	})

	describe('/GET objects_byNameNotInDB', () => {
      it('Get a non existant object', (done) => {
        chai.request(server)
            .get('/objects/name/testSTL')
            .end((err, res) => {
                res.should.have.status(200) 
                res.body.should.have.property('object')
                res.body.should.have.property('message')
                should.not.exist(res.body.object)
               	res.body.message.should.be.eql("Not found")
              	done()
            })
      	})
	})

	describe('/GET objects_byName', () => {
		var newObject = {
			name: "testSTL",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
     	it('retrieve an object by name', (done) => {
        	chai.request(server)
        		.post('/objects')
        		.send(newObject)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
    		})
        	chai.request(server)
            	.get('/objects/name/testSTL')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.exist(res.body.object)
	                res.body.object.name.should.be.eql(newObject.name)
	                res.body.object.materialType.should.be.eql(newObject.materialType)
	                res.body.object.printerType.should.be.eql(newObject.printerType)
	                newObject.orientation.should.be.eql(parseInt(res.body.object.orientation))
	                newObject.density.should.be.eql(parseInt(res.body.object.density))
	              	done()
        	})
      	})
	})

	describe('/PUT objects_updateMaterialType', () => {
		var newObject = {
			name: "testSTL",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
		var update = {
			materialType: "metal2"
		}
     	it('update the materialType of an object', (done) => {
        	chai.request(server)
        		.post('/objects')
        		.send(newObject)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
    		})
        	chai.request(server)
            	.put('/objects/name/testSTL')
        		.send(update)
        		.set('content-type', 'application/x-www-form-urlencoded')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.exist(res.body.object)
	                res.body.object.name.should.be.eql(newObject.name)
	                res.body.object.materialType.should.be.eql(update.materialType)
            })
          	chai.request(server)
            	.get('/objects/name/testSTL')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.exist(res.body.object)
	                res.body.object.name.should.be.eql(newObject.name)
	                res.body.object.materialType.should.be.eql(update.materialType)
	              	done()
        	})
  		})
	})

	describe('/PUT objects_updateToExistingName', () => {
		var newObject1 = {
			name: "testSTL1",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
		var newObject2 = {
			name: "testSTL2",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
		var update = {
			name: "testSTL2"
		}
     	it('update an object name to an existing name and get error', (done) => {
        	chai.request(server)
        		.post('/objects')
        		.send(newObject1)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
        		})
    		chai.request(server)
        		.post('/objects')
        		.send(newObject2)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
        		})
        	chai.request(server)
            	.put('/objects/name/testSTL1')
        		.send(update)
        		.set('content-type', 'application/x-www-form-urlencoded')
            	.end((err, res) => {
	                res.should.have.status(400) 
	            })
          	chai.request(server)
            	.get('/objects/name/testSTL1')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.exist(res.body.object)
	              	done()
            	})
  		})
	})

	describe('/PUT objects_updateToEmptyName', () => {
		var newObject1 = {
			name: "testSTL1",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
		var update = {
			name: ""
		}
     	it('update an object to name an empty name and get error', (done) => {
        	chai.request(server)
        		.post('/objects')
        		.send(newObject1)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
        		})
        	chai.request(server)
            	.put('/objects/name/testSTL1')
        		.send(update)
        		.set('content-type', 'application/x-www-form-urlencoded')
            	.end((err, res) => {
	                res.should.have.status(400) 
	            })
          	chai.request(server)
            	.get('/objects/name/testSTL1')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.exist(res.body.object)
	              	done()
            	})
  		})
	})

	describe('/DELETE objects', () => {
		var newObject1 = {
			name: "testSTL",
			materialType: "metal",
			printerType: "metalPrinter1",
			orientation: 12,
			density: 50
		}
     	it('delete a document', (done) => {
        	chai.request(server)
        		.post('/objects')
        		.send(newObject1)
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.end((err, res) => {
        			res.should.have.status(200)
    		})
          	chai.request(server)
            	.get('/objects/name/testSTL')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.exist(res.body.object)
	              	
        	})
            chai.request(server)
            	.delete('/objects/name/testSTL')
            	.end((err, res) => {
	                res.should.have.status(200) 
	              	
        	})
        	chai.request(server)
            	.get('/objects/name/testSTL')
            	.end((err, res) => {
	                res.should.have.status(200) 
	                should.not.exist(res.body.object)
	              	done()
        	})
  		})
	})

	describe('/DELETE objects_nonExistant', () => {
     	it('delete a document that does not exist', (done) => {
            chai.request(server)
            	.delete('/objects/name/testSTL')
            	.end((err, res) => {
	                res.should.have.status(400) 
	                done()
        	})
  		})
	})
})

	