const fs = require("fs")

let acc_con = require('../data/access-control.json')
let user = require('../data/user.json')

exports.getFeatures = (req, res) => {
    let headers = req.headers
    acc = acc_con[headers.role]
    res.send({"status": "ok", "data": Object.keys(acc)})
}

exports.getUser = (req, res) => {
    res.send({"status": "ok", "data": user.data})
}

exports.createUser = (req, res) => {
    user.data.push(JSON.parse(req.headers.body))
    fs.writeFileSync("./data/user.json", JSON.stringify(user));
    console.log(user)
    res.send({"status": "ok", "data": "Add new user succeed."})
}