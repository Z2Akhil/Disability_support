const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await contact.save();

    // Send confirmation email
    await emailService.sendContactConfirmation(email, name);

    // Notify admin
    await emailService.notifyAdminNewContact(contact);

    logger.info(`New contact form submitted by ${email}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      throw new ApiError(404, 'Contact submission not found');
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!contact) {
      throw new ApiError(404, 'Contact submission not found');
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};

exports.addNote = async (req, res, next) => {
  try {
    const note = {
      content: req.body.content,
      createdBy: req.user._id
    };

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: note } },
      { new: true }
    );

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};

exports.addResponse = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new ApiError(404, 'Contact submission not found');
    }

    const response = {
      content: req.body.content,
      respondedBy: req.user._id,
      respondedAt: new Date()
    };

    contact.response = response;
    contact.status = 'resolved';
    await contact.save();

    // Send response to user
    await emailService.sendContactResponse(contact.email, contact.name, response.content);

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};