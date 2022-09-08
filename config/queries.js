const queries = {
    tipodoc : {
        desc:'',
        sql: 'SELECT * FROM tipo_documento where (idtipodoc=:idtipodoc or :idtipodoc is null)',
        tags:''
    }
}

module.exports.queries=queries