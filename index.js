let setting = require('./config/setting.json')
const express = require('./config/express');
const app = express();


app.listen(setting.gateway_port);
console.log("Run API            [OK]")
console.info(`API is running at port:${setting.gateway_port}`);
