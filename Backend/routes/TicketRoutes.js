const express = require('express');
const { addTicket, getTickets } = require('../controllers/TicketController');
const ticket = express.Router();


ticket.post('/addTicket',addTicket);
ticket.get('/allTicket', getTickets);

module.exports = ticket;
