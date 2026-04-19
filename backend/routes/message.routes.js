const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// POST /api/messages - Public: Submit contact form
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newMessage = await Message.create({
            name,
            email,
            message
        });
        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully!',
            data: newMessage
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/messages - Admin only: Get all messages
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/messages/:id - Admin only: Get single message
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/messages/:id/status - Admin only: Update message status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    const { status } = req.body;
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        
        message.status = status;
        await message.save();
        res.json({ success: true, message: 'Status updated', data: message });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/messages/:id/reply - Admin only: Reply to message
router.put('/:id/reply', protect, adminOnly, async (req, res) => {
    const { reply } = req.body;
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        
        message.reply = reply;
        message.status = 'replied';
        message.repliedBy = req.user._id;
        message.repliedAt = new Date();
        await message.save();
        
        res.json({ 
            success: true, 
            message: 'Reply sent successfully!',
            data: message 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/messages/:id - Admin only: Delete message
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        
        await message.deleteOne();
        res.json({ success: true, message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;