var nodemailer = require('nodemailer');
var sendEmail = function(title, content, attachments){
    return new Promise(function(resolve){
        // 开启一个 SMTP 连接池
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
            service: 'qq',
            port: 465, // SMTP 端口
            secureConnection: true, // 使用 SSL
            auth: {
                user: 'qiefabu',
                //这里密码不是qq密码，是你设置的smtp密码
                pass: 'prpr123MEDIA'
            }
        });

        var rf=require("fs");
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'qiefabu@qq.com', // 发件地址
            to: '735183844@qq.com', // 收件列表
            subject: title, // 标题
            text: content
            //text和html两者只支持一种
            //text: content, // 标题
        };

// send mail with defined transport object
        
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log("error",error)
            }
            else{
                resolve(true)
            }

        });
    })
}

exports.sendEmail = sendEmail
