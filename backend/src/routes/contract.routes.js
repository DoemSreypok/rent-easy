import express from 'express';
import { ContractController } from '../controllers/contract.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', ContractController.getContracts);
router.get('/:id', ContractController.getContractById);

router.post('/', authorizeRoles('LANDLORD', 'ADMIN'), ContractController.createContract);
router.put('/:id', authorizeRoles('LANDLORD', 'ADMIN'), ContractController.updateContract);
router.put('/:id/terminate', authorizeRoles('LANDLORD', 'ADMIN'), ContractController.terminateContract);

export default router;
