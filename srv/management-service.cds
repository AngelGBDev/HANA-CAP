using { db.models as models  } from '../db/management';
// using {db.types} from '../../../db/types';

// using { Service } from '@sap/cds';

service ManagementService {
    
    @requires: 'authenticated-user'
    entity LogSet                   as projection on models.LogSet;
    entity PermitDocumentSet        as projection on models.PermitDocumentSet;
    entity ShipperSet               as projection on models.ShipperSet;
    entity TransferRequestSet       as projection on models.TransferRequestSet;
    entity TransferStatus           as projection on models.TransferStatusSet;
    entity TransferTypeSet          as projection on models.TransferTypeSet;
    entity UserSet                  as projection on models.UserSet;
    entity TransferRequestLogSet    as projection on models.TransferRequestLogSet;
    entity RolSet                   as projection on models.RolSet;
    // entity UserRolViewSet           as projection on models.UserRolViewSet;
    entity CamionesSet              as projection on models.CamionesSet;
    entity DistanciaSet             as projection on models.DistanciaSet;
    entity ProveedorSet             as projection on models.ProveedorSet;    
    entity OperadoresSet            as projection on models.OperadoresSet;
    entity PrediosSet               as projection on models.PredioSet;
    
    entity DeliveryHeaderSet        as projection on models.DeliveryHeaderSet;
    entity EquipmentSet             as projection on models.EquipmentSet;
    entity EquipmentInstallSet      as projection on models.EquipmentInstallSet;
    entity EquipmentTypeSet         as projection on models.EquipmentTypeSet;
    entity FunctionalLocationSet    as projection on models.FunctionalLocationSet;
    entity MaintenancePlantSet      as projection on models.MaintenancePlantSet;

    // function getUser() returns types.User;
}