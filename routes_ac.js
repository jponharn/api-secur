//api access control

module.exports = function(router) {

    const features = require('./services/feature')

    router.get('/getFeatures', features.getFeatures)
    router.get('/getUser', features.getUser)
    router.post('/createUser', features.createUser)
  
    return router;
}