import express from 'express'
import { list, read, readById, searchfilters } from '../controllers/game'
import { authCheck, adminCheck } from '../middlewares/authMiddleware';
const Router = express.Router()




Router.get('/games', authCheck,read);
Router.get('/games/top',authCheck, list);     
Router.post('/search/filters',authCheck,  searchfilters); 

       
Router.get('/games/:id', readById);  




export default Router

