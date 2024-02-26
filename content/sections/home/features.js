
let btn_actu = document.querySelector('#actuBdd')

btn_actu.addEventListener('click', ()=> {
    socket.emit('listUser')
})

                                                                //* gestion ouverture / fermeture pop Up inscription

let btn_inscription = document.querySelector('#btn_inscription')
let popUpInscription = document.querySelector('#popUpInscription')
let formInsc_container = document.querySelector('#lab_DIV_22805')
let croixContainer = document.querySelector('#croixContainer')

croixContainer.addEventListener('click', () =>{
    popUpInscription.style.display = 'none'
})

btn_inscription.addEventListener('click', () => {
    popUpInscription.style.display = 'flex'
})

popUpInscription.addEventListener('click', function(event) {
    if(event.target === formInsc_container || formInsc_container.contains(event.target)){

    } else {
        popUpInscription.style.display = 'none'
    }
})

                                                            //* gestion ouverture / fermeture pop Up connexion

let btn_connect = document.querySelector('#btn_connect')
let popUpconnect = document.querySelector('#popUpConnect')
let formConn_container = document.querySelector('#lab_DIV_80545')
let croix2Container = document.querySelector('#croix2Container')

croix2Container.addEventListener('click', () => {
    popUpconnect.style.display = 'none'
})

btn_connect.addEventListener('click', () => {
    popUpconnect.style.display = 'flex'
})

popUpconnect.addEventListener('click', function(event){
    if(event.target === formConn_container || formConn_container.contains(event.target)){

    } else {
        popUpconnect.style.display = 'none'
    }
})

                                                            //* creation objet inscription

let btnInsc = document.querySelector('#btninsc')

btnInsc.addEventListener('click', function(){

    let pseudos_ins = document.querySelector('#pseudos_ins').value
    let email_ins = document.querySelector('#email_ins').value
    let name_ins = document.querySelector('#name_ins').value
    let firstname_ins = document.querySelector('#firstName_ins').value
    let password_ins = document.querySelector('#password_ins').value
    let confPassword_ins = document.querySelector('#confPassword_ins').value

    if(password_ins === confPassword_ins) {

        let newInscObject = {
            pseudos: pseudos_ins,
            mail: email_ins,
            name: name_ins,
            firstname: firstname_ins,
            password: password_ins
        }
        socket.emit('new_user', newInscObject)
    }

})

socket.on('inscrUserOK', token =>{
    localStorage.setItem('token', token)
    window.location.reload()
})

//* espace Connection

let mail_conn = document.querySelector('#mail_conn')
let password_conn = document.querySelector('#password_conn')

let btnConn = document.querySelector('#btnConn')

btnConn.addEventListener('click', () =>{
    if(mail_conn.value !== '' && password_conn.value !== '') {
        let objectConnection = {
            mail: mail_conn.value,
            password: password_conn.value
        
        }
        socket.emit('loginUser', objectConnection)
    }
})

socket.on('loginUserFail_userNotFind', text => {
    mail_conn.style.border = '3px solid red'

    let errContainer = document.createElement('div')
    errContainer.style.position = 'fixed'
    errContainer.style.top = 2 + 'svh'
    errContainer.style.right = 2 + 'svw'
    errContainer.style.backgroundColor = '#f9040473'
    errContainer.style.width = 17 + 'svw'
    errContainer.style.height = 20 + 'svh'
    errContainer.style.borderRadius = 20 +'px'
    errContainer.style.display = 'flex'
    errContainer.style.justifyContent = 'center'
    errContainer.style.alignItems = 'center'
    errContainer.style.color = 'white'
    errContainer.style.fontFamily = 'Montserrat-Regular-(1)'
    errContainer.textContent = text
    popUpconnect.appendChild(errContainer)

    mail_conn.addEventListener('focus', () => {
        errContainer.remove()
        mail_conn.style.border = '3px solid rgb(60, 45, 135)'
    })
})

socket.on('loginUserFail_passwordFalse', text => {
    password_conn.style.border = '3px solid red'

    let errContainer = document.createElement('div')
    errContainer.style.position = 'fixed'
    errContainer.style.top = 2 + 'svh'
    errContainer.style.right = 2 + 'svw'
    errContainer.style.backgroundColor = '#f9040473'
    errContainer.style.width = 17 + 'svw'
    errContainer.style.height = 20 + 'svh'
    errContainer.style.borderRadius = 20 +'px'
    errContainer.style.display = 'flex'
    errContainer.style.justifyContent = 'center'
    errContainer.style.alignItems = 'center'
    errContainer.style.color = 'white'
    errContainer.style.fontFamily = 'Montserrat-Regular-(1)'
    errContainer.textContent = text
    popUpconnect.appendChild(errContainer)

    password_conn.addEventListener('focus', () => {
        errContainer.remove()
        password_conn.style.border = '3px solid rgb(60, 45, 135)'
    })
})

socket.on('loginUserOK', token => {
    localStorage.setItem('token', token)
    window.location.reload()
})


                                                            //* verification token et conséquences

let btn_profil = document.querySelector('#btn_connect')
let btn_deconnect = document.querySelector('#btn_deconnect')
let btn_admin = document.querySelector('#btn_admin')

let btnRightContainer = document.querySelector('#lab_DIV_48011')

const authTokenLocalstorage = localStorage.getItem('token')

socket.emit('verifToken', authTokenLocalstorage)

socket.on('verifTokenOK', decoded =>{
    console.log(decoded)
    btn_connect.style.display = 'none'
    btn_inscription.style.display = 'none'

    btnRightContainer.style.width = 42 + '%'

    btn_profil.style.display = 'flex'
    btn_profil.textContent = 'BONJOUR ' + decoded.pseudo
    btn_deconnect.style.display = 'flex'

    if(decoded.isadmin === 1) {
        btn_admin.style.display = 'flex'
    }

})

btn_deconnect.addEventListener('click', () =>{
    localStorage.removeItem('token')
    window.location.reload()
})

                                                            //* accès admin

btn_admin.addEventListener('click', () =>{
    window.location.href = 'http://154.40.130.22:1112/adminGeekgames'
})