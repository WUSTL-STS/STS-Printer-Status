const winston = require('winston')

const logger = winston.createLogger({
    transports:[
        new winston.transports.File({
            filename: 'logs/server.log',
            level: 'warn',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        }),
	new winston.transports.Console({
		level: 'info',
		format: winston.format.combine(
			winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
			winston.format.align(),
			winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
		    )

	})]
})

if (process.env.DEPLOY !== 'docker') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

module.exports = logger
