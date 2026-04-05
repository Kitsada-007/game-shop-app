import express from 'express'
import { createOrder } from '../controllers/order'
import { authCheck } from '../middlewares/authMiddleware'
const Router = express.Router()


Router.post('/order',authCheck, createOrder) 



export default Router