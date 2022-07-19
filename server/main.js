const http = require('http');
const express = require('express');
const router = express.Router();

const q = require('../db/queries')

const entities = require('../config/entities')

const PORT = 3000;

let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();

        httpServer = http.createServer(app);

        router.use('/time',function (req, res, next) {
            console.log('Time:', Date.now());
            next();
          });

        router.use('/get/:entity', async function (req, res, next) {
            try {
                let result;        
                                              
                console.log(req.params.entity)
                console.log(req.query)
        
                if (entities.jsonEntity[req.params.entity]) {
                    result = await q.find(entities.jsonEntity[req.params.entity], req.query);

                    console.log( entities.jsonEntity[req.params.entity], req.query)
               
                    if (result.rows.length > 0) {
                        res.status(200).json(result.rows)
                    } else {
                        res.status(404).end()
                    } 
                }           
        
            } catch (err) {
                next(err);
            }

           //q.run()            
           next();
        });

        router.use('/post/:entity', async function (req, res, next) {
            try {
                let result;        
                                              
                console.log(req.params.entity)
                console.log(req.query)
        
                if (entities.jsonEntity[req.params.entity]) {
                    result = await q.create(entities.jsonEntity[req.params.entity], req.query);

                    console.log( entities.jsonEntity[req.params.entity], req.query)
               
                    if (result.rows.length > 0) {
                        res.status(200).json(result.rows)
                    } else {
                        res.status(404).end()
                    } 
                }           
        
            } catch (err) {
                next(err);
            }

           //q.run()            
           next();
        });

        router.use('/put/:entity', async function (req, res, next) {
            try {
                let result;        
                                              
                console.log(req.params.entity)
                console.log(req.query)
        
                if (entities.jsonEntity[req.params.entity]) {
                    result = await q.modify(entities.jsonEntity[req.params.entity], req.query);

                    console.log( entities.jsonEntity[req.params.entity], req.query)
               
                    if (result.rows.length > 0) {
                        res.status(200).json(result.rows)
                    } else {
                        res.status(404).end()
                    }
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