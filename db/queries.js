const oracledb = require('oracledb');
const db = require('./db_oracle')

function getSelect(entity, parentEntity) {
  let sqlCab = 'SELECT ';
  let first = true;
  for (const key in entity.fields) {
      if (first) {
          first = false;
      } else {
          sqlCab += ', ';
      }
      if (typeof entity.fields[key] != 'object') {
          sqlCab += entity.fields[key] + ' as ' + key;
      } else {
          sqlCab += '(' + getSQLcomplexSelect(entity.fields[key], entity) + ') as ' + key;
      }
  }
  sqlCab += '\nFROM ' + entity.table;

  if (parentEntity != undefined) {
      sqlCab += `\nwhere ` + entity.table + '.' + entity.foringKey + `= ` + parentEntity.table + '.' + entity.parentKey;
  }

  return sqlCab;
}

function getWhere(entity, context) {
  const binds = {};
  let query = '';

  let firstWhere = true;

  for (const key in context) {
      if (key != 'limit' & key != 'offset' & key != 'sort' & key != 'search' & key != 'greatereq' & key != 'lesseq') {
          //binds[key] = context[key];
          if (firstWhere) {
              if (context[key] == 'null') {
                  query += `\nwhere ` + entity.fields[key] + ` is null `; // entity.fields[key];
              } else {
                  query += `\nwhere ` + entity.fields[key] + `= :` + key; // entity.fields[key];
                  binds[key] = context[key];
              }
              firstWhere = false;
          } else {
              if (context[key] == 'null') {
                  query += `\nand ` + entity.fields[key] + ` is null `; // entity.fields[key];
              } else {
                  query += `\nand ` + entity.fields[key] + `= :` + key; // entity.fields[key];
                  binds[key] = context[key];
              }
          }
      } else {
          if (key != 'sort' & key != 'search' & key != 'greatereq' & key != 'lesseq') {
              binds[key] = context[key];
          }
      }
  }

  if (context.search !== undefined) {
      let [key, text] = context.search.split(':');

      if (firstWhere) {
          query += ` \nwhere lower(${entity.fields[key]}) like '%${text.toLowerCase()}%' `;
      } else {
          query += `\nand lower(${entity.fields[key]}) like '%${text.toLowerCase()}%' `;
      }
  }

  if (context.greatereq !== undefined) {
      let [key, value] = context.greatereq.split(':');

      if (firstWhere) {
          query += ` \nwhere ${entity.fields[key]} >= TO_DATE('${value}','dd/mm/yyyy') `;
      } else {
          query += `\nand ${entity.fields[key]} >= TO_DATE('${value}','dd/mm/yyyy') `;
      }
  }

  if (context.lesseq !== undefined) {
      let [key, value] = context.lesseq.split(':');

      if (firstWhere) {
          query += ` \nwhere ${entity.fields[key]} <= TO_DATE('${value}','dd/mm/yyyy') `;
      } else {
          query += `\nand ${entity.fields[key]} <= TO_DATE('${value}','dd/mm/yyyy') `;
      }
  }

  if (context.sort !== undefined) {
      let jsonSort = JSON.parse(context.sort)
      let orderStr = '';
      let first = true
      for (const key in jsonSort) {
          if (!first) {
              orderStr += ', ';
          } else {
              first = false;
          }
          orderStr += key + ' ' + jsonSort[key];
      }

      query += `\norder by ${orderStr}`;
  }

  return { 'where': query, 'binds': binds };

}

function getSQLinsert(entity, context) {
  let sqlCab = 'INSERT INTO ' + entity.table;
  let strValues = '';
  let first = true;
  let hasSeq = false;

  for (const key in entity.fields) {
      if (typeof entity.fields[key] != 'object' && key in context) {
          // || (entity['sequence'] && key == entity['sequence'].field))) {
          if (first) {
              first = false;
              sqlCab += ' (';
              strValues = ' VALUES ('
          } else {
              sqlCab += ', ';
              strValues += ', ';
          }
          //if (typeof entity.fields[key] != 'object') {
          sqlCab += entity.fields[key];
          //}

          if (entity['key'].field == key) {
              if (entity['key'].seq) {
                  strValues += entity.key.seq;
              } else {
                  strValues += ':' + key;
              }
          } else {
              strValues += ':' + key;
          }
      }
  }

  strValues += ')';
  sqlCab += ') ' + strValues;

  return sqlCab;
}

function getSQLupdate(entity, context) {
  let sqlCab = 'UPDATE ' + entity.table;
  let first = true;

  //console.log(context);

  for (const key in entity.fields) {
      if ((typeof entity.fields[key] != 'object') && (key in context && (key != entity['key'].field))) {
          if (first) {
              first = false;
              sqlCab += ' SET ';
          } else {
              sqlCab += ', ';
          }
          if (typeof entity.fields[key] != 'object') {
              sqlCab += entity.fields[key] + '= :' + key;
          }
      }
  }

  sqlCab += ' WHERE ' + entity.fields[entity['key'].field] + '= :' + entity['key'].field;

  return sqlCab;
}



function getSQLdelete(entity, context) {
  let sqlCab = 'DELETE ' + entity.table;

  sqlCab += ' WHERE ' + entity.fields[entity['key'].field] + '= :' + entity['key'].field;

  return sqlCab;
}


async function find(entity, params) {

  let query = getSelect(entity)

  let queryWhere = getWhere(entity, params)

  let fullQuery = query + queryWhere.where

  //console.log(fullQuery)

  const result = await db.simpleExecute(fullQuery, queryWhere.binds);

  return result;
}

module.exports.find = find;


async function create(entity, context) {
  let query = getSQLinsert(entity, context);
  const binds = {};

  //console.log(query);

  let eseq;

  for (const key in context) {
      if (typeof entity.fields[key] != 'object') {

          eseq = entity['key'].seq?true:false;

          //console.log(eseq)

          if (key != entity['key'].field || (key == entity['key'].field  && entity['key'].insert == true) ){
              binds[key] = context[key];
          }

      }
  }

  //console.log(query);
  //console.log(binds);

  let result = await db.simpleExecute(query, binds);
  let json = { 'result': result, 'status': 200, rows: [] };
  return json;
  //return result;
}

module.exports.create = create;

async function remove(entity, context) {
  let query = getSQLdelete(entity, context);
  const binds = {};

  //console.log(query);
  //console.log(binds);

  if (entity["key"].del) {

      for (const key in context) {
          if (typeof entity.fields[key] != 'object') {
              binds[key] = context[key];
          }
      }

      if (binds[entity["key"].field]) {
          console.log(query);
          let result = await db.simpleExecute(query, binds);
          let json = { 'result': result, 'status': 200, rows: [] };
          return json;
      } else {
          let json = { 'err': 'Key field is not defined', 'status': 400 };
          return json;
      }
  } else {

      let json = { 'err': 'delete is not permited', 'status': 400 };
      return json;

  }

}

module.exports.remove = remove

async function modify(entity, context) {
  let query = getSQLupdate(entity, context);
  const binds = {};

  for (const key in context) {
      if (typeof entity.fields[key] != 'object') {
          binds[key] = context[key];
      }
  }

  if (binds[entity["key"].field]) {
      let result = await db.simpleExecute(query, binds);
      let json = { 'result': result, 'status': 200, rows: [] };
      return json;
  } else {
      let json = { 'err': 'Key field is not defined', 'status': 400 };
      return json;
  }

}

module.exports.modify = modify


async function run() {

    try {
      
      await db.simpleExecute(
        `CREATE OR REPLACE PROCEDURE no_proc
           (p_in IN VARCHAR2, p_inout IN OUT VARCHAR2, p_out OUT NUMBER)
         AS
         BEGIN
           p_inout := p_in || p_inout;
           p_out := 101;
         END;`
      );
  
      // Invoke the PL/SQL stored procedure.
      //
      // The equivalent call with PL/SQL named parameter syntax is:
      // `BEGIN
      //    no_proc(p_in => :i, p_inout => :io, p_out => :o);
      //  END;`
  
  
      const result = await db.simpleExecute(
        `BEGIN
           no_proc(:i, :io, :o);
         END;`,
        {
          i:  'Chris',  // Bind type is determined from the data.  Default direction is BIND_IN
          io: { val: 'Jones', dir: oracledb.BIND_INOUT },
          o:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        }
      );
  
      console.log(result.outBinds);
  
    } catch (err) {
      console.error(err);
    }

}

module.exports.run = run
