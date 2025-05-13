import express from 'express';
import { createFlahCard } from '../controller/flashController.js';
import { Token } from '../../middleware/checkAuth.js';
import { upload } from '../../middleware/image.js';
import { authorized } from '../../middleware/role.js';



const flashRouter = express.Router()



flashRouter.post(
  '/create-flash-card', 
  Token,
  authorized("Teacher"),
  upload.fields([
    { name: 'flashImage', maxCount: 1 },
    { name: 'container', maxCount: 20 }, 
  ]),
  createFlahCard
);


export default flashRouter