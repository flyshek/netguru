// Generallly I would spit this on controller and router but that's useless in
// this case.
import signale from 'signale'
import { Request, Response, Router } from 'express'
import { Comment } from './comment.model'
import { Movie } from '../movies/movie.model'

const logger = signale.scope('comments')

class CommentController {
	async createOne(req: Request, res: Response) {
		const newComment = new Comment(req.body).populate('Movie')
		const createdComment = await newComment.save()
		res.json({ data: createdComment })
	}

	async getAll(req: Request, res: Response) {
		let comments

		try {
			comments = await Comment.find().populate('Movie')
		} catch (e) {
			res.json(`Error: ${e}`)
		}

		res.json({ data: comments })
	}
}

export class CommentRouter {
	public controller: CommentController = new CommentController()
	public router: Router = Router()

	constructor() {
		this.router
		this.routes()
	}

	private routes() {
		this.router.get('/', this.controller.getAll)
		this.router.post('/', this.controller.createOne)
	}
}
