import express from 'express'

import { editUser, library, libraryById, read, transactions, transactionsById, wallet } from '../controllers/user'

import { authCheck } from '../middlewares/authMiddleware'
import { upload } from '../middlewares/uploadMidleware'
import { uploadProfile } from '../controllers/upload'

const Router = express.Router()





Router.post('/user/upload', authCheck,upload.single('profile'), uploadProfile)
Router.post('/user/wallet/topup',authCheck, wallet)
Router.get('/user/transactions',authCheck,  transactions)




Router.get('/user',authCheck,  read)
Router.put('/user', authCheck, editUser) 
Router.get('/user/library', authCheck, library)
Router.get('/user/library/:game_id', authCheck, libraryById) 


export default Router