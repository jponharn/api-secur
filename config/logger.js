//user logger 
const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require('fs')

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


const transport = new transports.DailyRotateFile({
    filename: `${logDir}/user-%DATE%.log`,
    datePattern: 'YYYY-MM'
});

const logger = createLogger({
    // change level if in dev environment versus production
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp}, ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${ info.timestamp }, ${ info.message }`
                )
            )
        }),
        transport
    ]
});

module.exports = function() {
    return logger;
}