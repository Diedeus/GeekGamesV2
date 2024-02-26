
// GLOBAL INITIALISATIONS \

import { GLOBALS } from './GLOBALS.js'
                                                                                            // GLOBAL CONSTANTS
const __filename = GLOBALS.FILEPATH(import.meta.url)
const __dirname = GLOBALS.PATH.dirname(__filename)
const _ = GLOBALS.LODASH
const APP = new GLOBALS.EXPRESS()
const FS = GLOBALS.FS
const HTTP_SERVER = GLOBALS.HTTP.createServer(APP)
const WS = new GLOBALS.WS(HTTP_SERVER, {maxHttpBufferSize: Infinity})


                                                                                            // AUTHORIZED STATIC DIRECTORIES
APP.use(GLOBALS.NOCACHE())
APP.use('/', GLOBALS.EXPRESS.static(__dirname))
APP.use('/UI', GLOBALS.EXPRESS.static('UI'))
                                                                                            // ROUTE TO LOGIN
APP.get('/*', (req, res) => { res.sendFile(__dirname + '/index.html') })

WS.on('connection', function (socket) {
    socket.on('consulted', e => {
        if (e === "hidden") {
            socket.disconnect()
        }
    })

    socket.on("init", e => {
        const appObject = {}
        if (e.section != undefined && e.section != null && e.section != "") {
            appObject.section = e.section
        } else {
            appObject.section = 'home'
        }
        appObject.icon = false
        GLOBALS.GET_DIR_CON("/content/ressources/")
            .then(r => {
                let iconExistence = r.includes('appIcon.ico')
                if (iconExistence === true) {
                    appObject.icon = true
                }

                GLOBALS.GET_DIR_CON("/databases")
                    .then(d => {
                        appObject.databases = d
                        GLOBALS.FROM_JSON("/content/sections/" + appObject.section + "/elements.json")
                            .then(el => {
                                appObject.elements = el
                                GLOBALS.FROM_JSON("/content/sections/" + appObject.section + "/svg/svgPaths.json")
                                    .then(p => {
                                        appObject.paths = p
                                        GLOBALS.DIR_EX("/content/ressources/", "medias")
                                            .then(ex => {
                                                if (ex === true) {
                                                    GLOBALS.GET_DIR_CON("/content/ressources/medias")
                                                        .then(m => {
                                                            if (m.length === 0) {
                                                                socket.emit('renderApp', appObject)
                                                            } else {
                                                                GLOBALS.GET_ALL_MEDIAS("/content/ressources/medias")
                                                                    .then((mediaLists) => {
                                                                        appObject.mediaLists = mediaLists
                                                                        socket.emit('renderApp', appObject)
                                                                    })
                                                                    .catch((error) => {
                                                                        console.error(error)
                                                                    })
                                                            }
                                                        })
                                                } else {
                                                    GLOBALS.NEW_DIRS(["/content/ressources/medias"], e.uid)
                                                        .then(() => {
                                                            GLOBALS.GET_ALL_MEDIAS("/content/ressources/medias")
                                                                .then((mediaLists) => {
                                                                    appObject.mediaLists = mediaLists
                                                                    socket.emit('renderApp', appObject)
                                                                })
                                                                .catch((error) => {
                                                                    console.error(error)
                                                                })
                                                        })
                                                }
                                            })
                                    })
                            })
                    })
            })
    })
})

HTTP_SERVER.listen(7777, () => {})
