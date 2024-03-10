const NotFoundError = require("../errors/not_found.error");
const { Borrower } = require("../models")

const borrowerService = {};

borrowerService.addBorrower = async (email, name) => {
    try {
        const borrower = await Borrower.create({
            email,
            name,
        });
        return borrower;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new DuplicateEmailError("Email is already in use");
        }
        throw error;
    }
};

borrowerService.findByEmail = async (email) => {
    const borrower = await Borrower.findOne({ where: { email } });
    return borrower;
}

borrowerService.updateBorrower = async (id, email, name) => {
    try {
        const borrower = await Borrower.findByPk(id);
        if (!borrower) {
            throw new NotFoundError('Borrower not found');
        }
        borrower.email = email;
        borrower.name = name;
        await borrower.save();
        return borrower;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new DuplicateEmailError("Email is already in use");
        }
        throw error;
    }
};

borrowerService.deleteBorrower = async (id) => {
    try {
        const borrower = await Borrower.findByPk(id);
        if (!borrower) {
            throw new NotFoundError('Borrower not found');
        }
        await borrower.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};

borrowerService.getAllBorrowers = async () => {
    try {
        const borrowers = await Borrower.findAll();
        return borrowers;
    } catch (error) {
        throw error;
    }
};

module.exports = borrowerService;

