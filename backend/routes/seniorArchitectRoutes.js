import express from 'express';
import { askSeniorArchitect } from '../controllers/seniorArchitectController.js';

const router = express.Router();

router.post('/explain', askSeniorArchitect);

export default router;
