import { RentalContract } from '../models/rentalContract.model.js';
import { Room } from '../models/room.model.js';

export class ContractService {
  static async getContracts({ user, status }) {
    const query = {};
    if (status && status !== 'ALL') query.status = status.toUpperCase();

    if (user.role === 'TENANT') {
      query.tenantId = user._id;
    } else if (user.role === 'LANDLORD') {
      query.landlordId = user._id;
    }

    const contracts = await RentalContract.find(query)
      .populate('tenantId', 'fullName name email phone avatar employment annualIncome creditScore')
      .populate('landlordId', 'fullName name email phone avatar')
      .populate('propertyId', 'name title address city price images')
      .populate('roomId', 'roomNumber floor price')
      .sort({ createdAt: -1 });

    return contracts;
  }

  static async getContractById(id) {
    const contract = await RentalContract.findById(id)
      .populate('tenantId')
      .populate('landlordId')
      .populate('propertyId')
      .populate('roomId');

    if (!contract) {
      throw new Error('Rental contract not found.');
    }
    return contract;
  }

  static async createContract(payload, user) {
    const contractNumber = `CTR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const contract = new RentalContract({
      ...payload,
      contractNumber,
      landlordId: user.role === 'LANDLORD' ? user._id : payload.landlordId,
      status: payload.status || 'ACTIVE'
    });

    await contract.save();

    if (contract.roomId) {
      await Room.findByIdAndUpdate(contract.roomId, { status: 'RENTED' });
    }

    return contract;
  }

  static async terminateContract(id, user) {
    const contract = await RentalContract.findById(id);
    if (!contract) {
      throw new Error('Contract not found.');
    }

    if (user.role !== 'ADMIN' && contract.landlordId.toString() !== user._id.toString()) {
      throw new Error('Unauthorized to terminate this contract.');
    }

    contract.status = 'TERMINATED';
    await contract.save();

    if (contract.roomId) {
      await Room.findByIdAndUpdate(contract.roomId, { status: 'AVAILABLE' });
    }

    return contract;
  }

  static async updateContractStatus(id, status) {
    const contract = await RentalContract.findById(id);
    if (!contract) {
      throw new Error('Contract not found.');
    }

    contract.status = status.toUpperCase();
    await contract.save();

    if (status === 'TERMINATED' || status === 'EXPIRED') {
      if (contract.roomId) {
        await Room.findByIdAndUpdate(contract.roomId, { status: 'AVAILABLE' });
      }
    }

    return contract;
  }
}
