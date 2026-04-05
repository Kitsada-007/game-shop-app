import express from 'express'
import { authCheck, adminCheck } from '../middlewares/authMiddleware'
import { upload } from '../middlewares/uploadMidleware'
import { createGame, createPromo, deleteGame, deletePromo, editGame, editPromo, read, users } from '../controllers/admin'
import { uploadGameImages } from '../controllers/upload'
import { transactionsById } from '../controllers/user'
const Router = express.Router()


// all user
Router.get('/admin/users', authCheck, adminCheck,users)
Router.get('/admin/transactions/:id',authCheck, adminCheck, transactionsById)
// admin manager game
Router.post('/admin/games', authCheck, adminCheck, createGame)
Router.post(
  "/admin/upload-multiple/:game_id",
  authCheck,
  adminCheck,
  upload.array('images', 10), 
  uploadGameImages
);
Router.put('/admin/games/:id', authCheck, adminCheck, editGame)
Router.delete('/admin/games/:id', authCheck, adminCheck, deleteGame)


// admin manager promo
Router.get('/promo', read)
Router.post('/admin/promo', authCheck, adminCheck, createPromo)
Router.put('/admin/promo/:id', authCheck, adminCheck, editPromo)
Router.delete('/admin/promo/:id', authCheck, adminCheck, deletePromo)



export default Router


