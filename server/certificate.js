const Jimp = require('jimp');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
outputImagePath = "./path/to/output/image.png"
dotenv.config({ path: './.env' });

async function mailCertificate(username, mailAddress,fail) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  if(fail)
  {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: mailAddress,
        subject: 'Sorry !! Unfortunately you didnt pass the test...',
        text: `hello ${username}!!\nWe are sorry to say that you failed the test\nyou can attempt this later \nGood luck`
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  else {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: mailAddress,
      subject: 'Congratulations!! You have successfully cleared the test',
      text: `Congratulations ${username}!!\nHere is your certificate`,
      attachments: [
        {
          filename: 'problem_solving_certificate.png',
          path: outputImagePath
        }
      ]
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
}

async function updateDatabase(username) {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();

  const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });

  con.connect((err) => {
    if (err) {
      console.error('Database connection error:', err);
      return;
    }
    console.log('Database connection success');
  });

  con.query(
    'INSERT INTO certificate (name, date) VALUES (?, ?)',
    [username, dateString],
    (err, result) => {
      if (err) {
        console.error('Database query error:', err);
      } else {
        console.log('Value inserted successfully');
      }
    }
  );

  con.end((err) => {
    if (err) {
      console.error('Error closing the connection:', err);
    }
  });
}

async function addTextToImage(inputImagePath, username, mailId) {
  try {
    const image = await Jimp.read(inputImagePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    await image.print(font, 740, 640, username, 900, 100);
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    await image.print(font, 500, 1100, dateString, 300, 100);
    image.writeAsync(outputImagePath);
    console.log('Image with text saved successfully');
    await updateDatabase(username);
    await mailCertificate(username, mailId,false);
  } 
  catch (error) {
    console.error('Error processing image:', error);
  }
}

module.exports = { addTextToImage, updateDatabase, mailCertificate };

