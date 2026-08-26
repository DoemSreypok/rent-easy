import express from 'express';
import {
  getFullFlowchart,
  getMermaidDiagram,
  getNodeById
} from '../controllers/flowchart.controller.js';

const router = express.Router();

router.get('/', getFullFlowchart);
router.get('/mermaid', getMermaidDiagram);
router.get('/nodes/:id', getNodeById);

export default router;
