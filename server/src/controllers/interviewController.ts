import { Request, Response } from 'express'
import pool from '../config/db'

export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY order_num'
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getQuestionsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params
    const [rows] = await pool.query(
      'SELECT * FROM questions WHERE category_id = ?',
      [categoryId]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { categoryId, title, answer, difficulty } = req.body
    const [result] = await pool.query(
      'INSERT INTO questions (id, category_id, title, answer, difficulty) VALUES (UUID(), ?, ?, ?, ?)',
      [categoryId, title, answer, difficulty]
    )
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, answer, difficulty } = req.body
    await pool.query(
      'UPDATE questions SET title = ?, answer = ?, difficulty = ? WHERE id = ?',
      [title, answer, difficulty, id]
    )
    res.json({ message: 'Question updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
