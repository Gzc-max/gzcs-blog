import express from 'express'
import {
  getCategories,
  getQuestionsByCategory,
  createQuestion,
  updateQuestion
} from '../controllers/interviewController'

const router = express.Router()

router.get('/categories', getCategories)
router.get('/questions/:categoryId', getQuestionsByCategory)
router.post('/questions', createQuestion)
router.put('/questions/:id', updateQuestion)

export default router
