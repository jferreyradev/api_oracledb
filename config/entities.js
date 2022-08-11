module.exports.jsonEntity = {
    tipodocum: {
        table: 'tipo_documento',
        fields: {
            idTipoDoc: 'IDTIPODOC',
            descripcion: 'DESCRIPCION',
            sintetico: 'SINTETICO'
        },
        key: { field: "idTipoDoc" }
    },
    tipoSecretaria: {
        table: 'tipo_secretaria',
        fields: {
            idTipoSec: 'IDTIPOSEC',
            descripcion: 'DESCRIPCION',
            sintetico: 'SINTETICO'
        },
        key: { field: "idTipoSec", insert: true, del: true }
    }
}