/*
MIT License

Copyright (c) 2017 Muzammil Shahbaz <muzammil.shahbaz@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict';
var request = require('request');
var dv = require('dv');
var emailFunc = require("./send-email.js");
var message = require('../config/email_message_settings.json');
var fpl_settings = require('../config/fpl_settings.json');

const postcode = fpl_settings.postcode;
// urls for daily postcode lottery with account access key
const homeURL = 'https://freepostcodelottery.com/?reminder=' + fpl_settings.fpl_user_id;
const surveyURL = 'https://freepostcodelottery.com/survey-draw/?reminder=' + fpl_settings.fpl_user_id;
const videoURL = 'https://freepostcodelottery.com/video/?reminder=' + fpl_settings.fpl_user_id;
const stackpotURL = 'https://freepostcodelottery.com/stackpot/?reminder=' + fpl_settings.fpl_user_id;
const bonusURL = 'https://freepostcodelottery.com/your-bonus/?reminder=' + fpl_settings.fpl_user_id;
const imageURL = "https://freepostcodelottery.com/speech/2.php?s=4";

module.exports = function() {
	// check for different urls
    var array = [homeURL, surveyURL, videoURL, bonusURL];
    array.forEach(function(url) {
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.indexOf(postcode) > -1) {
                    console.log("Congrats! " + postcode + " has won the lottery at " + url);
                    message.html = "Congrats! " + postcode + " has won the lottery at " + url;
                    emailFunc.sendEmail(message);
                }
            }
        })
    });

    // check for stackpotURL in a special way because it always contains your postcode
    request(stackpotURL, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.indexOf('>' + postcode + '<') > -1) {
                console.log("Congrats! " + postcode + " has won the lottery at " + stackpotURL);
                message.html = "Congrats! " + postcode + " has won the lottery at " + stackpotURL;
                emailFunc.sendEmail(message);
            }
        }
    });

    // check the postcode in the image on the homepage
    request
        .get(imageURL)
        .on('error', function(err) {
            console.log(err)
        })
        .on('response', function(response) {
            // unmodified http.IncomingMessage object 
            response.on('data', function(data) {
                findPostCodeInImage(data)
            })
        });
}

function findPostCodeInImage(data) {
    var image = new dv.Image('png', data);
    var tesseract = new dv.Tesseract('eng', image);
    var todayPostCode = tesseract.findText('plain');
    if (todayPostCode.indexOf(postcode) > -1) {
        console.log("Congrats! the image has matched the postcode !!!");
        message.html = "Congrats! the image has matched the postcode !!!";
        emailFunc.sendEmail(message);
    }
    else {
        console.log("Today's postcode in the image is " + todayPostCode);
    }
}
