import { showAlert } from "./showAlert"

export const updateSettings = async (data,type)=>{
    try {
        
        const res = await axios({
            method:"PATCH",
            url : `http://localhost:9000/api/v1/users/${type === "profile" ? "update-me"  : type === "password" ?  "update-password": null}`,
            data
        })
        console.log("this is from update user",res)
        if(res.data.status==="success"){
            showAlert("success",`${type.toUpperCase()} Update Successfully!`)
        }
    } catch (error) {
        console.log(error)
        showAlert("error","Something Went Wrong please try again!")
    }
}