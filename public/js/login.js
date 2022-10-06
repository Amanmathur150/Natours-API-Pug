import { showAlert , hideAlert } from "./showAlert"

export const login = async(email,password)=>{
    try {
       const res =  await axios({
            method:"POST",
            url : "http://localhost:9000/api/v1/users/login",
            data :{
                email,
                password
            }
        })
        console.log(res)
        if(res.data.status==="success"){
            showAlert("success","Log in successfully")
            window.setTimeout(()=>{
                hideAlert()
                location.assign("/")
            },3000)
        }
    } catch (error) {
        showAlert("error",error.response.data.message)
        console.log(error.response)
    }
}
export const logout = async()=>{
    try {
        console.log("hahah")
       const res =  await axios({
            method:"GET",
            url : "http://localhost:9000/logout",
        })
        console.log(res)

        location.assign("/")
        location.reload(true)
        
    } catch (error) {
        console.log(error)
        showAlert("error","something went wrong")
        
    }
}


// document.querySelector("form").addEventListener("submit",(e)=>{
//     e.preventDefault()
//     let email = document.getElementById("email").value
//     let password = document.getElementById("password").value
//     console.log("This is working ोकरकेर्पक")
//     console.log(email,password)
//     login(email,password)
// })