const User = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi(); 
const { ObjectId } = require('mongodb');
exports.requestresetpassword = async (request, response, next) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({email})
        if (user) {
            const sender = {
                email: 'ramanizum@gmail.com',
                name: 'From Mufil Rahman Pvt.Ltd'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            user.forgotPassword.push({
                isActive: true,
                createdAt: new Date()
            })
            const{forgotPassword} =  await user.save();
            const id = forgotPassword[forgotPassword.length-1]._id.toString();
            const mailresponse = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your password",
                htmlContent: `
              <!DOCTYPE html>
                <html>
                <head>
                    <title>Password Reset</title>
                </head>
                <body>
                    <h1>Reset Your Password</h1>
                    <p>Click the button below to reset your password:</p>
                    <button><a href="${process.env.WEBSITE}/password/reset/{{params.role}}">Reset Password</a></button>
                </body>
                </html>`, params: {
                    role: id
                }
            })
            response.status(200).json({ message: 'Password reset email sent' });
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Interenal Server Error' });
    }
}

exports.resetpasswordform = async (request, response, next) => {
    try {
        const { forgotId } = request.params;
        console.log(forgotId);
        const user = await User.findOne({
            "forgotPassword": {
              $elemMatch: {
                "_id": new ObjectId(forgotId)
              }
            }
          });
        const { forgotPassword } = user;
        const existing= forgotPassword.find(item => item._id.equals(new ObjectId(forgotId)));
        if (existing.isActive) {
            existing.isActive = false;
            await user.save();
            response.sendFile('resetpassword.html', { root: 'views' })
        } else {
            return response.status(401).json({ message: "Link has been expired" })
        }

    } catch (error) {

    }
}

exports.resetpassword = async (request, response, next) => {
    try {
        const { resetid, newpassword } = request.body;
        const  user  = await User.findOne({
            "forgotPassword": {
              $elemMatch: {
                "_id": new ObjectId(resetid)
              }
            }
          });
        const { forgotPassword } = user;
        const existing= forgotPassword.find(item => item._id.equals(new ObjectId(resetid)))
        const currentTime = new Date();
        const createdAtTime = new Date(existing.createdAt);
        const timeDifference = currentTime - createdAtTime;
        const timeLimit = 5 * 60 * 1000; 
        if(timeDifference <= timeLimit){
            const hashedPassword = await bcrypt.hash(newpassword, 10);
             user.password = hashedPassword;
             await user.save();
            response.status(200).json({ message: "Password reset successful." });
        }else{
            response.status(403).json({ message: "Link has expired"});
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        response.status(500).json({ message: "Internal server error" });
    }
};

