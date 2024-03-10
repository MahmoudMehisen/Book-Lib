
const borrowerService = require('../services/borrower.service');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const DuplicateEmailError = require('../errors/duplicate_email.error');
const NotFoundError = require('../errors/not_found.error');

const addBorrower = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, name } = req.body;
    try {
        const borrower = await borrowerService.findByEmail(email);
        if (borrower) {
            logger.error('Failed to add borrower: duplicated email');
            return res.status(400).json({ message: 'Failed to add borrower: duplicated email' });
        }

        const newBorrower = await borrowerService.addBorrower(email, name);
        logger.info('Borrower added successfully:', newBorrower);
        res.status(201).json(newBorrower);
    } catch (error) {
        if (error instanceof DuplicateEmailError) {
            logger.error('Failed to add borrower: Email is already in use');
            return res.status(error.statusCode).json({ message: 'Failed to add borrower: Email is already in use' });
        }

        logger.error('Failed to add borrower:', error);
        res.status(500).json({ message: 'Failed to add borrower', error: error.message });
    }
};

const updateBorrower = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { email, name } = req.body;

    try {
        const borrower = await borrowerService.updateBorrower(id, email, name);
        logger.info('Borrower updated successfully:', borrower);
        res.json(borrower);
    } catch (error) {
        if (error instanceof DuplicateEmailError) {
            logger.error('Failed to update borrower: Email is already in use');
            return res.status(error.statusCode).json({ message: 'Failed to update borrower: Email is already in use' });
        }
        if (error instanceof NotFoundError) {
            logger.error('Failed to update borrower: Borrower not found');
            return res.status(error.statusCode).json({ message: 'Failed to update borrower: Borrower not found' });
        }

        logger.error('Failed to update borrower:', error);
        res.status(500).json({ message: 'Failed to update borrower', error: error.message });
    }
};
const deleteBorrower = async (req, res) => {
    const { id } = req.params;
    try {
        await borrowerService.deleteBorrower(id);
        logger.info('Borrower deleted successfully');
        res.sendStatus(204);
    } catch (error) {
        if (error instanceof NotFoundError) {
            logger.error('Failed to delete borrower: Borrower not found');
            return res.status(error.statusCode).json({ message: 'Failed to delete borrower: Borrower not found' });
        }
        logger.error('Failed to delete borrower:', error);
        res.status(500).json({ message: 'Failed to delete borrower', error: error.message });
    }
};

const getAllBorrowers = async (req, res) => {
    try {
        const borrowers = await borrowerService.getAllBorrowers();
        res.json(borrowers);
    } catch (error) {
        logger.error('Failed to fetch borrowers:', error);
        res.status(500).json({ message: 'Failed to fetch borrowers', error: error.message });
    }
};


module.exports = {
    addBorrower,
    updateBorrower,
    deleteBorrower,
    getAllBorrowers,
};