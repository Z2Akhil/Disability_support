require('dotenv').config();
const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin SDK
const serviceAccount = require('../config/firebaseServiceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class NotificationService {
  static async sendNotification(userId, title, body, data = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.fcmToken) {
        throw new Error('User not found or no FCM token');
      }

      const message = {
        notification: {
          title,
          body
        },
        data,
        token: user.fcmToken
      };

      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  static async sendToTopic(topic, title, body, data = {}) {
    try {
      const message = {
        notification: {
          title,
          body
        },
        data,
        topic
      };

      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.error('Error sending topic notification:', error);
      throw new Error('Failed to send topic notification');
    }
  }

  static async subscribeToTopic(token, topic) {
    try {
      const response = await admin.messaging().subscribeToTopic(token, topic);
      return response;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw new Error('Failed to subscribe to topic');
    }
  }

  static async unsubscribeFromTopic(token, topic) {
    try {
      const response = await admin.messaging().unsubscribeFromTopic(token, topic);
      return response;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      throw new Error('Failed to unsubscribe from topic');
    }
  }

  static async sendEmergencyAlert(userId, location) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const emergencyContacts = user.emergencyContacts || [];
    const promises = emergencyContacts.map(contact => {
      return this.sendNotification(
        contact.userId,
        'Emergency Alert',
        `${user.name} has triggered an emergency alert`,
        {
          type: 'emergency',
          userId: user._id.toString(),
          location: JSON.stringify(location),
          timestamp: new Date().toISOString()
        }
      );
    });

    await Promise.all(promises);
    return { message: 'Emergency alerts sent' };
  }
}

module.exports = NotificationService;