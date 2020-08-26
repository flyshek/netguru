import signale from 'signale'
import { Request, Response, Router } from 'express'
import { Comment } from './comment.model'
import { Movie } from '../movies/movie.model'

const logger = signale.scope('comments')

class CommentController {
	/**
	 * Create new comment in database with is related to Movie model.
	 */
	async createOne(request: Request, reply: Response) {
		const newComment = new Comment(request.body)
		const createdComment = await newComment.save()

		await Movie.findOneAndUpdate(
			{ _id: request.body.movie },
			{
				$push: {
					comments: createdComment._id,
				},
			},
			{
				useFindAndModify: true,
			}
		)

		reply.json({ data: createdComment })
	}

	/** Get all comments available in database. */
	async getAll(request: Request, reply: Response) {
		let comments

		try {
			comments = await Comment.find()
		} catch (error) {
			reply.json(`Error: ${error}`)
		}

		reply.json({ data: comments })
	}
}

export class CommentRouter {
	public controller: CommentController = new CommentController()
	/* eslint-disable-next-line new-cap */
	public router: Router = Router()

	/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
	constructor() {
		this.router
		this.routes()
	}

	private routes() {
		this.router.get('/', this.controller.getAll)
		this.router.post('/', this.controller.createOne)
	}
}
