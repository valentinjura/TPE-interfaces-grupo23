
document.querySelector('#signup-button').addEventListener('click',()=>{
    let nombre_apellido=document.querySelector('#name').value;
    let edad=document.querySelector('#age').value;
    let email=document.querySelector('#email').value;
    let password=document.querySelector('#password').value;
    let repeat_password=document.querySelector('#repeat_password').value;
    if(!nombre_apellido || !edad || !email || !password|| !repeat_password){
        console.log('Falta rellenar un campo')
    }else{
        console.log("registro exitoso")
    }

})