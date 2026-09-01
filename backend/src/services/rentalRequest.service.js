import { RentalRequest } from '../models/rentalRequest.model.js';
import { Property } from '../models/property.model.js';
import { Room } from '../models/room.model.js';
import { RentalContract } from '../models/rentalContract.model.js';
import { Notification } from '../models/notification.model.js';

export class RentalRequestService {
  static async getRequests({ user, status }) {
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    if (user.role === 'TENANT') {
      query.tenantId = user._id;
    } else if (user.role === 'LANDLORD') {
      query.landlordId = user._id;
    }

    const requests = await RentalRequest.find(query)
      .populate('tenantId', 'fullName name email phone avatar employment annualIncome creditScore')
      .populate('landlordId', 'fullName name email phone avatar')
      .populate('propertyId', 'name title address city price images')
      .populate('roomId', 'roomNumber floor price deposit size status')
      .sort({ createdAt: -1 });

    return requests;
  }

  static async getRequestById(id) {
    const request = await RentalRequest.findById(id)
      .populate('tenantId')
      .populate('landlordId')
      .populate('propertyId')
      .populate('roomId');

    if (!request) {
      throw new Error('Rental request not found.');
    }
    return request;
  }

  static async createRequest({ tenantId, propertyId, roomId, message }) {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found.');
    }

    let room = null;
    if (roomId) {
      room = await Room.findById(roomId);
    } else {
      room = await Room.findOne({ propertyId });
    }

    const rentalRequest = new RentalRequest({
      tenantId,
      landlordId: property.landlordId,
      propertyId,
      roomId: room ? room._id : undefined,
      message: message || 'Hello, I am interested in renting this unit.'
    });

    await rentalRequest.save();

    // Create notification for landlord
    await Notification.create({
      userId: property.landlordId,
      title: 'New Rental Application',
      message: `A new rental request was submitted for ${property.name || property.title}.`,
      type: 'RENTAL_REQUEST'
    });

    return rentalRequest;
  }

  static async acceptRequest(id, user) {
    const request = await RentalRequest.findById(id).populate('propertyId').populate('roomId');
    if (!request) {
      throw new Error('Rental request not found.');
    }

    if (user.role !== 'ADMIN' && request.landlordId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to accept this request.');
    }

    request.status = 'ACCEPTED';
    await request.save();

    // Mark room as RESERVED or RENTED
    if (request.roomId) {
      await Room.findByIdAndUpdate(request.roomId._id, { status: 'RENTED' });
    }

    // Auto-create initial active Rental Contract
    const contractNumber = `CTR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const rentPrice = request.roomId?.price || request.propertyId?.price || 1500;
    const depositPrice = request.roomId?.deposit || request.propertyId?.deposit || rentPrice;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const contract = new RentalContract({
      contractNumber,
      landlordId: request.landlordId,
      tenantId: request.tenantId,
      propertyId: request.propertyId._id,
      roomId: request.roomId ? request.roomId._id : undefined,
      startDate,
      endDate,
      monthlyRent: rentPrice,
      deposit: depositPrice,
      paymentDueDay: 1,
      status: 'ACTIVE'
    });
    await contract.save();

    // Send notification to tenant
    await Notification.create({
      userId: request.tenantId,
      title: 'Rental Application Approved! 🎉',
      message: `Your application for ${request.propertyId.name || request.propertyId.title} was approved. Contract ${contractNumber} is now active.`,
      type: 'CONTRACT_ACTIVE'
    });

    return { request, contract };
  }

  static async rejectRequest(id, user) {
    const request = await RentalRequest.findById(id).populate('propertyId');
    if (!request) {
      throw new Error('Rental request not found.');
    }

    if (user.role !== 'ADMIN' && request.landlordId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to reject this request.');
    }

    request.status = 'REJECTED';
    await request.save();

    await Notification.create({
      userId: request.tenantId,
      title: 'Rental Application Status Update',
      message: `Your application for ${request.propertyId.name || request.propertyId.title} was declined.`,
      type: 'REQUEST_REJECTED'
    });

    return request;
  }

  static async cancelRequest(id, user) {
    const request = await RentalRequest.findById(id);
    if (!request) {
      throw new Error('Rental request not found.');
    }

    if (user.role !== 'ADMIN' && request.tenantId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to cancel this request.');
    }

    request.status = 'CANCELLED';
    await request.save();
    return request;
  }
}
