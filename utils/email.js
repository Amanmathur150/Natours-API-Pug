const nodemailer = require("nodemailer")
const pug = require("pug")
const htmltotext = require("html-to-text")

module.exports = class Email{
    constructor(user , url){
        this.to = user.email
        this.url = url
        this.from = `Aman Mathur <${process.env.FROM_EMAIL}>`
        this.user = user
    }

    newTransport(){

        if(process.env.NODE_ENV === "production"){
            return nodemailer.createTransport({
                service : "SendGrid" , 
                auth : {
                    user : process.env.SENDGRID_EMAIL,
                    pass : process.env.SENDGRID_PASSWORD
                },
            })
          
        }else if(process.env.NODE_ENV === "development"){
            return nodemailer.createTransport({
                host : process.env.EMAIL_HOST , 
                auth : {
                    user : process.env.EMAIL_USERNAME,
                    pass : process.env.EMAIL_PASSWORD
                },
                port : process.env.EMAIL_PORT,
            
            })
        }
    }

    async sendMail(template,subject){
        let html =pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            url : this.url,
            firstName : this.user.name.split(" ")[0]
        })

    return await this.newTransport().sendMail({
        from : this.from,
        to : this.to,
        subject : subject,
        html : html,
        text : htmltotext.convert(html)
})
       
    }

    async sendWelcome(){
       await this.sendMail("welcome","Wellcome To Natours Family !")
    }
    
    async sendPasswordReset(){
        
       await this.sendMail("passwordReset","Your password reset Token is valid for 10 mins")
    }
}

// const sendEmail = async (options) =>{
//     const transport  = nodemailer.createTransport({
//         host : process.env.EMAIL_HOST , 
//         auth : {
//             user : process.env.EMAIL_USERNAME,
//             pass : process.env.EMAIL_PASSWORD
//         },
//         port : process.env.EMAIL_PORT,
    
//     })

//     await transport.sendMail({
//         from : "Aman Mathur <aman@natour.io>",
//         to : options.email,
//         subject : options.subject,
//         text : options.message
//     })

      
// }

// module.exports = sendEmail