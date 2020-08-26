// I have no idea about relation to movies, that was not in spec but let's say
// that I've interpreted that as I should create comment and it should be
// related to specific movie, there was spec about POST request without
// specified ID so I interpret this as movideID should be provided in body :)

import mongoose from 'mongoose'

export interface IComment extends mongoose.Document {
	movie: string
	comment: string
}

const commentSchema = new mongoose.Schema({
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movie',
	},
	comment: String,
})

export const Comment = mongoose.model<IComment>('Comment', commentSchema)
