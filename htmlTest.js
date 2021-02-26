const fs = require("fs");

const mailgun = require("mailgun-js");
const DOMAIN = 'mg.thesedays.io';
const mg = mailgun({apiKey: '7e22595a55c1000f2101bd49824ddf7d-6e0fd3a4-c9cbc5f2', domain: DOMAIN});





fs.readFile(
    "./email_templates/verify.html",
    { encoding: "utf-8" },
    function (err, html) {
        if (err) {
            console.log(err);
        } else {
            const data = {
                from: 'These Days <support@tehsedays.io>',
                to: 'tcgilbert94@gmail.com',
                subject: 'Confirm your account',
                text: html
            };
            mg.messages().send(data, function (error, body) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(body);
                }
            });
        }
    }
);

