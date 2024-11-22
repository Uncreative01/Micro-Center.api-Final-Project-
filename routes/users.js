const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await prisma.customer.findUnique({
        where: { email },
    });
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const user = await prisma.customer.create({
            data: {
                email,
                password: hashedPassword,  
                first_name,
                last_name,
            },
        });
        res.status(201).json({ email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user. Please try again later.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.customer.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({ message: 'Login successful', email });
    } else {
        res.status(401).json({ error: 'Invalid credentials.' });
    }
});

// Logout route (basic placeholder)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully.' });
});

// Get user session route (can be expanded later for actual session handling)
router.get('/getSession', (req, res) => {
    res.status(200).json({ message: 'User session functionality not implemented yet.' });
});

// New route to get all users
router.get('/all', async (req, res) => {
    try {
        const users = await prisma.customer.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

module.exports = router;
