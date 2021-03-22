module.exports = function(router) {

    const hello = require('./services/hello')


    router.get('/hello', hello.hello)
    return router;
}