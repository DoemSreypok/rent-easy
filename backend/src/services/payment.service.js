import { Payment } from '../models/payment.model.js';
import { RentalContract } from '../models/rentalContract.model.js';
import { Notification } from '../models/notification.model.js';

export class PaymentService {
  static async getPayments({ user, status, contractId }) {
    const query = {};
    if (status && status !== 'ALL') query.status = status.toUpperCase();
    if (contractId) query.contractId = contractId;

    if (user.role === 'TENANT') {
      query.tenantId = user._id;
    } else if (user.role === 'LANDLORD') {
      query.landlordId = user._id;
    }

    const payments = await Payment.find(query)
      .populate('tenantId', 'fullName name email phone avatar')
      .populate('landlordId', 'fullName name email phone avatar')
      .populate({
        path: 'contractId',
        populate: { path: 'propertyId', select: 'name title address city' }
      })
      .sort({ paymentDate: -1 });

    return payments;
  }

  static async getPaymentById(id) {
    const payment = await Payment.findById(id)
      .populate('tenantId')
      .populate('landlordId')
      .populate('contractId');

    if (!payment) {
      throw new Error('Payment record not found.');
    }
    return payment;
  }

  static async submitPayment({ contractId, tenantId, amount, paymentMethod, description }) {
    let landlordId = null;
    if (contractId) {
      const contract = await RentalContract.findById(contractId);
      if (contract) {
        landlordId = contract.landlordId;
      }
    }

    const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = new Payment({
      contractId,
      tenantId,
      landlordId,
      amount: Number(amount),
      paymentMethod: (paymentMethod || 'ABA').toUpperCase(),
      description: description || 'Monthly Rent Payment (Mock Digital Settlement)',
      status: 'PENDING',
      receiptNumber
    });

    await payment.save();

    if (landlordId) {
      await Notification.create({
        userId: landlordId,
        title: 'New Payment Received',
        message: `Tenant submitted payment of $${amount} via ${paymentMethod || 'ABA'}. Requires verification.`,
        type: 'PAYMENT_RECEIVED'
      });
    }

    return payment;
  }

  static async confirmPayment(id, user) {
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new Error('Payment not found.');
    }

    if (user.role !== 'ADMIN' && payment.landlordId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to confirm this payment.');
    }

    payment.status = 'PAID';
    if (!payment.receiptNumber) {
      payment.receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    await payment.save();

    await Notification.create({
      userId: payment.tenantId,
      title: 'Payment Confirmed! 💰',
      message: `Your rent payment of $${payment.amount} (Receipt: ${payment.receiptNumber}) has been verified.`,
      type: 'PAYMENT_CONFIRMED'
    });

    return payment;
  }

  static async rejectPayment(id, user) {
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new Error('Payment not found.');
    }

    if (user.role !== 'ADMIN' && payment.landlordId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to reject this payment.');
    }

    payment.status = 'REJECTED';
    await payment.save();

    await Notification.create({
      userId: payment.tenantId,
      title: 'Payment Verification Issue',
      message: `Your payment of $${payment.amount} was rejected. Please check payment details.`,
      type: 'PAYMENT_REJECTED'
    });

    return payment;
  }
}
