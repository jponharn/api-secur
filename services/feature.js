let acc_con = require('../data/access-control.json')

exports.getA = (req, res) => {
    res.send("A")
}

exports.getB = (req, res) => {
    res.send("B")
}

exports.getC = (req, res) => {
    res.send("C")
}

exports.getD = (req, res) => {
    res.send("D")
}

exports.getFeatures = (req, res) => {
    let headers = req.headers
    acc = acc_con[headers.role]
    res.send(Object.keys(acc))
}