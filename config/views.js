const views = {
    tipodoc: {
        fields: {
            idTipoDoc: 'IDTIPODOC',
            descripcion: 'DESCRIPCION',
            sintetico: 'SINTETICO'
        },
        key: { field: "idTipoDoc" },
        sql: {
            fromClause: [
                "FROM tipo_documento"                
            ]
        }
    }
}

exports.views = views