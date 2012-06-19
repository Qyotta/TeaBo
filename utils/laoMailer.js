var nodemailer = require('nodemailer');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport('SMTP',{
    host: 'smtp.googlemail.com', // hostname
    secureConnection: false,     // use SSL
    port: 587,                   // port for secure SMTP
    auth: {
        user: "swplao@googlemail.com",
        pass: "qwertz123"
    }
});

var mail = function(config) {

    // return if a mandatory field is missing
    if(!config || !config.receiver || !config.subject || !config.text) {
        return false;
    }

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from:    "LaoTeam <swplao@googlemail.com>", // sender address
        to:      config.receiver,                   // list of receivers
        subject: config.subject,                    // Subject line
        html:    config.text                        // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
            
            if(config.callback) {
                config.callback(error, response);
            }
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });

};

exports.send = mail;