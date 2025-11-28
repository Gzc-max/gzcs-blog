import express from 'express'
import cors from 'cors'
import interviewRoutes from './routes/interview'

const app = express()

app.use(cors())
app.use(express.json())

// API 路由
app.use('/api/interview', interviewRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
