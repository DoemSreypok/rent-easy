import { PaymentService } from '../services/payment.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export class PaymentController {
  static async getPayments(req, res) {
    try {
      const payments = await PaymentService.getPayments({
        user: req.user,
        status: req.query.status,
        contractId: req.query.contractId
      });
      return sendSuccess(res, 'Payments retrieved successfully.', payments);
    } catch (error) {
      return sendError(res, error.message, [error.message], 500);
    }
  }

  static async getPaymentById(req, res) {
    try {
      const payment = await PaymentService.getPaymentById(req.params.id);
      return sendSuccess(res, 'Payment details retrieved.', { payment });
    } catch (error) {
      return sendError(res, error.message, [error.message], 404);
    }
  }

  static async submitPayment(req, res) {
    try {
      const { contractId, amount, paymentMethod, description } = req.body;
      if (!amount) {
        return sendError(res, 'Payment amount is required.', [], 400);
      }

      const payment = await PaymentService.submitPayment({
        contractId,
        tenantId: req.user._id,
        amount,
        paymentMethod,
        description
      });

      return sendSuccess(res, 'Payment submitted successfully.', { payment }, 201);
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async confirmPayment(req, res) {
    try {
      const payment = await PaymentService.confirmPayment(req.params.id, req.user);
      return sendSuccess(res, 'Payment confirmed successfully.', { payment });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }

  static async rejectPayment(req, res) {
    try {
      const payment = await PaymentService.rejectPayment(req.params.id, req.user);
      return sendSuccess(res, 'Payment has been rejected.', { payment });
    } catch (error) {
      return sendError(res, error.message, [error.message], 400);
    }
  }
}
