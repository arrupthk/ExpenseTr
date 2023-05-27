const uuid = require('uuid');
const sendinblue = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Password = require('../models/password');

User.hasMany(Password);
Password.belongsTo(User);

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email, "printing email here")
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User Not Exist');
    } else {
      const id = uuid.v4();
      const resetPassword = { id: id, isactive: true };
      const resetpassword = await user.createPassword(resetPassword);
      //await resetpassword.setUser(user); // Associate the password with the user

      const client = sendinblue.ApiClient.instance;
      const apiKey = client.authentications['api-key'];
      apiKey.apiKey = process.env.sendinblue_key
      console.log(apiKey.apiKey, ' sending key for checking')
      const tranEmailApi = new sendinblue.TransactionalEmailsApi();

      const sender = {
        email: 'connectwithme147@gmail.com'
      };
      const receivers = [
        {
          email: email
        }
      ];
      console.log(`http://localhost:5000/password/reset-password/${id}`)
      const reset = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'reset password',
        textContent: 'reset your password here',
        htmlContent: `<a href="http://localhost:5000/password/reset-password/${id}">Reset Password</a>`
      });

      console.log('Email sent successfully'); // Check if email is sent successfully

      res.status(200).json({ message: 'Email sent successfully' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const resetpassword = await Password.findOne({ where: { id } });

    if (resetpassword) {
      await resetpassword.update({ isactive: false });
      console.log('Reset password form rendered'); // Check if the reset password form is rendered

      res.status(200).send(`
        <html>
          <script>
            function formsubmitted(event) {
              event.preventDefault();
              console.log('called');
            }
          </script>
          <form action="/password/update-password/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
          </form>
        </html>
      `);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const newpassword = req.query.newpassword;
    const id = req.params.id; // Update the parameter name to 'id'
    const updatepassword = await Password.findOne({ where: { id } });
    const user = await User.findByPk(updatepassword.userId); // Use 'findByPk' to find user by primary key

    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newpassword, saltRounds, async function (err, hash) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        await user.update({ password: hash });

        console.log('Password updated successfully'); // Check if the password is updated successfully

        res.status(201).json({ message: 'Successfully update the new password' });
      });
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};