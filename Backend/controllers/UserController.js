const { registerUser, loginUser, getUserDetails, deleteUser } = require("../models/User")


exports.addRegisterUser = async (req, res) => {
    try {
        const { name, email, password,phoneNumber,  role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email, password are required' });
        }
        const normalizedRole = (role === 'admin' || role === 'user') ? role : 'user';
        const user = await registerUser({ name, email, password, phoneNumber, role: normalizedRole });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
};


exports.addLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email, password are required' });
        }
        const user = await loginUser(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'User logged in successfully', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Failed to log in user' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const users = await getUserDetails();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({ message: 'Failed to get user details' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};