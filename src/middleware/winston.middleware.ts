import winston from 'winston'
import expressWinston from 'express-winston'

export const logger = expressWinston.logger({
	transports: [
		new winston.transports.File({
			filename: 'error.log',
			level: 'error',
		}),
		new winston.transports.File({
			filename: 'combined.log',
		}),
		new winston.transports.Console(),
	],
	format: winston.format.combine(winston.format.colorize(), winston.format.json()),
	meta: true,
	msg: 'HTTP {{req.method}} {{req.url}}',
	expressFormat: true,
})
