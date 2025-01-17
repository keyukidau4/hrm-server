import Express from 'express'
import userRoutes from './userRoutes'
import ReportRoutes from './reportRoutes'

const router = Express.Router()

router.use('/users', userRoutes)
router.use('/reports', ReportRoutes)

export default router