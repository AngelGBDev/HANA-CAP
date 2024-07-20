using { db.models as models  } from '../db/management';
// using {db.types} from '../../../db/types';

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
    entity UserRolViewSet           as projection on models.UserRolViewSet;
    entity CamionesSet              as projection on models.CamionesSet;
    entity DistanciaSet             as projection on models.DistanciaSet;
    entity ProveedorSet             as projection on models.ProveedorSet;    
    entity OperadoresSet            as projection on models.OperadoresSet;
    entity PrediosSet               as projection on models.PredioSet;
    // function getUser() returns types.User;
}