import express from 'express'
import { createStory, getStories } from '../controller/StoryController.js'

const storyRouter = express.Router()

storyRouter.get('/stories/:id', getStories)
storyRouter.post('/stories/:id', createStory)

export default storyRouter