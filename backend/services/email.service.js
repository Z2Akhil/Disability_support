const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

class EmailService {
  static async sendEmail({ to, subject, html, text }) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error); // shows actual cause
      throw error; // re-throws the original error, more helpful
    }    
  }

  static async sendWelcomeEmail(user) {
    const subject = 'Welcome to Disability Support Platform';
    const html = `
      <h1>Welcome ${user.name}!</h1>
      <p>Thank you for joining our platform. We're here to support you.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
    `;

    if (!user.email) {
      console.error('❌ user.email is undefined!');
      throw new Error('User email is missing');
    }
    
    await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  static async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const subject = 'Verify Your Email';
    const html = `
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }
}

module.exports = EmailService;