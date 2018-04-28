process.env.NODE_ENV = 'test';

var PrinterController = require('../src/controller/printerController.js')
var PrinterFarm = require('../src/storage/PrinterFarm.js')
var Storage = require('../src/storage/MemoryStorage.js')

var Queue = require('queue-fifo')

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/config/server');
var should = chai.should();

chai.use (chaiHttp)

describe ('PrinterController', () => {
	beforeEach ((done) => {
		PrinterFarm.reset()

		Storage.addObject({
			name: "obj1",
			materialType: "metal",
			printerType: "special",
			orientation: 123,
			density: 5,
			id: 0
		})
		done()
	})

	describe('/POST prints', () => {
		var reqBody = {
			objectName : "obj1",
			printer: "printer1"
		}

      	it('Print an object that exists in the DB', (done) => {
       		chai.request(server)
            	.post('/prints')
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.send(reqBody)
            	.end((err, res) => {
               		res.should.have.status(200)
               		res.body.message.should.be.eql("Object obj1 was added to the print queue")
              		done()
        	})
  		})
	})

	describe('/POST prints_nonExistantObject', () => {
		var reqBody = {
			objectName : "obj2",
			printer: "printer1"
		}

      	it('Print an object that does not exist in the DB', (done) => {
       		chai.request(server)
            	.post('/prints')
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.send(reqBody)
            	.end((err, res) => {
               		res.should.have.status(400)
               		res.body.message.should.be.eql("Bad request: The object was not found")
              		done()
        	})
  		})
	})

	describe('/POST prints_nonExistantPrinter', () => {
		var reqBody = {
			objectName : "obj1",
			printer: "printer2"
		}

      	it('Print an object on a printer that does not exist', (done) => {
       		chai.request(server)
            	.post('/prints')
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.send(reqBody)
            	.end((err, res) => {
               		res.should.have.status(400)
               		res.body.message.should.be.eql("Error: The printer with the name 'printer2' does not exist")
              		done()
        	})
  		})
	})

	describe('/GET prints/status_inProgressEmpty', () => {
      	it('Get all objects in the inProgress state when there is none', (done) => {
       		chai.request(server)
            	.get('/prints/status/inProgress')
            	.end((err, res) => {
                	res.should.have.status(200) 
                	should.exist(res.body.objectsByPrinter["printer1"])
                	res.body.objectsByPrinter["printer1"].should.be.a('array')
                	res.body.objectsByPrinter["printer1"].length.should.be.eql(0)

              		done()
        	})
  		})
	})

	describe('/GET prints/status_inProgress', () => {
      	var reqBody = {
			objectName : "obj1",
			printer: "printer1"
		}

      	it('Get all objects in the inProgress state', (done) => {
       		chai.request(server)
            	.post('/prints')
        		.set('content-type', 'application/x-www-form-urlencoded')
        		.send(reqBody)
            	.end((err, res) => {
               		res.should.have.status(200)
        	})

       		chai.request(server)
            	.get('/prints/status/inProgress')
            	.end((err, res) => {
                	res.should.have.status(200) 
                	should.exist(res.body.objectsByPrinter["printer1"])
                	res.body.objectsByPrinter["printer1"].should.be.a('array')
                	res.body.objectsByPrinter["printer1"].length.should.be.eql(1)
                	res.body.objectsByPrinter["printer1"][0].name.should.be.eql("obj1")
              		done()
        	})
  		})
	})

	describe('/GET prints/status_complete', () => {
      	it('Get all objects in the complete state when there is none', (done) => {
       		chai.request(server)
            	.get('/prints/status/complete')
            	.end((err, res) => {
                	res.should.have.status(200) 
                	should.exist(res.body.objectsByPrinter["printer1"])
                	res.body.objectsByPrinter["printer1"].should.be.a('array')
                	res.body.objectsByPrinter["printer1"].length.should.be.eql(0)

              		done()
        	})
  		})
	})
})

	