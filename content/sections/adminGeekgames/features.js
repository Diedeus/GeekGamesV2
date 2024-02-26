// let btn_profil = document.querySelector('#btn_profil')
// let btn_deconnect = document.querySelector('#btn_deconnect')

// const authTokenLocalstorage = localStorage.getItem('token')
// if(authTokenLocalstorage){
//     socket.emit('verifToken', authTokenLocalstorage)
// } else {
//     window.location.href = 'http://154.40.130.22:1112/'
// }

// socket.on('verifTokenOK', decoded =>{

//     btn_profil.style.display = 'flex'
//     btn_profil.textContent = 'BONJOUR ' + decoded.pseudo
//     btn_deconnect.style.display = 'flex'

// })

btn_deconnect.addEventListener('click', () =>{
    localStorage.removeItem('token')
    window.location.href = 'http://154.40.130.22:1112/'
})

let btn_home = document.querySelector('#btn_home')
btn_home.addEventListener('click', () =>{
    window.location.href = 'http://154.40.130.22:1112/'
})


let pseudo_newUser = document.querySelector('#pseudo_newUser')
let mail_newUser = document.querySelector('#mail_newUser')
let name_newUser = document.querySelector('#name_newUser')
let firstName_newUser = document.querySelector('#firstName_newUser')
let password_newUser = document.querySelector('#password_newUser')
let isAdmin_newUser = document.querySelector('#isAdmin_newUser')

let btn_createUser = document.querySelector('#btn_createUser')

let bodyTable = document.querySelector('#lab_TBODY_2480')

btn_createUser.addEventListener('click', () =>{

    let usernamePattern = /^[a-zA-Z0-9_-]{3,16}$/
    if(pseudo_newUser.value === '' || !usernamePattern.test(pseudo_newUser.value)) {
        alert('Veuillez saisir un pseudo valide: entre 3 et 16 caractères, comprenant des chiffres ou des lettres')
        return
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(mail_newUser.value === '' || !emailPattern.test(mail_newUser.value)){
        alert('Veuillez saisir une adresse mail valide')
        return
    }

    let namePattern = /^[a-zA-ZÀ-ÿ- ]{2,30}$/
    if(name_newUser.value === '' || !namePattern.test(name_newUser.value)) {
        alert('Veuillez saisir un nom valide')
        return
    }

    if(firstName_newUser.value === '' || !namePattern.test(firstName_newUser.value)) {
        alert('Veuillez saisir un prénom valide')
        return
    }

    let passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(btn_createUser.textContent === 'Ajoutez l\'utilisateur'){
        if(password_newUser.value === '' || !passwordPattern.test(password_newUser.value)) {
            alert('Veuillez saisir un mot de passe valide : doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre, un caractère spéciale et 8 caractères minimun')
            return
        }
    }

    let adminPattern = /^(0|1)$/
    if(isAdmin_newUser.value === '' || !adminPattern.test(isAdmin_newUser.value)){
        alert('Veuillez saisir un paramètre admin valide')
    }


    if(btn_createUser.textContent === 'Ajoutez l\'utilisateur'){
        let object_newUser = {
            pseudo : pseudo_newUser.value,
            mail: mail_newUser.value,
            nom: name_newUser.value,
            prenom: firstName_newUser.value,
            password: password_newUser.value,
            admin: isAdmin_newUser.value
        }
        socket.emit('adminNewUser', object_newUser)
        location.reload()
    } else if (btn_createUser.textContent === 'Modifier'){
        let object_updateUser = {
            id: inputHiddenIdUser.value,
            pseudo : pseudo_newUser.value,
            mail: mail_newUser.value,
            nom: name_newUser.value,
            prenom: firstName_newUser.value,
            password: inputHiddenpasswordUser.value,
            admin: isAdmin_newUser.value
        }
        console.log(object_updateUser)
        socket.emit('updateUser', object_updateUser)
        location.reload()
    }
   
})

socket.emit('listUser')

let popUpGestionUser_container = document.querySelector('#popUpGestionUser_container')
let spanSelectUser = document.querySelector('#lab_P_56542 span')
let inputHiddenIdUser = document.querySelector('#idUser')
let inputHiddenpasswordUser = document.querySelector('#passwordUser')

let btn_update_user = document.querySelector('#btn_update_user')
let btn_supp_user = document.querySelector('#btn_supp_user')
let btn_cancel_user = document.querySelector('#btn_cancel_user')


socket.on('listUserFull', e => {
    console.log(e)
    
    let tbody = document.querySelector('#lab_TBODY_2480')
    let data = [...e]

    data.forEach((element, index) => {
        const row = document.createElement('tr')
        if(index % 2 === 0){
            row.style.backgroundColor = '#f9f999'
        } else {
            row.style.backgroundColor = '#f99c09'
        }
        row.style.textAlign = 'center'
        row.style.fontFamily = 'Montserrat-Regular-(1)'
        row.style.fontSize = 1.6 +'svh'
        row.style.cursor = 'pointer'
        row.setAttribute('class', 'escape rowUser')
        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.pseudo}</td>
            <td>${element.email}</td>
            <td>${element.nom}</td>
            <td>${element.prenom}</td>
            <td>${element.mot_de_passe}</td>
            <td>${element.admin}</td>
        `
        tbody.appendChild(row)

        row.addEventListener('mouseenter', () =>{
            row.style.backgroundColor = 'rgb(153 233 249)'
        })

        row.addEventListener('mouseleave', ()=>{
            if(index % 2 === 0){
                row.style.backgroundColor = '#f9f999'
            } else {
                row.style.backgroundColor = '#f99c09'
            }
               
        })

        row.addEventListener('click', () => {
            popUpGestionUser_container.style.display = 'block'

            spanSelectUser.textContent = element.pseudo
            inputHiddenIdUser.value = element.id

            btn_cancel_user.addEventListener('click', () =>{
                spanSelectUser.textContent = 'user'
                popUpGestionUser_container.style.display = 'none'
                inputHiddenIdUser.value = ''
            })

            btn_supp_user.addEventListener('click', () => {
                socket.emit('suppUser', element.id)
                location.reload()
            })

            btn_update_user.addEventListener('click', () => {
                pseudo_newUser.value = element.pseudo
                mail_newUser.value = element.email
                name_newUser .value = element.nom
                firstName_newUser.value = element.prenom
                isAdmin_newUser.value = element.admin 
                inputHiddenpasswordUser.value = element.mot_de_passe

                popUpGestionUser_container.style.display = 'none'

                btn_createUser.textContent = "Modifier"

            })
        })


    })

})

                            //* gestion bouton entre les différents admins

let affUser = document.querySelector('#affUser')
let affQuizz = document.querySelector('#affQuizz')

let adminUser = document.querySelector('#adminUser')
let adminQuizz = document.querySelector('#adminQuizz')

affUser.addEventListener('click', ()=>{
    adminQuizz.style.display = 'none'
    adminUser.style.display = 'flex'
})

affQuizz.addEventListener('click', () => {
    adminQuizz.style.display = 'flex'
    adminUser.style.display = 'none'
})



                            //* création questions quizz


let inputQuestion = document.querySelector('#theQuestion')
let inputResponseA = document.querySelector('#reponseA')
let inputResponseB = document.querySelector('#reponseB')
let inputResponseC = document.querySelector('#reponseC')
let inputResponseD = document.querySelector('#reponseD')
let inputResponse = document.querySelector('#reponse')
let inputDifficulty = document.querySelector('#difficulty')
let btn_createQuizz = document.querySelector('#btn_createQuizz')

function verifierTexte(input) {
    const regex = /^[\p{L}0-9\s.,;:!?'"()\-]*$/u
    return regex.test(input);
}

btn_createQuizz.addEventListener('click', function(){

    console.log('test')

    if(!verifierTexte(inputQuestion.value)){return}
    if(!verifierTexte(inputResponseA.value)){return}
    if(!verifierTexte(inputResponseB.value)){return}
    if(!verifierTexte(inputResponseC.value)){return}
    if(!verifierTexte(inputResponseD.value)){return}
    if(!verifierTexte(inputResponse.value)){return}
    if(inputDifficulty.value !== '1' && inputDifficulty.value !== '2' && inputDifficulty.value !== '3') {return}

    console.log('test2')

    if(btn_createQuizz.textContent === 'Ajoutez la question') {
        console.log('test3')

        let quizz_newObject = { 
            question: inputQuestion.value,
            reponseA: inputResponseA.value,
            reponseB: inputResponseB.value,
            reponseC: inputResponseC.value,
            reponseD: inputResponseD.value,
            reponse: inputResponse.value,
            difficulte: inputDifficulty.value
        }

        socket.emit('adminNewQuizz' , quizz_newObject)
        location.reload()

    } else if (btn_createQuizz.textContent === 'Modifier') {

        let quizz_updateObject = { 
            questionOriginal: questionQuizz.value,
            question: inputQuestion.value,
            reponseA: inputResponseA.value,
            reponseB: inputResponseB.value,
            reponseC: inputResponseC.value,
            reponseD: inputResponseD.value,
            reponse: inputResponse.value,
            difficulte: inputDifficulty.value
        }

        socket.emit('updateQuestionQuizz', quizz_updateObject)
        location.reload()
    }

})

                                    //* gestions des questions ( read, delete, update )

let popUpGestionQuizz_container = document.querySelector('#popUpGestionQuizz_container')
let questionQuizz = document.querySelector('#QuestionQuizz')
let spanQuizz = document.querySelector('#lab_P_33606 span')

let btn_update_quizz = document.querySelector('#btn_update_quizz')
let btn_supp_quizz = document.querySelector('#btn_supp_quizz')
let btn_cancel_quizz = document.querySelector('#btn_cancel_quizz')

fetch("../content/ressources/medias/adminQuizz/questionQuizz.json") 
  .then(response => response.json()) 
  .then(data => {
    const tableBody = document.querySelector('#lab_TBODY_65114');
    data.forEach((element, index) => {
      const row = document.createElement('tr'); 
      if(index % 2 === 0){
            row.style.backgroundColor = '#f9f999'
        } else {
            row.style.backgroundColor = '#f99c09'
        }
        row.style.textAlign = 'center'
        row.style.fontFamily = 'Montserrat-Regular-(1)'
        row.style.fontSize = 1.6 +'svh'
        row.style.cursor = 'pointer'
        row.setAttribute('class', 'escape rowUser')
      row.innerHTML = `
        <td>${index}</td>
        <td>${element.question}</td>
        <td>${element.reponseA}</td>
        <td>${element.reponseB}</td>
        <td>${element.reponseC}</td>
        <td>${element.reponseD}</td>
        <td>${element.reponse}</td>
        <td>${element.difficulte}</td>
      `;

        row.addEventListener('click', () => {
            popUpGestionQuizz_container.style.display = 'block'

            questionQuizz.value = element.question
            spanQuizz.textContent = element.question

            btn_cancel_quizz.addEventListener('click', () => {
                popUpGestionQuizz_container.style.display = 'none'

                questionQuizz.value = ''
                spanQuizz.textContent = 'question'
            })

            btn_supp_quizz.addEventListener('click', () => {
                socket.emit('suppQuestionQuizz', element.question)
                location.reload()
            })

            btn_update_quizz.addEventListener('click', () => {
                inputQuestion.value = element.question
                inputResponseA.value = element.reponseA
                inputResponseB.value = element.reponseB
                inputResponseC.value = element.reponseC
                inputResponseD.value = element.reponseD
                inputResponse.value = element.reponse
                inputDifficulty.value = element.difficulte

                btn_createQuizz.textContent = "Modifier"

                popUpGestionQuizz_container.style.display = "none"
            })
        })
      
      tableBody.appendChild(row);
    });
  })
  