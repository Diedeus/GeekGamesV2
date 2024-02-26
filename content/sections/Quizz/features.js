let btn_aloneGame = document.querySelector('#btn_aloneGame')
let btn_returnHome = document.querySelector('#btn_returnHome')
let btn_multiplayerGame = document.querySelector('#btn_multiplayerGame')
let btn_propalQuestion = document.querySelector('#btn_propalQuestion')

let scoreDay = document.querySelector('#scoreDay')
let scoreMonth = document.querySelector('#scoreMonth')
let totalScore = document.querySelector('#totalScore')

function animMenuQuizzBegin(){
    setTimeout(() => {
        btn_aloneGame.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        btn_aloneGame.style.marginRight = 0
    }, 500);

    setTimeout(() => {
        scoreDay.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        scoreDay.style.marginLeft = 0
    }, 750);

    setTimeout(() => {
        btn_multiplayerGame.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        btn_multiplayerGame.style.marginRight = 0
    }, 1000);

    setTimeout(() => {
        scoreMonth.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        scoreMonth.style.marginLeft = 0
    }, 1250);

    setTimeout(() => {
        btn_propalQuestion.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        btn_propalQuestion.style.marginRight = 0
    }, 1500);
    setTimeout(() => {
        totalScore.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        totalScore.style.marginLeft = 0
    }, 1750);

    setTimeout(() => {
        btn_returnHome.style.transition = 'all 1s cubic-bezier(0, 0, 0.02, 1.02) 0s'
        btn_returnHome.style.marginRight = 0
    }, 2000);
}


let scoresQuizz = document.querySelector('#scoresQuizz')
let formPropalQuizz = document.querySelector('#formPropalQuizz')
let soloGame_container = document.querySelector('#soloGame_container')
let multiGame_container = document.querySelector('#multiGame_container')


function dispContainerScores() {

   setTimeout(() => {
    scoreDay.style.marginLeft = 130 + '%'
   }, 250);

   setTimeout(() => {
    scoreMonth.style.marginLeft = 130 + '%'
   }, 500);

   setTimeout(() => {
    totalScore.style.marginLeft = 130 + '%'
   }, 750);

   setTimeout(() => {
        scoresQuizz.style.display = 'none'
   }, 1750);

}

let inptQuestion_container = document.querySelector('#inptQuestion_container')
let inptReponseA_container = document.querySelector('#inptReponseA_container')
let inptReponseB_container = document.querySelector('#inptReponseB_container')
let inptReponseC_container = document.querySelector('#inptReponseC_container')
let inptReponseD_container = document.querySelector('#inptReponseD_container')
let inptReponse_container = document.querySelector('#inptReponse_container')
let inptDifficulty_container = document.querySelector('#inptDifficulty_container')
let btn_propalQuestionQuizz = document.querySelector('#btn_propalQuestionQuizz')
let title_propalQuestion = document.querySelector('#lab_H2_80945')

function AppContainerPropalQuestion(){
    formPropalQuizz.style.display = 'flex'

    setTimeout(() => {
        inptQuestion_container.style.marginLeft = 0
        title_propalQuestion.style.opacity = 1
    }, 200)

    setTimeout(() => {
        inptReponseA_container.style.marginLeft = 0
    }, 400);

    setTimeout(() => {
        inptReponseB_container.style.marginLeft = 0
    }, 600);

    setTimeout(() => {
        inptReponseC_container.style.marginLeft = 0
    }, 800);

    setTimeout(() => {
        inptReponseD_container.style.marginLeft = 0
    }, 1000);

    setTimeout(() => {
        inptReponse_container.style.marginLeft = 0
    }, 1200);

    setTimeout(() => {
        inptDifficulty_container.style.marginLeft = 0
    }, 1400);

    setTimeout(() => {
        btn_propalQuestionQuizz.style.marginLeft = 0 
    }, 1600);
}

function DispContainerPropalQuestion(){
    setTimeout(() => {
        inptDifficulty_container.style.marginLeft = 170 + '%'
    }, 200)

    setTimeout(() => {
        inptReponse_container.style.marginLeft = 170 + '%'  
    }, 400);

    setTimeout(() => {
        inptReponseD_container.style.marginLeft = 170 + '%'
    }, 600);

    setTimeout(() => {
        inptReponseC_container.style.marginLeft = 170 + '%'
    }, 800);

    setTimeout(() => {
        inptReponseB_container.style.marginLeft = 170 + '%'
    }, 1000);

    setTimeout(() => {
        inptReponseA_container.style.marginLeft = 170 + '%'
    }, 1200);

    setTimeout(() => {
        inptQuestion_container.style.marginLeft = 170 + '%'
    }, 1400);

    setTimeout(() => {
        btn_propalQuestionQuizz.style.marginLeft = 170 + '%'
    }, 0);

    setTimeout(() => {
        title_propalQuestion.style.opacity = 0
    }, 1600);

    setTimeout(() => {
        formPropalQuizz.style.display = 'none'
    }, 2600);
}

btn_propalQuestion.addEventListener('click', () =>{

    if(scoresQuizz.style.display === 'flex'){
        dispContainerScores()

        setTimeout(() => {
            AppContainerPropalQuestion()    
        }, 1750);
    } else if (soloGame_container.style.display === 'flex') {
        DispContainerSoloGame()
        btn_aloneGame.style.backgroundColor = 'rgb(60, 45, 135)'

        setTimeout(() => {
            AppContainerPropalQuestion()
            
        }, 1000);

    } else if (multiGame_container.style.display === 'flex') {
        dispContainerMultiGame()
        btn_multiplayerGame.style.backgroundColor = 'rgb(60, 45, 135)'

        setTimeout(() => {
            AppContainerPropalQuestion()
            
        }, 1000);

    }

})

btn_aloneGame.addEventListener('click', () =>{

    if(scoresQuizz.style.display === 'flex'){
        dispContainerScores()

        setTimeout(() => {
            AppContainerSoloGame()    
        }, 1750);
    } else if(formPropalQuizz.style.display === 'flex') {
        DispContainerPropalQuestion()
        btn_propalQuestion.style.backgroundColor = 'rgb(60, 45, 135)'

        setTimeout(() => {
            AppContainerSoloGame()
        }, 2600);
    } else if(multiGame_container.style.display === 'flex') {
        dispContainerMultiGame()
        btn_multiplayerGame.style.backgroundColor = 'rgb(60, 45, 135)'

        setTimeout(() => {
            AppContainerSoloGame()
            
        }, 1000);

    }
})

btn_multiplayerGame.addEventListener('click', () => {
    if(scoresQuizz.style.display === 'flex'){
        dispContainerScores()

        setTimeout(() => {
            AppContainerMultiGame()    
        }, 1750);
    }
    else if(formPropalQuizz.style.display === 'flex') {
        DispContainerPropalQuestion()
        btn_propalQuestion.style.backgroundColor = 'rgb(60, 45, 135)'

        setTimeout(() => {
            AppContainerMultiGame()
        }, 2600);
    } else if (soloGame_container.style.display === 'flex'){
        DispContainerSoloGame()
        btn_aloneGame.style.backgroundColor = 'rgb(60, 45, 135)'

        setTimeout(() => {
            AppContainerMultiGame()
            
        }, 1000);

    }
})


btn_returnHome.addEventListener('click', () => {
    window.location.href= " http://154.40.130.22:1112/sandbox/home"
})

let roundSoloGame = document.querySelector('#lab_DIV_71522')

function AppContainerSoloGame(){
    soloGame_container.style.display = 'flex'
    setTimeout(() => {
        roundSoloGame.style.marginLeft = 0 + '%'
        roundSoloGame.style.rotate = 0  + 'deg'
    }, 100);

}

function DispContainerSoloGame(){
    roundSoloGame.style.marginLeft = 150 + '%'
    roundSoloGame.style.rotate = 360 + 'deg'

    setTimeout(() => {
        soloGame_container.style.display = 'none'
    }, 1000);
}

let roundMultiGame = document.querySelector('#lab_DIV_89191')

function AppContainerMultiGame(){
    multiGame_container.style.display = 'flex'
    setTimeout(() => {
        roundMultiGame.style.marginLeft = 0 + '%'
        roundMultiGame.style.rotate = 0  + 'deg'
    }, 100);
}

function dispContainerMultiGame(){
    roundMultiGame.style.marginLeft = 160 + '%'
    roundMultiGame.style.rotate = 360 + 'deg'

    setTimeout(() => {
        multiGame_container.style.display = 'none'
    }, 1000);
}

                                    //* FONCTION RESET

function reset() {
    btn_aloneGame.style.marginRight = 130 +'%'
    btn_aloneGame.style.transition = ''
    btn_aloneGame.style.backgroundColor = 'rgb(60, 45, 135)'
    btn_returnHome.style.marginRight = 130 +'%'
    btn_returnHome.style.transition = ''
    btn_returnHome.style.backgroundColor = 'rgb(60, 45, 135)'
    btn_multiplayerGame.style.marginRight = 130 +'%'
    btn_multiplayerGame.style.transition = ''
    btn_multiplayerGame.style.backgroundColor = 'rgb(60, 45, 135)'
    btn_propalQuestion.style.marginRight = 130 +'%'
    btn_propalQuestion.style.transition = ''
    btn_propalQuestion.style.backgroundColor = 'rgb(60, 45, 135)'

    scoreDay.style.marginLeft = 130 + '%'
    scoreDay.style.transition = ''
    scoreMonth.style.marginLeft = 130 + '%'
    scoreMonth.style.transition = ''
    totalScore.style.marginLeft = 130 + '%'
    totalScore.style.transition = ''

    inptDifficulty_container.style.marginLeft = 170 + '%'
    inptReponse_container.style.marginLeft = 170 + '%'
    inptReponseD_container.style.marginLeft = 170 + '%'
    inptReponseC_container.style.marginLeft = 170 + '%'
    inptReponseB_container.style.marginLeft = 170 + '%'
    inptReponseA_container.style.marginLeft = 170 + '%'
    inptQuestion_container.style.marginLeft = 170 + '%'
    btn_propalQuestionQuizz.style.marginLeft = 170 + '%'

    scoresQuizz.style.display = 'flex'
    formPropalQuizz.style.display = 'none'
    soloGame_container.style.display = 'none'
    roundSoloGame.style.marginLeft = 150 + '%'
    roundSoloGame.style.rotate = 360 + 'deg'
    multiGame_container.style.display = 'none'
    roundMultiGame.style.marginLeft = 160 + '%'
    roundMultiGame.style.rotate = 360 + 'deg'

    title_propalQuestion.style.opacity = 0
    title_propalQuestion.style.transition = 0.5 + 's'
    

    animMenuQuizzBegin()
}

reset()