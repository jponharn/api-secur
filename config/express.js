let express = require('express')
let setting = require('./setting.json')
let acc_con = require('../data/access-control.json')
let logger = require('./logger')()
const cors = require('cors')
var bodyParser = require('body-parser')
const oxd = require('oxd-node')(setting.oxd_setting);

let getTokenByRefreshToken = (oxd_id, refresh_token, scope) => {
    return new Promise((resolve, reject) => {

        oxd.get_access_token_by_refresh_token({
            oxd_id: oxd_id,
            refresh_token: refresh_token,
            scope: scope
        }, (err, response) => {
            if (err) {
                console.log('getAccessTokenByRTK Error : ', err);
                resolve({ "error": err })
            }

            resolve(response)
        });
    })
}

const isAccess = (req, res, next) => {
    let headers = req.headers
    acc = acc_con[headers.role]
    if(headers.role){
        acc = acc_con[headers.role]
        if(acc){
            if(Object.keys(acc).includes(req.originalUrl)){
                logger.info(`${new Date().getTime()}, ${headers.user_name}, ${req.originalUrl}`)
                next()
            }
            else return res.send({"status": "error", "data": "access denied"})
        }
        else return res.send({"status": "error", "data": "invalid role!"})
    }
    else return res.send({"status": "error", "data": "empty role!"})
}

const isAuthorized = (req, res, next) => {
    let headers = req.headers
    if(headers.oxd_id && headers.access_token){
        oxd.introspect_access_token({
            oxd_id: headers.oxd_id,
            access_token: headers.access_token
          }, (err, response) => {
            if(err){
                getTokenByRefreshToken(headers.oxd_id, headers.refresh_token, headers.scope).then(newToken => {
                    if(newToken.data.access_token){
                        next()
                    }
                    else return res.send({"status": "error", "data": "invalid access_token"})
                })
            }
            else{
                if(response.data.active){
                    next()
                } 
                else{
                    getTokenByRefreshToken(headers.oxd_id, headers.refresh_token, headers.scope).then(newToken => {
                        if(newToken.data.access_token){
                            next()
                        }
                        else return res.send({"status": "error", "data": "invalid access_token"})
                    })
                }
            }
          });
        
    }
    else return res.send({"status": "error", "data": "access denied"})
}

module.exports = function() {
    var app = express()

    // const app = require("https-localhost")()
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    app.use(cors())

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
   
    let r_auth = require('../routes')(express.Router());
    let r_auth_acc = require('../routes_ac')(express.Router());

    app.use(`${setting.prefix_path}`, isAuthorized, r_auth);
    app.use(`${setting.prefix_path}`, isAuthorized, isAccess, r_auth_acc);
    app.use(function(req, res, next) {
        res.status(404);
        res.type('txt').send('Not found');
    });


    return app;
}