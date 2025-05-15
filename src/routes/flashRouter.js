import express from 'express';
import { createFlashCard } from '../controller/flashController.js';
import { Token } from '../../middleware/checkAuth.js';
import { upload } from '../../middleware/image.js';
import { authorized } from '../../middleware/role.js';



const flashRouter = express.Router()



flashRouter.post(
  '/create-flash-card', 
  Token,
  authorized("Teacher"),
  upload.fields([
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
])
,
  createFlashCard
);


export default flashRouter