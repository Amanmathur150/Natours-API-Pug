import {login,logout} from "./login"
import { booking } from "./stripe"
import {updateProfile, updateSettings} from "./updateSetting"


let logoutel = document.getElementsByClassName("nav__el--logout")[0]
if(logoutel){


    logoutel.addEventListener("click",()=>{
      
        logout()
    })
}

let form = document.querySelector(".form--login")

if(form){

    form.addEventListener("submit",(e)=>{
        e.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        console.log("This is working ोकरकेर्पक")
        console.log(email,password)
        login(email,password)
    })
}

const updateForm = document.querySelector(".form-user-data")
console.log(updateForm)

if(updateForm){

    updateForm.addEventListener("submit",(e)=>{
        e.preventDefault()
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const photo = document.getElementById("photo").files[0]
        // const photo = document.getElementById("photo").files[0]
        console.log("updateforom",name,email,photo)
        let form = new FormData()
        form.append("name",document.getElementById("name").value)
        form.append("email",document.getElementById("email").value)
        form.append("photo",document.getElementById("photo").files[0])
        updateSettings(form,"profile")
        // console.log("photo",photo)
    })
}
const passwordForm = document.querySelector(".update--password")
const passwordFormbtn = document.querySelector(".update-pass-btn")


if(passwordFormbtn){

    passwordFormbtn.addEventListener("click",async(e)=>{
 
       
        passwordFormbtn.textContent = "Updating..."
        const password = document.getElementById("password-current").value
        const newPassword = document.getElementById("newPassword").value
        const newConfirmPassword = document.getElementById("newConfirmPassword").value
        // const photo = document.getElementById("photo").files[0]

        await updateSettings({password,newPassword,newConfirmPassword},"password")
        document.getElementById("password-current").value = ""
        document.getElementById("newPassword").value = ""
        document.getElementById("newConfirmPassword").value = ""
        passwordFormbtn.textContent = "Save password"
        // console.log("photo",photo)
    })
}

const bookbnt = document.getElementById("book-tour")
const tourId = bookbnt.dataset.tourId
if(tourId){
    bookbnt.addEventListener("click",(e)=>{
        booking(tourId)
    })
}