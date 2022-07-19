module.exports.jsonEntity = {
    hoja: {
        table: 'hoja_nov',
        fields: {
            FechaCreacion: 'FECHAALTA',
            TipoCargaId: 'IDTIPOCARGA',
            TipoHojaDescripcion: {
                table: 'tabtipohoja',
                parentKey: 'IDTIPOHOJA',
                foringKey: 'IDTIPOHOJA',
                fields: {
                    Descripcion: 'DESCRIPCION'
                }
            },
            EstadoHojaId: 'IDESTADOHOJA',
            GrupoAdicional: 'IDGRUPOADI',
            TipoLiquidacionId: 'IDTIPOLIQ',
            TipoLiquidacionDescripcion: {
                table: 'tipoliquidacion',
                parentKey: 'IDTIPOLIQ',
                foringKey: 'IDTIPOLIQ',
                fields: {
                    Descripcion: 'DESCRIPCION'
                }
            },
            PeriodoId: 'PERIODO',
            TipoHojaId: 'IDTIPOHOJA',
            Id: 'IDHOJANOV'
        },
        key: { field: "Id", seq: 'HOJA_NOV_SEQ.NEXTVAL' }
    },
    tipoliq: {
        table: 'usuario.tabtipoliquidacion',
        fields: {
            Id: 'IDTIPOLIQUIDACION',
            Descripcion: 'DESCRIPCION'
        },
        key: { field: "Id", insert: true }
    },
    tipoos: {
        table: 'TABTIPOOS',
        fields: {
            Id: 'IDTIPOOS',
            Descripcion: 'DESCRIPCION'
        },
        key: { field: "Id" }
    },
    sitrevista: {
        table: 'tabsitrevista',
        fields: {
            Id: 'IDSITREV',
            Descripcion: 'DESCRIPCION',
            TipoRevistaId: 'IDTIPOREVISTA',
            Porcentaje: 'PORCENTAJE',
            TipoRevistaDescripcion: {
                table: 'tabtiporevista',
                parentKey: 'IDTIPOREVISTA',
                foringKey: 'IDTIPOREVISTA',
                fields: {
                    Descripcion: 'DESCRIPCION'
                }
            }
        },
        key: { field: 'Id', insert: true }
    },
    tiporevista: {
        table: "tabtiporevista",
        fields: {
            Id: "IDTIPOREVISTA",
            Descripcion: "DESCRIPCION"
        },
        key: {
            field: "Id",
            insert: true
        }
    },
    tipoEmpleo: {
        table: 'tabtipoempleo',
        fields: {
            Id: 'IDTE',
            Descripcion: 'DESCRIPCION'
        },
        key: { field: 'Id', insert: true }
    },
    novhaberes: {
        table: 'NOVHABERES',
        fields: {
            NroReparticion: 'IDREP',
            ReparticionDescripcion: {
                table: 'reparticion',
                parentKey: 'IDREP',
                foringKey: 'IDREP',
                fields: {
                    Descripcion: 'DESCRIPCION'
                }
            },
            NroBoleta: 'ORDEN',
            NroAfiliado: 'AFILIADO',
            Codigo: 'CODIGO',
            Subcodigo: 'SUBCOD',
            Clase: 'PARM1',
            Dias: 'PARM2',
            Vencimiento: 'VTO',
            Importe: 'IMPORTE',
            Documento: 'DNI',
            Apellido: 'APELLIDO',
            Nombre: 'NOMBRE',
            TipoEmpleoId: 'TE',
            TipoEmpleoDescripcion: {
                table: 'tabtipoempleo',
                parentKey: 'TE',
                foringKey: 'IDTE',
                fields: {
                    Descripcion: 'DESCRIPCION'
                }
            },
            SituacionRevistaId: 'SITREV',
            SituacionRevistaDescripcion: {
                table: 'tabsitrevista',
                parentKey: 'SITREV',
                foringKey: 'IDSITREV',
                fields: {
                    Descripcion: 'DESCRIPCION'
                }
            },
            TipoObraSocialId: 'OS',
            PPP: 'PPP',
            FechaGrabacion: 'FECHAGRAB',
            EstadoRegistro: 'IDESTADOREG',
            HojaId: 'IDHOJANOV',
            Id: 'IDNOVHAB'
        },
        key: { field: "Id", seq: 'NOVHABERES_SEQ.NEXTVAL' }
    }
}