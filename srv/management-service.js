// Import the cds facade object (https://cap.cloud.sap/docs/node.js/cds-facade)
const cds = require('@sap/cds');
const { log } = require('console');
const {v4: uuidv4} = require('uuid');

// The service implementation with all service handlers
module.exports = cds.service.impl(async function() {

    // Define constants for the Risk and BusinessPartner entities from the risk-service.cds file
    const { TransferRequestSet, TransferRequestLogSet } = this.entities;

    // this.before("CREATE", TransferRequestSet, async (req) => {        
    //     if (req.data ) {
    //         req.data.id = randomUUID;
    //     }
    // })

    this.after("CREATE", TransferRequestSet, async (data) => {        
        
        if (data && data.id) {
            await cds.connect.to('db');

            let oEntry = {
                id                  : uuidv4(),
                status_id           : data.status_id,
                transferRequest_id  : data.id
            };
            
            let saved = await cds.run(
                INSERT.into(TransferRequestLogSet).entries(oEntry)
            );

            const { results: [{ affectedRows }] } = saved;

            return {created: affectedRows === 1, result: oEntry};

        }
    })

});


/*
const cds = require('@sap/cds');

class ManagementService extends cds.ApplicationService {
    async init() {
        const { TransferRequestSet } = this.entities;

        if (!TransferRequestSet) {
            console.error("Entity TransferRequestSet not found");
            return super.init();
        }

        console.log("Registering CREATE handler for TransferRequestSet");

        this.on(['CREATE'], TransferRequestSet, this.saveLog);

        console.log("Initialization complete");

        return super.init();
    }

    async saveLog(req) {
        try {
            console.log("CREATE event received with data:", req.data);

            // Implement your logic to handle the creation event
            // For example, save log data to a database or perform other actions

            console.log("CREATE event handled successfully");

            return req.data;  // Respond with the request data or some result
        } catch (error) {
            console.error("Error handling CREATE event:", error);
            req.error(500, `Internal Server Error: ${error.message}`);
        }
    }
}

module.exports = ManagementService;

*/