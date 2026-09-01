import { Notification } from '../models/notification.model.js';

export class NotificationService {
  static async getNotifications(userId) {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    return { notifications, unreadCount };
  }

  static async markAsRead(id, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );
    return notification;
  }

  static async markAllAsRead(userId) {
    await Notification.updateMany({ userId }, { isRead: true });
    return { message: 'All notifications marked as read.' };
  }
}
