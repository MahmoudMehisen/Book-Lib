const DuplicateEmailError = require("../errors/duplicate_email.error");
const { User } = require("../models")

const authService = {};


authService.findUserByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    return user;
};

authService.registerUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new DuplicateEmailError("Email is already in use");
        }
        throw error;
    }
};

module.exports = authService;
