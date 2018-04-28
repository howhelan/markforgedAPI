# Markforged API Test

## API documentation

The documentation for this API is located in the /api/doc directory.

## Running the server

- To run the server locally, ensure that npm and node are installed.  Then, from the root directory of the project, run 'npm start' on the command line.
- To run tests, from the root directory run 'npm test'.

## Design decisions:

- Overview:
  - This API was implemented with the assumption that the object storage and the printer storage is separate.  Objects are stored in a central database, and the entire object object is retrieved and sent to a printer to add it to the printer storage so that it can be printed.  This assumption was made for optimizing the the use of this API with a print farm.  Since an object may never be printed using a certain printer, it does not make sense to upload every object to all printers.

- Object schema:
  - A printable object uses the name as the unique ID.  As a result, the ID field is necessary and unimplemented. 

- Storage: 
  - I chose to not use any persistent storage for this project, as the project is focused on designing and implementing an API as opposed to using any specific data storage technologies.  All storage takes place on memory.  JS Objects are used as maps, and objects are stored using the name as the key.  The MemoryStorage module is intended to be easily swapped out for a different data storage option.  I would suggest forking MemoryStorage.js and reimplementing the methods to implement this API with a different storage solution.

- Printers:
  - I chose to make this API compatible with use with multiple printers in a "print farm".  The API supports this feature by taking a printer parameter for the POST request on the /prints endpoint, which specifies the name or ID of the printer to be used.  Additionally, retrieving objects by the status returns a collection of objects with the given status for each printer, as opposed to one single collection of objects.

- Printing objects:
  - The printers themselves are unimplemented in this project.  As a result, once an object is added to the printing queue for a printer, it will never leave the queue or get moved to the complete state.  The response to requesting prints with status "complete" will always return empty collections mapped to the printer name until the printers are implemented.

## Future work:
- Document the API with response parameters, as opposed to just request parameters.

- Implement the printers (as simulations or integrate with real 3D printers).

- Separate test: Some of the printerController tests depend on the objectController working successfully.  Ideally, this dependency should be removed.

- Implement printerType and meterialType for printing objects.  Objects should be checked to make sure they are being printed on a compatible printer before printing.

- Implement automatic printer selection.  When a /prints POST request does not have a printer, it would be best for the printer farm to automatically select a printer with the smallest print queue.

- Implement better queued prints response.  The queues for each printer should be ordered, or have an order parameter.
