import { showAlert } from "./showAlert"

export const updateSettings = async (data,type)=>{
    try {
        
        const res = await axios({
            method:"PATCH",
            url : `/api/v1/users/${type === "profile" ? "update-me"  : type === "password" ?  "update-password": null}`,
            data
        })
        if(res.data.status==="success"){
            showAlert("success",`${type.toUpperCase()} Update Successfully!`)
        }
    } catch (error) {
        console.log(error)
        showAlert("error","Something Went Wrong please try again!")
    }
}