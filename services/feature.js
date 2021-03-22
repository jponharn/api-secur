let acc_con = require('../data/access-control.json')

exports.getFeatures = (req, res) => {
    let headers = req.headers
    acc = acc_con[headers.role]
    res.send(Object.keys(acc))
}