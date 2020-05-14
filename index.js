const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
const config = require("./config.json");

class Server {
  constructor() {
    this.init();
  }

  init() {
    this.initRoutes();
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  }
  initRoutes() {
    app.post("/rajtech/mail", (req, res) => {

      const nodemailer = require("nodemailer");
      const { google } = require("googleapis");
      const OAuth2 = google.auth.OAuth2;

      const oauth2Client = new OAuth2(
        config.clientId, // ClientID
        config.clientSecret, // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
      );

      oauth2Client.setCredentials({
        refresh_token: config.refreshToken,
      });

      const accessToken = oauth2Client.getAccessToken();
      const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: config.gmail,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          refreshToken: config.refreshToken,
          accessToken: accessToken,
        },
      });

    
    // Mock data 

      const mailOptions = {
        from: config.gmail,
        to: [config.gmail],
        subject: "Node.js Email with Secure OAuth",
        generateTextFromHTML: true,
        html: "<b>test</b>",
      };

    //   const mailOptions = {
    //     from: req.body.gmail,
    //     to: [config.gmail],
    //     subject: req.body.subject,
    //     generateTextFromHTML: true,
    //     html: req.body.html,
    //   };

      smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : res.send(response);
        smtpTransport.close();
      });
    });
  }
}
const serve = new Server();
