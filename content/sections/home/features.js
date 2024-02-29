
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

                                                            //* affichage description jeu


 const descrGameArray = [
    {
        name: "basique",
        text: "Bien le bonjour jeune aventurier et bienvenue sur GEEKGAME !<br> Ici tu trouveras plusieurs mini jeux du plus simple comme le Quizz en passant par des jeux plus complexe comme le Flappy bird ou encore le Snake .. <br> Entraîne toi et compare tes scores avec ceux de tes amis et devient le MEILLEUR DES GEEKS "
    },
    {
        name : "quizz",
        text : "Êtes-vous un véritable passionné de la culture geek ? Mettez vos connaissances à l'épreuve avec notre quiz geek."
    },
    {
        name : "7Diff",
        text : "Plongez dans un univers geek captivant avec notre jeu des 7 différences. Mettez votre sens de l\'observation à l\'épreuve.."
    },
    {
        name : "juste prix",
        text : "Êtes-vous prêt à estimer la valeur des objets et à défier votre instinct? Mettez vos talents d'évaluation à l'épreuve.."
    },
    {
        name : "flappy bird", 
        text : "Préparez-vous à vous envoler dans le monde de Flappy Bird version DRAGON BALL ! un jeu addictif et plein de défis !"
    }
     
 ]

 let btnDescription_quizz = document.querySelector('#lab_DIV_75817')
 let btnDescription_7diff = document.querySelector('#lab_DIV_58705')
 let btnDescription_justePrix = document.querySelector('#lab_DIV_42508')
 let btnDescription_flappyBird = document.querySelector('#lab_DIV_59753')

 let round_quizz = document.querySelector('#lab_DIV_60805')
 let round_7diff = document.querySelector('#lab_DIV_95552')
 let round_justePrix = document.querySelector('#lab_DIV_32783')
 let round_flappyBird = document.querySelector('#lab_DIV_62755')

 let paraDescr = document.querySelector('#lab_P_76431')
 let btnDescr = document.querySelector('#lab_DIV_3412')

 round_quizz.style.backgroundColor = ''
 round_7diff.style.backgroundColor = ''
 round_justePrix.style.backgroundColor = ''
 round_flappyBird.style.backgroundColor = ''

 paraDescr.innerHTML = descrGameArray[0].text
 btnDescr.style.display = 'none'

 let varQuizz = 'false'

 btnDescription_quizz.addEventListener('click', function() {

    if(varQuizz === 'false') {
        round_quizz.style.backgroundColor = 'white'
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[1].text
        btnDescr.textContent = "Accéder au " + descrGameArray[1].name
        btnDescr.style.display = 'flex'

        varQuizz = 'true'
        var7diff = 'false'
        varJustePrix = 'false'
        varFlappyBird = 'false'

        btnDescr.addEventListener('click', () => {
            window.location.href = "http://154.40.130.22:1112/Quizz"
        })
    } else {
        varQuizz = 'false'

        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[0].text
        btnDescr.style.display = 'none'
    }
 })

 let var7diff = 'false'

 btnDescription_7diff.addEventListener('click', function() {
    if(var7diff === 'false') {
        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = 'white'
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[2].text
        btnDescr.textContent = "Accéder au " + descrGameArray[2].name
        btnDescr.style.display = 'flex'

        varQuizz = 'false'
        var7diff = 'true'
        varJustePrix = 'false'
        varFlappyBird = 'false'

        // btnDescr.addEventListener('click', () => {
        //     window.location.href = "http://154.40.130.22:1112/sandbox/Quizz"
        // })
    } else {
        var7diff = 'false'

        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[0].text
        btnDescr.style.display = 'none'
    }
 })

 let varJustePrix = 'false'

 btnDescription_justePrix.addEventListener('click', function() {
    if(varJustePrix === 'false') {
        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = 'white'
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[3].text
        btnDescr.textContent = "Accéder au " + descrGameArray[3].name
        btnDescr.style.display = 'flex'

        varQuizz = 'false'
        var7diff = 'false'
        varJustePrix = 'true'
        varFlappyBird = 'false'

        // btnDescr.addEventListener('click', () => {
        //     window.location.href = "http://154.40.130.22:1112/sandbox/Quizz"
        // })
    } else {
        varJustePrix = 'false'

        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[0].text
        btnDescr.style.display = 'none'
    }
 })

 let varFlappyBird = 'false'

 btnDescription_flappyBird.addEventListener('click', function(){
    if(varFlappyBird === 'false') {
        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = 'white'

        paraDescr.innerHTML = descrGameArray[4].text
        btnDescr.textContent = "Accéder au " + descrGameArray[4].name
        btnDescr.style.display = 'flex'

        varQuizz = 'false'
        var7diff = 'false'
        varJustePrix = 'false'
        varFlappyBird = 'true'

        // btnDescr.addEventListener('click', () => {
        //     window.location.href = "http://154.40.130.22:1112/sandbox/Quizz"
        // })
    } else {
        varFlappyBird = 'false'

        round_quizz.style.backgroundColor = ''
        round_7diff.style.backgroundColor = ''
        round_justePrix.style.backgroundColor = ''
        round_flappyBird.style.backgroundColor = ''

        paraDescr.innerHTML = descrGameArray[0].text
        btnDescr.style.display = 'none'
    }
 })
