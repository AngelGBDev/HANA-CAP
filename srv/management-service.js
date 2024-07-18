const cds = require('@sap/cds');
const {v4: uuidv4} = require('uuid');
const { executeHttpRequest } = require('@sap-cloud-sdk/core')

class ManagementService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    const { TransferRequestSet, TransferRequestLogSet, PrediosSet, UserSet } = this.entities;

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
    });
    
    this.before("READ", PrediosSet, async (req) => {        
        
        let { token } = await this.getToken();
        let data = await this.getPredios();

    });

    this.on("READ", UserSet, async (req) => {        
        // TODO
        // const users = await executeHttpRequest({ destinationName: 'ias' },
        // { method: 'get', url: '/scim/Users', params: {} })
        // console.log("iasUsers", users.data)

    });

    return super.init();
  }

  async getToken(){
    const sUrl = `https://araucaria-qas.arauco.com/portal/sharing/rest/generateToken`;
    const params = {
        username: 'iquant',
        password: 'iquant2024',
        referer: 'http://www.arcgis.com',
        f: 'json'
    };

    const formBody = new URLSearchParams(params);

    try {
        const response = await fetch(sUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
  }

  async getPredios(token){
    const sUrl = `https://araucaria-qas.arauco.com/server/rest/services/Integraciones/CanchasBTP/MapServer/0/query`;
    const params = {
        token,
        outfields: '*',
        returngeometry: false,
        where: 'idzona>0',
        f: 'json'
    };
    // const params = {
    //     token,
    //     outfields: 'idpredio,predio',
    //     returngeometry: false,
    //     where: 'objectid!=0',
    //     orderByFields: 'idpredio,predio',
    //     returnDistinctValues: true,
    //     f: 'json'
    // };

    const queryString = new URLSearchParams(params);
    // .toString();
    // const requestUrl = `${sUrl}?${queryString}`;

    try {
        const response = await fetch(sUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: queryString
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Query Result:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        console.error('Error:', error);
        console.error('Error:', error);
        console.error('Error:', error);
        console.error('Error:', error);
        console.error('Error:', error);
        return null;
    }
  }
  
}

module.exports = { ManagementService };
