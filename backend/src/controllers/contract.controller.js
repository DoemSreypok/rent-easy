import { ContractService } from '../services/contract.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class ContractController {
  static async getContracts(req, res) {
    try {
      const contracts = await ContractService.getContracts({ user: req.user, status: req.query.status });
      return sendSuccess(res, 'Contracts retrieved successfully.', contracts);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getContractById(req, res) {
    try {
      const contract = await ContractService.getContractById(req.params.id);
      return sendSuccess(res, 'Contract retrieved successfully.', { contract });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async createContract(req, res) {
    try {
      const contract = await ContractService.createContract(req.body, req.user);
      return sendSuccess(res, 'Contract created successfully.', { contract }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async updateContract(req, res) {
    try {
      const contract = await ContractService.updateContractStatus(req.params.id, req.body.status);
      return sendSuccess(res, 'Contract updated successfully.', { contract });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async terminateContract(req, res) {
    try {
      const contract = await ContractService.terminateContract(req.params.id, req.user);
      return sendSuccess(res, 'Contract terminated successfully.', { contract });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
