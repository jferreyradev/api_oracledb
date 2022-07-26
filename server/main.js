const http = require('http');
const express = require('express');
const router = express.Router();

const q = require('../db/queries')

const entities = require('../config/entities');
const bodyParser = require('body-parser');

const PORT = 3000;

let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();

        httpServer = http.createServer(app);

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json())

        router.use('/time',function (req, res, next) {
            console.log('Time:', Date.now());
            next();
          });


        async function getResult(entityName ,cb, context) {

            if (entities.jsonEntity[entityName]) {
                let result = await cb(entities.jsonEntity[entityName], context);
                return result                
            } 
            return null
        }

        router.get('/:entity', async function (req, res, next) {
            try {
                let result = await getResult(req.params.entity, q.find, req.query)

                if (result && result.rows.length > 0) {
                    res.status(200).json(result.rows)
                } else {
                    res.status(404).end()
                }
                
            } catch (err) {
                next(err);
            }

           next();
        });

        router.post('/:entity', async function (req, res, next) {
            try {
                let result = await getResult(req.params.entity, q.create, req.body)

                if (result && result.rows.length > 0) {
                    res.status(200).json(result.rows)
                } else {
                    res.status(404).end()
                }

            } catch (err) {
                next(err);
            }

           next();
        });

        router.put('/:entity', async function (req, res, next) {
            try {
                let result = await getResult(req.params.entity, q.modify, req.body)

                if (result && result.rows.length > 0) {
                    res.status(200).json(result.rows)
                } else {
                    res.status(404).end()
                }

            } catch (err) {
                next(err);
            }
         
           next();
        });

        router.delete('/:entity', async function (req, res, next) {
            try {
                let result = await getResult(req.params.entity, q.remove, req.body)

                if (result && result.rows.length > 0) {
                    res.status(200).json(result.rows)
                } else {
                    res.status(404).end()
                }  
        
            } catch (err) {
                next(err);
            }

           //q.run()            
           next();
        });


        app.use('/api', router);

        app.get('/', (req, res) => {
            res.end('Servidor activo');
        });

        httpServer.listen(PORT, err => {
            if (err) {
                reject(err);
                return;
            }
            console.log(`Web server listening on localhost:${PORT}`);
            resolve();
        });
    });
}

module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.close = close;