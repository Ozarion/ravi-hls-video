const express = require('express');
const router = express.Router();
const accService = require('../services/accountService');

router.get('/register', (req, res, next) => {
    res.render('register', {layout: 'accounts.hbs'});
});

router.post('/register', (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    if (password === confirmPassword) {
        // Check if user with the same email is also registered
        if (accService.users.find(user => user.email === email)) {

            res.render('register', {
                layout: 'accounts.hbs',
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        const hashedPassword = accService.getHashedPassword(password);

        // Store user into the database if you are using one
        accService.users.push({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.render('login', {
            layout: 'accounts.hbs',
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
    } else {
        res.render('register', {
            layout: 'accounts.hbs',
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login', {layout: 'accounts.hbs'});
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = accService.getHashedPassword(password);

    const user = accService.users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = accService.generateAuthToken();

        // Store authentication token
        accService.authTokens[authToken] = user;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the protected page
        res.redirect('/');
    } else {
        res.render('login', {
            layout: 'accounts.hbs',
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
});

module.exports = router;