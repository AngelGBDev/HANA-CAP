// using {db.types} from '../../../db/types';
using {managed, sap.common.CodeList} from '@sap/cds/common';

namespace db.models;

entity LogSet: managed {
    key id              : UUID;
        description     : String;        
        status          : Association to models.TransferStatusSet;
        transferRequest : Association to models.TransferRequestSet;
}

entity PermitDocumentSet : managed {
    key id              : UUID;
        idSap           : String;
        description     : String;

        @Core.MediaType  : mediaType
        content         : LargeBinary;

        @Core.IsMediaType: true
        mediaType       : String;
        base64Content   : LargeString;
        transferRequest : Association to models.TransferRequestSet;
}

entity ShipperSet : managed {
    key id                  : UUID;
        idSap               : String;
        supplierId          : String;
        supplierDescription : String;
        description         : String;
        driverId            : String;
        driverDescription   : String;
        bedPatent           : String;
        truckPatent         : String;
        transferRequest     : Association to one models.TransferRequestSet;
}

entity TransferRequestSet : managed {
    key id                                       : String(30);
        idSap                                    : String;
        date                                     : String;
        time                                     : String;
        type                                     : Association to models.TransferTypeSet;
        typeSap                                  : String;
        equipmentId                              : String;
        equipmentSerie                           : String;
        equipmentDescription                     : String;
        equipmentVendor                          : String;
        equipmentType                            : String;
        originZone                               : String;
        originZoneDescription                    : String;
        originFunctionalLocation                 : String;
        originFunctionalLocationDescription      : String;
        originBuilding                           : String;
        originBuildingDescription                : String;
        originId                                 : String;
        destinationZone                          : String;
        destinationZoneDescription               : String;
        destinationFunctionalLocation            : String;
        destinationFunctionalLocationDescription : String;
        destinationBuilding                      : String;
        destinationBuildingDescription           : String;
        destinationId                            : String;
        requesterUserId                          : String;
        requesterUserDescription                 : String;
        statusReason                             : String;
        shipper                                  : Association to models.ShipperSet
                                                       on shipper.transferRequest = $self;
        status_id                                : String enum {
            NEW              = 'NEW';
            PENDING_ACCEPT   = 'PENDING_ACCEPT';
            PENDING_APPROVAL = 'PENDING_APPROVAL';
            VALIDATION       = 'VALIDATION';
            TRANSFER         = 'TRANSFER';
            COMPLETED        = 'COMPLETED';
            REJECTED         = 'REJECTED';
        };
        permitDocuments                          : Association to many models.PermitDocumentSet
                                                       on permitDocuments.transferRequest = $self;
        logs                                     : Association to many models.LogSet
                                                       on logs.transferRequest = $self;
}

entity TransferStatusSet {
    key id          : String(50);
        idSap       : String;
        description : String;
}

entity TransferTypeSet {
    key id          : String(20) enum {
            EQUIPMENT = 'EQUIPMENT';
            BACKREST  = 'BACKREST';
        };
        idSap       : String;
        description : String;
}

entity UserSet: managed {
    key id            : UUID;
        name          : String;
        email         : String;
        rol           : String;
        roles         : Association to RolSet on rol = $self.rol;
}

entity TransferRequestLogSet: managed {
    key id                  : UUID;
        // idTransferRequest   : String;
        // idStatus            : String;
        status              : Association to models.TransferStatusSet;
        transferRequest     : Association to models.TransferRequestSet;
}

entity PredioSet: managed {    
    key id                  : UUID;
};

entity RolSet {
    key rol         : String;
        description : String;
}

view UserRolViewSet as
    select from models.UserSet as User
    join models.RolSet as Rol
    on User.rol = Rol.rol {
        User.name,
        User.email,
        Rol.rol,
        User.createdAt
    };
