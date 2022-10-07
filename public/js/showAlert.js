export const hideAlert = ()=>{
    let el = document.querySelector(".alert")
    el.parentElement.removeChild(el)
}
export const showAlert = (type, message,time=5)=>{

    let marker = `<div class="alert alert--${type}">${message}</div>`
    document.body.insertAdjacentHTML("afterbegin" ,marker)
    window.setTimeout(hideAlert,time*1000)
}