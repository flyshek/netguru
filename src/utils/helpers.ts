import { NODE_ENV } from './env'

// Development ENV Management Scripts
export const isDevelopmentCheck = () => {
	if (NODE_ENV === 'development') return true
	return false
}

export const isProductionCheck = () => {
	if (NODE_ENV === 'production') return true
	return false
}
