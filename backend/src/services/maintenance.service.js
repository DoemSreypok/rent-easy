import { MaintenanceRequest } from '../models/maintenanceRequest.model.js';
import { Property } from '../models/property.model.js';
import { Notification } from '../models/notification.model.js';

export class MaintenanceService {
  static async getRequests({ user, status, urgency }) {
    const query = {};
    if (status && status !== 'ALL') query.status = status.toUpperCase();
    if (urgency && urgency !== 'ALL') query.urgency = urgency.toUpperCase();

    if (user.role === 'TENANT') {
      query.tenantId = user._id;
    } else if (user.role === 'LANDLORD') {
      query.landlordId = user._id;
    }

    const requests = await MaintenanceRequest.find(query)
      .populate('tenantId', 'fullName name email phone avatar')
      .populate('landlordId', 'fullName name email phone avatar')
      .populate('propertyId', 'name title address city')
      .populate('roomId', 'roomNumber floor')
      .sort({ createdAt: -1 });

    return requests;
  }

  static async getRequestById(id) {
    const request = await MaintenanceRequest.findById(id)
      .populate('tenantId')
      .populate('landlordId')
      .populate('propertyId')
      .populate('roomId');

    if (!request) {
      throw new Error('Maintenance request not found.');
    }
    return request;
  }

  static async createRequest({ tenantId, propertyId, roomId, title, description, imageUrl, urgency }) {
    let landlordId = null;
    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (property) landlordId = property.landlordId;
    }

    const request = new MaintenanceRequest({
      tenantId,
      landlordId,
      propertyId,
      roomId,
      title,
      description,
      imageUrl,
      urgency: (urgency || 'MEDIUM').toUpperCase(),
      status: 'PENDING',
      technician: 'Assigned: HVAC / Facilities Team'
    });

    await request.save();

    if (landlordId) {
      await Notification.create({
        userId: landlordId,
        title: 'New Maintenance Request',
        message: `Maintenance requested: "${title}". Urgency: ${urgency || 'MEDIUM'}.`,
        type: 'MAINTENANCE_CREATED'
      });
    }

    return request;
  }

  static async updateStatus(id, { status, technician, landlordResponse }, user) {
    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      throw new Error('Maintenance request not found.');
    }

    if (user.role !== 'ADMIN' && request.landlordId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to update this request.');
    }

    if (status) request.status = status.toUpperCase();
    if (technician) request.technician = technician;
    if (landlordResponse) request.landlordResponse = landlordResponse;

    await request.save();

    await Notification.create({
      userId: request.tenantId,
      title: 'Maintenance Update 🛠️',
      message: `Your maintenance ticket "${request.title}" is now: ${request.status}. ${landlordResponse || ''}`,
      type: 'MAINTENANCE_UPDATED'
    });

    return request;
  }
}
