import winston from 'winston'
import expressWinston from 'express-winston'
import path from 'path'

export const logger = expressWinston.logger({
	transports: [
		new winston.transports.File({
			filename: 'error.log',
			level: 'error',
			dirname: 'logs',
		}),
		new winston.transports.File({
			filename: 'combined.log',
			dirname: 'logs',
		}),
		new winston.transports.Console(),
	],
	format: winston.format.combine(winston.format.colorize(), winston.format.json()),
	meta: true,
	msg: 'HTTP {{req.method}} {{req.url}}',
	expressFormat: true,
})
