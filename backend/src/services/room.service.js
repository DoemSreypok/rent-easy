import { Room } from '../models/room.model.js';
import { Property } from '../models/property.model.js';

export class RoomService {
  static async getRooms({ propertyId, status, minPrice, maxPrice }) {
    const query = {};
    if (propertyId) query.propertyId = propertyId;
    if (status && status !== 'ALL') query.status = status.toUpperCase();
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const rooms = await Room.find(query).populate('propertyId', 'name title type address city price images');
    return rooms;
  }

  static async getRoomById(id) {
    const room = await Room.findById(id).populate('propertyId');
    if (!room) {
      throw new Error('Room not found.');
    }
    return room;
  }

  static async createRoom(payload) {
    const property = await Property.findById(payload.propertyId);
    if (!property) {
      throw new Error('Associated property not found.');
    }

    const room = new Room(payload);
    await room.save();
    return room;
  }

  static async updateRoom(id, payload) {
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found.');
    }

    Object.assign(room, payload);
    await room.save();
    return room;
  }

  static async deleteRoom(id) {
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      throw new Error('Room not found.');
    }
    return room;
  }

  static async updateStatus(id, status) {
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found.');
    }
    room.status = status.toUpperCase();
    await room.save();
    return room;
  }
}
