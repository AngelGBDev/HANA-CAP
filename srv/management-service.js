const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const convert = require('xml-js');
const https  = require('https');
const { json } = require('express');
// const querystring  = require('querystring');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { resilience } = require('@sap-cloud-sdk/resilience');

class ManagementService extends cds.ApplicationService {
    /** Registering custom event handlers */
    async init() {
        const { 
            TransferRequestSet, TransferRequestLogSet, PrediosSet, CamionesSet, DistanciaSet, ProveedorSet, OperadoresSet,
            EquipmentSet, EquipmentInstallSet, EquipmentTypeSet, FunctionalLocationSet, MaintenancePlantSet
         } = this.entities;
        const api = await cds.connect.to('ZPM_FOR_TRASLADO_SRV');   

        this.after("CREATE", TransferRequestSet, async (data) => {

            if (data && data.id) {
                await cds.connect.to('db');

                let oEntry = {
                    id: uuidv4(),
                    status_id: data.status_id,
                    transferRequest_id: data.id
                };

                let saved = await cds.run(
                    INSERT.into(TransferRequestLogSet).entries(oEntry)
                );

                const { results: [{ affectedRows }] } = saved;

                return { created: affectedRows === 1, result: oEntry };

            }
        });

        this.on("READ", PrediosSet, async (req) => {

            let { token } = await this.getToken();
            
            let aResult = await this.getPredios(token);
            
            return aResult;
        });
        
        this.on("READ", CamionesSet, async (req) => {
            
            let aResult = this.getCamiones();        
            
            return aResult;
        });
        
        this.on("READ", DistanciaSet, async (req) => {
            
            let aResult = this.getDistancias();        
            
            return aResult;
        });

        this.on("READ", ProveedorSet, async (req) => {
            
            let aResult = this.getProveedor();        
            
            return aResult;
        });
        
        this.on("READ", OperadoresSet, async (req) => {
            
            let aResult = this.getOperadores();        
            
            return aResult;
        });
        
        this.on("READ", EquipmentSet, async (req) => {                                             
            const result = await api.get('/EquipmentSet');

            return result;
        });
        
        this.on("READ", EquipmentInstallSet, async (req) => {
            
            const headers = { "X-Requested-With": "X" };
            const result = await api.send('GET', '/EquipmentInstallSet', headers);
            console.log("result", JSON.stringify(result));

            return result;
        });
                
        this.on("READ", EquipmentTypeSet, async (req) => {
                                             
            const headers = { "X-Requested-With": "X" };
            const result = await api.send('GET', '/EquipmentTypeSet', headers);

            return result;
        });

        this.on("READ", FunctionalLocationSet, async (req) => {
                                             
            const headers = { "X-Requested-With": "X" };
            const result = await api.send('GET', '/FunctionalLocationSet', headers);

            return result;
        });

        this.on("READ", MaintenancePlantSet, async (req) => {
                                             
            const headers = { "X-Requested-With": "X" };
            const result = await api.send('GET', '/MaintenancePlantSet', headers);

            return result;
        });
        
        return super.init();
    }

    async getToken() {
        const sUrl = cds.env.requires.ARCGIS_TOKEN_SERV.credentials.url;
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

    async getPredios(token) {
        const oParams = {
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
        // };"target": "/sap/opu/odata/sap/ZPM_FOR_TRASLADO_SRV/$1",
        const sQueryString = new URLSearchParams(oParams).toString();

        try {
            const response = await axios.get(`${cds.env.requires.ARCGIS_SERV.credentials.url}?${sQueryString}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            let aResult = response.data.features.map((oItem)=>{
                return {
                    idzona: oItem.attributes.IDZONA,
                    zona: oItem.attributes.ZONA,
                    idpredio: oItem.attributes.IDPREDIO,
                    predio: oItem.attributes.PREDIO,
                    idcancha: oItem.attributes.IDCANCHA,
                    cancha: oItem.attributes.CANCHA,
                    objectid: oItem.attributes.OBJECTID,                    
                }
            });

            return aResult;
        } catch (error) {
            console.error('Error making SOAP request:', error);
            return [];
        }        
    }    

    async getCamiones() {

        const headers = {
            "Content-Type": "application/xml"
        };

        let xmlBody = this.xmlBodyMII();

        try {
            const response = await axios.post(`${cds.env.requires.MII_SERV.credentials.url}/TRX_OBTENER_INFO_CAMIONES`, xmlBody, {
                headers: {
                    'Content-Type': 'application/xml'
                }
            });

            let aResult = await this.convertXmlToJson(response.data);
            
            aResult = aResult.map((oItem) => {
                return {
                    division: oItem["DIVISION"]["_text"],
                    empresario: oItem["EMPRESARIO"]["_text"],
                    dsc_proveedor: oItem["DSC_PROVEEDOR"]["_text"],
                    proceso: oItem["PROCESO"]["_text"],
                    turno: oItem["TURNO"]["_text"],
                    tipo_camion: oItem["TIPO_CAMION"]["_text"],
                    tipo_carro: oItem["TIPO_CARRO"]["_text"],
                    tipo_empresa: oItem["TIPO_EMPRESA"]["_text"],
                    patente: oItem["PATENTE"]["_text"],
                    division_origen: oItem["DIVISION_ORIGEN"]["_text"],
                    equipo_sigla: oItem["EQUIPO_SIGLA"]["_text"]
                }
            });
            
            return aResult;
        } catch (error) {
            console.error('Error making SOAP request:', error);
            return [];
        }

    }

    async getDistancias() {

        const headers = {
            "Content-Type": "application/xml"
        };

        let xmlBody = this.xmlBodyMII();

        try {
            const response = await axios.post(`${cds.env.requires.MII_SERV.credentials.url}/TRX_OBTENER_INFO_DISTANCIAS`, xmlBody, {
                headers: {
                    'Content-Type': 'application/xml'
                }
            });

            let aResult = await this.convertXmlToJson(response.data);

            aResult = aResult.map((oItem) => {
                return {
                    id_distancia: oItem["ID_DISTANCIA"]["_text"],
                    division: oItem["DIVISION"]["_text"],
                    cod_almacen_origen: oItem["COD_ALMACEN_ORIGEN"]["_text"],
                    cod_almacen_destino: oItem["COD_ALMACEN_DESTINO"]["_text"],
                    identificador_ruta: oItem["IDENTIFICADOR_RUTA"]["_text"],
                    descripcion_ruta: oItem["DESCRIPCION_RUTA"]["_text"],
                }
            });
            
            return aResult;
        } catch (error) {
            console.error('Error making SOAP request:', error);
            return [];
        }

    }

    async getProveedor() {

        const headers = {
            "Content-Type": "application/xml"
        };

        let xmlBody = this.xmlBodyMII();

        try {
            const response = await axios.post(`${cds.env.requires.MII_SERV.credentials.url}/TRX_OBTENER_INFO_PROVEEDORES`, xmlBody, {
                headers: {
                    'Content-Type': 'application/xml'
                }
            });

            let aResult = await this.convertXmlToJson(response.data);

            
            aResult = aResult.map((oItem) => {
                return {
                    id_proveedor: oItem["ID_PROVEEDOR"]["_text"],
                    cod_proveedor_sap: oItem["COD_PROVEEDOR_SAP"]["_text"],
                    rut: oItem["RUT"]["_text"],
                    dsc_proveedor: oItem["DSC_PROVEEDOR"]["_text"]
                }
            });
            
            return aResult;
        } catch (error) {
            console.error('Error making SOAP request:', error);
            return [];
        }

    }

    async getOperadores() {        

        let xmlBody = this.xmlBodyMII();

        try {
            const response = await axios.post(`${cds.env.requires.MII_SERV.credentials.url}/TRX_OBTENER_INFO_OPERADORES`, xmlBody, {
                headers: {
                    'Content-Type': 'application/xml'
                }
            });

            let aResult = await this.convertXmlToJson(response.data);

            aResult = aResult.map((oItem) => {
                return {
                    division: oItem["DIVISION"]["_text"],
                    cod_operador_ftk: oItem["COD_OPERADOR_FTK"]["_text"],
                    rut: oItem["RUT"]["_text"],
                    nombre: oItem["NOMBRE"]["_text"],
                    cod_sap_empresario: oItem["COD_SAP_EMPRESARIO"]["_text"],
                    proceso: oItem["PROCESO"]["_text"],                    
                }
            });
            
            return aResult;
        } catch (error) {
            console.error('Error making SOAP request:', error);
            return [];
        }

    }

    convertXmlToJson(xml) {        
        return new Promise((resolve, reject) => {            
            try{
                let jsonResult = convert.xml2json(xml, {
                    compact: true,
                    spaces: 1
                });
                
                jsonResult = JSON.parse(jsonResult); 
                resolve(jsonResult["soap:Envelope"]["soap:Body"].XacuteResponse.Rowset.Row);            
            }catch (e){
                resolve([]);
            }            
        });
    }

    xmlBodyMII(){
        let xmlBody =
            `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xmii="http://www.sap.com/xMII">
                <soapenv:Header/>
                <soapenv:Body>
                    <xmii:XacuteRequest>
                        <xmii:LoginName>MANT_WS</xmii:LoginName>
                        <xmii:LoginPassword>aR4*CP2_024</xmii:LoginPassword>
                        <xmii:InputParams/>
                    </xmii:XacuteRequest>
                </soapenv:Body>
            </soapenv:Envelope>`;
        
        return xmlBody;
    }

}

module.exports = { ManagementService };
