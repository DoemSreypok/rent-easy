import mongoose from 'mongoose';
import { Property } from '../models/property.model.js';
import { Room } from '../models/room.model.js';
import { SEED_PROPERTIES } from '../scripts/seed.js';

export class PropertyService {
  static async getProperties({ search, type, city, district, minPrice, maxPrice, status, sort, order = 'desc', page = 1, limit = 20, landlordId }) {
    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { title: regex },
        { description: regex },
        { address: regex },
        { city: regex },
        { district: regex }
      ];
    }

    if (type && type !== 'All' && type !== 'ALL') {
      query.type = type.toUpperCase();
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (district) {
      query.district = new RegExp(district, 'i');
    }

    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }

    if (landlordId) {
      query.landlordId = landlordId;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort order
    let sortObj = { featured: -1, createdAt: -1 };
    if (sort === 'price') {
      sortObj = { price: order === 'asc' ? 1 : -1 };
    } else if (sort === 'rating') {
      sortObj = { rating: order === 'asc' ? 1 : -1 };
    } else if (sort === 'date' || sort === 'newest') {
      sortObj = { createdAt: order === 'asc' ? 1 : -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    if (mongoose.connection.readyState === 1) {
      try {
        const total = await Property.countDocuments(query);
        const properties = await Property.find(query)
          .populate('landlordId', 'fullName name email phone avatar employment')
          .sort(sortObj)
          .skip(skip)
          .limit(Number(limit));

        if (properties.length > 0 || Object.keys(query).length > 0) {
          const mappedProps = properties.map(doc => {
            const obj = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };
            const fallbackImg = (obj.images && obj.images[0]) || obj.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
            return {
              ...obj,
              image: obj.image || fallbackImg,
              images: (obj.images && obj.images.length > 0) ? obj.images : [fallbackImg],
              location: obj.location || `${obj.address || ''}, ${obj.city || 'Phnom Penh'}, Cambodia`.replace(/^,\s*/, '')
            };
          });

          return {
            properties: mappedProps,
            pagination: {
              total,
              page: Number(page),
              limit: Number(limit),
              pages: Math.ceil(total / Number(limit))
            }
          };
        }
      } catch (err) {
        console.warn('Property query fallback:', err.message);
      }
    }

    // Fallback in-memory filter
    let list = [...SEED_PROPERTIES];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => (p.title || p.name || '').toLowerCase().includes(s) || (p.location || p.city || '').toLowerCase().includes(s));
    }
    if (type && type !== 'All' && type !== 'ALL') {
      list = list.filter(p => (p.type || '').toUpperCase() === type.toUpperCase());
    }
    if (maxPrice) {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    return {
      properties: list,
      pagination: {
        total: list.length,
        page: 1,
        limit: list.length,
        pages: 1
      }
    };
  }

  static async getPropertyById(id) {
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const property = await Property.findById(id).populate('landlordId', 'fullName name email phone avatar');
      if (property) {
        const rooms = await Room.find({ propertyId: property._id });
        const obj = property.toObject ? property.toObject({ virtuals: true }) : { ...property };
        const fallbackImg = (obj.images && obj.images[0]) || obj.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
        const mappedProperty = {
          ...obj,
          image: obj.image || fallbackImg,
          images: (obj.images && obj.images.length > 0) ? obj.images : [fallbackImg],
          location: obj.location || `${obj.address || ''}, ${obj.city || 'Phnom Penh'}, Cambodia`.replace(/^,\s*/, '')
        };
        return { property: mappedProperty, rooms };
      }
    }

    // Fallback search in seeds
    const match = SEED_PROPERTIES.find(p => (p._id && p._id.toString() === id) || p.title === id || p.name === id);
    if (match) {
      return { property: match, rooms: [] };
    }

    throw new Error('Property not found.');
  }

  static async createProperty(payload, landlordId) {
    let resolvedLandlordId = landlordId || payload.landlordId;
    if (!resolvedLandlordId || !mongoose.isValidObjectId(resolvedLandlordId)) {
      const landlordUser = await mongoose.model('User').findOne({ role: 'LANDLORD' });
      if (landlordUser) {
        resolvedLandlordId = landlordUser._id;
      }
    }

    const propData = {
      ...payload,
      landlordId: resolvedLandlordId,
      name: payload.name || payload.title || 'Modern Rental Property',
      title: payload.title || payload.name || 'Modern Rental Property',
      address: payload.address || payload.location || 'Phnom Penh, Cambodia',
      location: payload.location || payload.address || 'Phnom Penh, Cambodia',
      city: payload.city || 'Phnom Penh',
      type: (payload.type || 'APARTMENT').toUpperCase(),
      status: (payload.status === 'Available' || !payload.status) ? 'APPROVED' : payload.status.toUpperCase(),
      image: payload.image || (payload.images && payload.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      images: (payload.images && payload.images.length > 0) ? payload.images : [payload.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80']
    };

    const property = new Property(propData);
    await property.save();

    // Auto-create a default room if specified
    if (payload.price) {
      const defaultRoom = new Room({
        propertyId: property._id,
        roomNumber: 'Unit #101',
        floor: 1,
        price: payload.price,
        deposit: payload.deposit || payload.price,
        size: payload.sqft || 50,
        status: 'AVAILABLE'
      });
      await defaultRoom.save();
    }

    return property;
  }

  static async updateProperty(id, payload, user) {
    const property = await Property.findById(id);
    if (!property) {
      throw new Error('Property not found.');
    }

    // Permission check
    if (user.role !== 'ADMIN' && property.landlordId.toString() !== user._id.toString()) {
      throw new Error('You do not have permission to update this property.');
    }

    Object.assign(property, payload);
    if (payload.name) property.title = payload.name;
    if (payload.title) property.name = payload.title;
    if (payload.type) property.type = payload.type.toUpperCase();

    await property.save();
    return property;
  }

  static async deleteProperty(id, user) {
    const property = await Property.findById(id);
    if (!property) {
      throw new Error('Property not found.');
    }

    if (user.role !== 'ADMIN' && property.landlordId.toString() !== user._id.toString()) {
      throw new Error('You do not have permission to delete this property.');
    }

    await Property.findByIdAndDelete(id);
    await Room.deleteMany({ propertyId: id });
    return property;
  }

  static async updateStatus(id, status) {
    const property = await Property.findById(id);
    if (!property) {
      throw new Error('Property not found.');
    }
    property.status = status.toUpperCase();
    await property.save();
    return property;
  }
}
