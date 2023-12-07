
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
exports.usergethomePage = (request, response, next) => {
    response.sendFile('main.html', { root: 'views' });
}
exports.signupAuthentication = async (request, response, next) => {
    const { Name, userName, password } = request.body;
    try {
        let userExist = await User.findOne({email:userName});
        if (!userExist) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name:Name,
                email:userName,
                password:hashedPassword});
            const{_id} =  await user.save();
            const userId = _id.toString();
            const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: '1h' });
            response.status(200).send({ token: token, user: user });
        } else {
            response.status(401).send(userExist);
        }

    } catch (error) {
        console.log(error);
    }
}
exports.signinAuthentication = async (request, response, next) => {
    try {
        const { userName, password } = request.body;
        let userExist = await User.findOne({email:userName});
        if (!userExist) {
            response.status(404).send('User not found');
        } else {
            const isPasswordValid = await bcrypt.compare(password, userExist.password);
            if (isPasswordValid) {
                const userId = userExist._id.toString();
                const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: '1h' });
                response.status(200).json({ token: token, user: userExist });
            } else {
                response.status(401).send('Authentication failed');
            }
        }


    } catch (error) {
        console.log(error);
        response.status(500).send('An error occurred during authentication');
    }
}
exports.getcurrentuser = async (request, response, next) => {
    const {user:{name,email,ispremiumuser}} = request;
    const user = {
        name,
        email,
        ispremiumuser,
    }
    response.json({user});
}
