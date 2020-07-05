const crypto = require('crypto');

const accountService = {};

accountService.getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

accountService.generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

accountService.authTokens = {};

accountService.users = [
    { email: 'admin@test.com', password: '123' },
];
accountService.users[0].password = accountService.getHashedPassword(accountService.users[0].password);

module.exports = accountService;