const ticketModel = require('../models/Ticket');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Public
exports.addTicket = async (req, res) => {
  try {
    const { name, email, contact, query } = req.body;
    
    // Validate required fields
    if (!name || !email || !contact || !query) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email, contact, and query' 
      });
    }

    // Create the ticket using the model
    const { id, ticketId } = await ticketModel.addTicket({
      name,
      email,
      contact,
      query
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticketId,
      id
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    
    // Handle duplicate ticket_id (very rare due to UUID)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Error generating unique ticket ID. Please try again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private/Admin

exports.getTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getTicket();
    
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tickets found',
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:ticketId
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await ticketModel.getTicketById(ticketId);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:ticketId/status
// @access  Private/Admin
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['open', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: open, in_progress, resolved'
      });
    }
    
    const updated = await ticketModel.updateTicketStatus(ticketId, status);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      ticketId,
      status
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};