//api access control

module.exports = function(router) {

    const features = require('./services/feature')

    router.get('/getFeatures', features.getFeatures)

    
    return router;
}