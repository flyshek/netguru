export interface omdbMovie {
	Title: string
	Year: string
	Type: string
	Poster: string
	imdbID: string
}

export interface omdbResponse {
	Search: omdbMovie[]
	totalResults: string
	Response: string
	Error?: string
}
