const baseQuery = require('./queries');
const db = require('./db_oracle')

function getSQLselect(entity) {
    let sqlCab = 'SELECT ';
    let first = true;
    for (const key in entity.fields) {
        if (first) {
            first = false;
        } else {
            sqlCab += ', ';
        }
        sqlCab += entity.fields[key] + ' as ' + key;
    }
    entity.sql["fromClause"].forEach(line => {
        sqlCab += '\n' + line + ' '
    });

    return sqlCab;
}

async function getView(entity, context) {
    //const binds = {};

    let query = getSQLselect(entity);

    let firstWhere = true;

    let queryWhere = entity.sql.whereFields?baseQuery.getWhere(entity.sql.whereFields, context):baseQuery.getWhere(entity, context);

    //let queryWhere = baseQuery.getWhereFields(context, entity.sql.whereFields);

    let sqlGroup = '';

    if (entity.sql["groupClause"]) {
        entity.sql["groupClause"].forEach(line => {
            sqlGroup += '\n' + line + ' '
        });
    }

    let fullQuery = query + queryWhere.where + sqlGroup;

    //Para debug    
    console.log(fullQuery);
    console.log(queryWhere.binds);

    const result = await db.simpleExecute(fullQuery, queryWhere.binds);

    return result;

}

module.exports.getView = getView;