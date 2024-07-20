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
        description : String;
}

entity TransferTypeSet {
    key id          : String(20);
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

entity RolSet {
    key rol         : String;
        description : String;
}

// Entidades puentes de MII
entity CamionesSet {
    division        : String;
    empresario      : String;
    dsc_proveedor   : String;
    proceso         : String;
    turno           : String;
    tipo_camion     : String;
    tipo_carro      : String;
    tipo_empresa    : String;
    patente         : String;
    division_origen : String;
    equipo_sigla    : String;
}

entity DistanciaSet {    
    key id_distancia    : String;
    division            : String;
    cod_almacen_origen  : String;
    cod_almacen_destino : String;
    identificador_ruta  : String;
    descripcion_ruta    : String;
}

entity ProveedorSet {
    key id_proveedor    : String;
    cod_proveedor_sap   : String;
    rut                 : String;
    dsc_proveedor       : String;
}

entity OperadoresSet {    
    division            : String;
    cod_operador_ftk    : String;
    rut                 : String;
    nombre              : String;
    cod_sap_empresario  : String;
    proceso             : String;
}

// Entidades puentes de ARCGIS
entity PredioSet: managed {
    objectid    : String; 
    idzona      : String;
    zona        : String;
    idpredio    : String;
    predio      : String;
    idcancha    : String;
    cancha      : String;
};

view UserRolViewSet as
    select from models.UserSet as User
    join models.RolSet as Rol
    on User.rol = Rol.rol {
        User.name,
        User.email,
        Rol.rol,
        User.createdAt
    };
