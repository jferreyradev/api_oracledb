const oracledb = require('oracledb');
const oraPool = require('../config/db').oraPool;

const defaultThreadPoolSize = 4;

process.env.UV_THREADPOOL_SIZE = oraPool.poolMax + defaultThreadPoolSize;

function setDriver() {

    if (process.platform === 'win32') { // Windows
        oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' });
    } else if (process.platform === 'linux') { // linux
        oracledb.initOracleClient({ libDir: process.env.HOME + '/bin/instantclient_21_3' });
    }
    
}

async function initialize() {
    setDriver();    
    await oracledb.createPool(oraPool);
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close();
}

module.exports.close = close;

function getQueryLimits(query) {
    return `SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM ( ${query} ) A
             WHERE ROWNUM <= :limit + :offset) WHERE MY_RNUM > :offset`;
}

function simpleExecute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
        let conn;
        let query;
        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true;
        try {
            conn = await oracledb.getConnection();
            if (binds.limit !== undefined) {
                if (binds.offset == undefined) {
                    binds.offset = 0;
                }
                query = getQueryLimits(statement);
            } else {
                query = statement;
            }
            const startTime = new Date(); //console.log("Inicio de la ejecución");
            const result = await conn.execute(query, binds, opts);
            console.log(query, binds, (new Date() - startTime)/1000);
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (conn) {
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    })
}

module.exports.simpleExecute = simpleExecute;

async function checkConn() {
    let conn = null
    try {
        setDriver();
        conn = await oracledb.getConnection(oraPool);
        console.log('connected to database');
    } catch (err) {
        console.error(err.message);
    } finally {
        if (conn) {
            try {
                // Always close connections
                await conn.close();
                console.log('close connection success');
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}

module.exports.checkConn = checkConn;

async function getConn() {
    let conn = null
    try {
        conn = await oracledb.getConnection(oraPool);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.getConn = getConn;
