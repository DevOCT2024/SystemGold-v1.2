import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host:'smtp.hostinger.com',
    port:587,
    secure: false,
    auth:{
        user:'dev@octsolucoes.com.br',
        pass:'Oct@TEMP25'
    }

});

export default transporter;
