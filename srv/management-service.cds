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
    
    // function getUser() returns types.User;
}