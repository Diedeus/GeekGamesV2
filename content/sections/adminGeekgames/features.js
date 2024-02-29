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
  


                                            //* gestion des propositions de questions

let notifPropalQuestion = document.querySelector('#notifPropalQuestion')
let propalQuestion_container = document.querySelector('#propalQuestion_container')
let btn_closeContainerPropalQuestion = document.querySelector('#btn_closeContainerPropalQuestion')

let listPropalQuestion = document.querySelector('#ListPropalQuestion')
let numberPropalQuestion = document.querySelector('#lab_P_6656')

propalQuestion_container.style.display = 'none'

notifPropalQuestion.addEventListener('click', function() {
    propalQuestion_container.style.display = 'flex'
})

btn_closeContainerPropalQuestion.addEventListener('click', function(){
    propalQuestion_container.style.display = 'none'
})

fetch("../content/ressources/medias/adminQuizz/propositionQuestionQuizz.json") 
  .then(response => response.json()) 
  .then(data => {

    numberPropalQuestion.textContent = data.length

     data.forEach((element) =>{
        const propalQuestion_container = document.createElement('div')
        propalQuestion_container.style.width = 96 + '%'
        propalQuestion_container.style.height = 25 + 'svh'
        propalQuestion_container.style.backgroundColor = 'white'
        propalQuestion_container.style.display = 'flex'
        propalQuestion_container.style.flexDirection = 'column'
        propalQuestion_container.style.marginTop = 1 + 'svh'
        propalQuestion_container.style.borderRadius = 10 + 'px'

        listPropalQuestion.appendChild(propalQuestion_container)

        const question_container = document.createElement('div')
        question_container.style.width = 100 + '%'
        question_container.style.height =  20 +'%'
        question_container.style.backgroundColor = 'white'
        question_container.style.display = 'flex'
        question_container.style.alignItems = 'center'
        question_container.style.justifyContent = 'center'
        question_container.style.fontFamily = 'Montserrat-Bold'
        question_container.style.color = '#3c2d87'
        question_container.style.fontSize = 2 + 'svh'
        question_container.textContent = element.questionPropose

        propalQuestion_container.appendChild(question_container)

        const reponseAB_container = document.createElement('div')
        reponseAB_container.style.width = 100 + '%'
        reponseAB_container.style.height = 20 + '%'
        reponseAB_container.style.display = 'flex'
        reponseAB_container.style.justifyContent = 'space-around'
        reponseAB_container.style.alignItems = 'center'

        propalQuestion_container.appendChild(reponseAB_container)

        const reponseA_container = document.createElement('div')
        reponseA_container.style.width = 40 + '%'
        reponseA_container.style.display = 'flex'
        reponseA_container.style.alignItems = 'center'
        reponseA_container.style.justifyContent = 'center'
        reponseA_container.style.fontFamily = 'Montserrat-Regular-(1)'
        reponseA_container.style.height = 80 + '%'
        reponseA_container.style.backgroundColor = 'rgb(252, 206, 92)'
        reponseA_container.style.color = '#3c2d87'
        reponseA_container.style.borderRadius = 15 + 'px'
        reponseA_container.textContent = element.reponseAPropose

        reponseAB_container.appendChild(reponseA_container)

        const reponseB_container = document.createElement('div')
        reponseB_container.style.width = 40 + '%'
        reponseB_container.style.display = 'flex'
        reponseB_container.style.alignItems = 'center'
        reponseB_container.style.justifyContent = 'center'
        reponseB_container.style.fontFamily = 'Montserrat-Regular-(1)'
        reponseB_container.style.height = 80 + '%'
        reponseB_container.style.backgroundColor = 'rgb(252, 206, 92)'
        reponseB_container.style.color = '#3c2d87'
        reponseB_container.style.borderRadius = 15 + 'px'
        reponseB_container.textContent = element.reponseBPropose

        reponseAB_container.appendChild(reponseB_container)

        const reponseCD_container = document.createElement('div')
        reponseCD_container.style.width = 100 + '%'
        reponseCD_container.style.height = 20 + '%'
        reponseCD_container.style.display = 'flex'
        reponseCD_container.style.justifyContent = 'space-around'
        reponseCD_container.style.alignItems = 'center'

        propalQuestion_container.appendChild(reponseCD_container)

        const reponseC_container = document.createElement('div')
        reponseC_container.style.width = 40 + '%'
        reponseC_container.style.display = 'flex'
        reponseC_container.style.alignItems = 'center'
        reponseC_container.style.justifyContent = 'center'
        reponseC_container.style.fontFamily = 'Montserrat-Regular-(1)'
        reponseC_container.style.height = 80 + '%'
        reponseC_container.style.backgroundColor = 'rgb(252, 206, 92)'
        reponseC_container.style.color = '#3c2d87'
        reponseC_container.style.borderRadius = 15 + 'px'
        reponseC_container.textContent = element.reponseCPropose

        reponseCD_container.appendChild(reponseC_container)

        const reponseD_container = document.createElement('div')
        reponseD_container.style.width = 40 + '%'
        reponseD_container.style.display = 'flex'
        reponseD_container.style.alignItems = 'center'
        reponseD_container.style.justifyContent = 'center'
        reponseD_container.style.fontFamily = 'Montserrat-Regular-(1)'
        reponseD_container.style.height = 80 + '%'
        reponseD_container.style.backgroundColor = 'rgb(252, 206, 92)'
        reponseD_container.style.color = '#3c2d87'
        reponseD_container.style.borderRadius = 15 + 'px'
        reponseD_container.textContent = element.reponseDPropose

        reponseCD_container.appendChild(reponseD_container)

        const reponseDiff_container = document.createElement('div')
        reponseDiff_container.style.width = 100 + '%'
        reponseDiff_container.style.height = 20 + '%'
        reponseDiff_container.style.display = 'flex'
        reponseDiff_container.style.justifyContent = 'space-around'
        reponseDiff_container.style.alignItems = 'center'

        propalQuestion_container.appendChild(reponseDiff_container)
        
        const reponse_container = document.createElement('div')
        reponse_container.style.width = 40 + '%'
        reponse_container.style.display = 'flex'
        reponse_container.style.alignItems = 'center'
        reponse_container.style.justifyContent = 'center'
        reponse_container.style.fontFamily = 'Montserrat-Regular-(1)'
        reponse_container.style.height = 80 + '%'
        reponse_container.style.backgroundColor = 'rgb(252, 206, 92)'
        reponse_container.style.color = '#3c2d87'
        reponse_container.style.borderRadius = 15 + 'px'
        reponse_container.textContent = element.reponsePropose
        
        reponseDiff_container.appendChild(reponse_container)

        const difficulty_container = document.createElement('div')
        difficulty_container.style.width = 40 + '%'
        difficulty_container.style.display = 'flex'
        difficulty_container.style.alignItems = 'center'
        difficulty_container.style.justifyContent = 'center'
        difficulty_container.style.fontFamily = 'Montserrat-Regular-(1)'
        difficulty_container.style.height = 80 + '%'
        difficulty_container.style.backgroundColor = 'rgb(252, 206, 92)'
        difficulty_container.style.color = '#3c2d87'
        difficulty_container.style.borderRadius = 15 + 'px'
        difficulty_container.textContent = element.difficulty
        
        reponseDiff_container.appendChild(difficulty_container)

        const btnPropal_container = document.createElement('div')
        btnPropal_container.style.width = 100 + '%'
        btnPropal_container.style.height = 20 + '%'
        btnPropal_container.style.display = 'flex'
        btnPropal_container.style.justifyContent = 'space-around'
        btnPropal_container.style.alignItems = 'center'

        propalQuestion_container.appendChild(btnPropal_container)

        const btn_accepted = document.createElement('div')
        btn_accepted.style.height = 80 + '%'
        btn_accepted.style.backgroundColor = '#3c2d87'
        btn_accepted.style.color = 'rgb(229, 175, 42)'
        btn_accepted.style.borderRadius = 15 + 'px'
        btn_accepted.style.width = 30 + '%'
        btn_accepted.style.display = 'flex'
        btn_accepted.style.alignItems = 'center'
        btn_accepted.style.justifyContent = 'center'
        btn_accepted.style.fontFamily = 'Montserrat-Regular-(1)'
        btn_accepted.style.cursor = 'pointer'
        btn_accepted.textContent = 'Accepter'

        btnPropal_container.appendChild(btn_accepted)

        btn_accepted.addEventListener('click', () => {
            console.log(element)
            socket.emit('questionPropalAccepted', element)
            propalQuestion_container.remove()

        })

        const btn_updated = document.createElement('div')
        btn_updated.style.height = 80 + '%'
        btn_updated.style.backgroundColor = '#3c2d87'
        btn_updated.style.color = 'rgb(229, 175, 42)'
        btn_updated.style.borderRadius = 15 + 'px'
        btn_updated.style.width = 30 + '%'
        btn_updated.style.display = 'flex'
        btn_updated.style.alignItems = 'center'
        btn_updated.style.justifyContent = 'center'
        btn_updated.style.fontFamily = 'Montserrat-Regular-(1)'
        btn_updated.style.cursor = 'pointer'
        btn_updated.textContent = 'Modifier'

        btnPropal_container.appendChild(btn_updated)

        btn_updated.addEventListener('click', () =>{
            inputQuestion.value = element.questionPropose
            inputResponseA.value = element.reponseAPropose
            inputResponseB.value = element.reponseBPropose
            inputResponseC.value = element.reponseCPropose
            inputResponseD.value = element.reponseDPropose
            inputResponse.value = element.reponsePropose
            inputDifficulty.value = element.difficulty

            propalQuestion_container.style.display = "none"
            socket.emit('questionPropalSupprimer', element.question)
            propalQuestion_container.remove()

        })

        const btn_deleted = document.createElement('div')
        btn_deleted.style.height = 80 + '%'
        btn_deleted.style.backgroundColor = '#3c2d87'
        btn_deleted.style.color = 'rgb(229, 175, 42)'
        btn_deleted.style.borderRadius = 15 + 'px'
        btn_deleted.style.width = 30 + '%'
        btn_deleted.style.display = 'flex'
        btn_deleted.style.alignItems = 'center'
        btn_deleted.style.justifyContent = 'center'
        btn_deleted.style.fontFamily = 'Montserrat-Regular-(1)'
        btn_deleted.style.cursor = 'pointer'
        btn_deleted.textContent = 'Refuser'

        btnPropal_container.appendChild(btn_deleted)

        btn_deleted.addEventListener('click', () => {
            socket.emit('questionPropalSupprimer', element.question)
            propalQuestion_container.remove()
        })
        

     })

  })