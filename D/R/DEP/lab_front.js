const socket = io()
let viewPortMode, history = window.history, historyObject, computed_body, sectionElementsObject, contextElement, uploadingConfig, rootLayer, cursorData = ``, lab_lng_data
const bs = window.localStorage

function lab_local_storage_object_set(key, value) {
    if (!key || !value) return null

    localStorage.setItem(key, JSON.stringify(value))
    return value
}

function lab_local_storage_object(key) {
    const item = bs.getItem(key)
    return item ? JSON.parse(item) : null
}

function lab_local_storage_object_update(key, modifications) {
    const item = lab_local_storage_object(key)

    if (item) {
        for (let prop in modifications) {
            if (modifications.hasOwnProperty(prop)) {
                item[prop] = modifications[prop]
            }
        }

        localStorage.setItem(key, JSON.stringify(item))
        return item
    }

    return null
}

function getRootLayerChildren(collection) {
    let rootLayerChildren = [...collection]
    return rootLayerChildren.filter(x => x.nodeName != "")
}

document.addEventListener('DOMContentLoaded', from => {
    computed_body = document.querySelector('body')
    computed_body.style.margin = 0
    computed_body.style.overflow = "hidden"
    computed_body.style.width = 100 + "svw"
    computed_body.style.height = 100 + "svh"
    rootLayer = computed_body
    viewPortMode = window.innerWidth < window.innerHeight ? 'portrait' : 'paysage'
    let currentSection = location.pathname.split('/')[1]

    if (bs.length === 0) {
        const target = from.target
        localStorageGlobalObject = {
            charset: target.charset,
            lng: navigator.language,
            space: { x: window.innerWidth, y: window.innerHeight },
            viewPortMode: viewPortMode,
            fullscreen: target.fullscreen,
            visibilityState: target.visibilityState,
            fullscreenAllowed: target.fullscreenEnabled,
            connected: false,
            env: "PROD",
            section : currentSection || "home",
            path: "/"
        }

        bs.setItem('global', JSON.stringify(localStorageGlobalObject))
        socket.emit("init", localStorageGlobalObject)
    }

    else {
        lab_local_storage_object_update('global', {viewPortMode: window.innerWidth < window.innerHeight ? 'portrait' : 'paysage'})
        const GLOB = lab_local_storage_object('global')
        GLOB.section = currentSection || 'home'
        socket.emit("init", GLOB)
    }

    computed_body.addEventListener('dragover', e => {
        e.preventDefault()
    })

    computed_body.addEventListener('dragstart', e => {
        e.preventDefault()
        holded = true
    })
})

document.addEventListener('visibilitychange', event => {
    const GLOB = JSON.parse(bs.getItem('global'))
    GLOB.section = location.pathname.split('/')[2]
    bs.setItem("global", JSON.stringify(GLOB))

    socket.emit('consulted', document.visibilityState)
    if (document.visibilityState === 'hidden') {
        socket.disconnect()
    }
    if (document.visibilityState === 'visible') {
        socket.connect()
    }
})

window.addEventListener('focus', function() {
    const GLOB = JSON.parse(bs.getItem('global'))
    GLOB.section = location.pathname.split('/')[2]
    bs.setItem("global", JSON.stringify(GLOB))

    let refocusElements = [...computed_body.children]
    refocusElements.forEach(e => {
        e.style.filter = ''
    })
})

window.addEventListener('resize', e => {
    const ctxObject = lab_local_storage_object('global')
    let initialResizedVPM = lab_local_storage_object('global').viewPortMode
    lab_local_storage_object_update('global', { space: { x: window.innerWidth, y: window.innerHeight } })
    lab_local_storage_object_update('global', { viewPortMode: window.innerWidth < window.innerHeight ? 'portrait' : 'paysage' })

    let vpmState = lab_local_storage_object('global').viewPortMode
    if (initialResizedVPM != vpmState) {
        location.reload()
    }
})

let camelize = function (str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}

function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n)
    for (var p in v)
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) { return "-" + m.toLowerCase(); }), v[p])
    return n
}

function elementsRenderer(id, parent, tagName, attributes, style, classes, text, shape, textArray) {
    // READS FROM NAVIGATOR STRAGE
    const userLSG = lab_local_storage_object('global')
    let user = userLSG.uid
    let section = userLSG.section

    // SVG HANDLING
    if (tagName === "svg") {
        let svg = getNode("svg")
        svg.setAttributeNS(null, 'id', id)
        attributes.forEach(a => {
            if (a.attributeName != "xmlns" || a.attributeName != "xmlns:xlink") {
                svg.setAttribute(a.attributeName, a.attributeValue)
            } else {
                svg.setAttributeNS(null, a.attributeName, a.attributeValue)
            }
        })

        // STYLES SECTION
        let onlyStyles = {}

        for (let [key, val] of Object.entries(style.style)) {
            if (key != 'id') {
                onlyStyles[key] = val
            }
        }

        for (let [key, val] of Object.entries(onlyStyles)) {
            let camelKey = camelize(key)
            svg.style[camelKey] = val
        }

        // END STYLES SECTION

        if (classes != undefined) {
            svg.setAttributeNS(null, 'class', classes)
        }

        // WITH DEFS
        if (Object.keys(shape).find(k => k === 'defs') != undefined) {
            let defsElement = getNode('defs')

            shape.defs.forEach(d => {
                let defNode = getNode(d.name)
                defNode.setAttribute("id", d.attributes.id)
                let attrKeys = Object.keys(d.attributes)
                attrKeys.forEach(k => {
                    // console.log(k, d.attributes[k])
                    if (d.attributes[k] != '' && k != "id") {
                        defNode.setAttributeNS("http://www.w3.org/2000/svg", k, d.attributes[k])
                    }
                })

                defsElement.appendChild(defNode)

                d.children.forEach(c => {
                    let defNodeChild = document.createElementNS("http://www.w3.org/2000/svg", c.name)
                    let attrKeysChild = Object.keys(c.attributes)

                    attrKeysChild.forEach(k => {
                        if (k === "stop-color") {
                            defNodeChild.setAttribute(k, c.attributes[k])
                        } else {
                            defNodeChild.setAttribute(k, c.attributes[k])
                        }
                    })

                    defNode.appendChild(defNodeChild)
                })
            })

            svg.appendChild(defsElement)
            let r = getNode(shape.name)
            let allShapeAttributesKeys = Object.keys(shape.attributes)
            allShapeAttributesKeys.forEach(key => {
                r.setAttribute(key, shape.attributes[key])
            })
            svg.append(r)
        } else {
            // WITHOUT DEFS
            shape.forEach(p => {
                let r = getNode(p.name)
                let allShapeAttributesKeys = Object.keys(p.attributes)
                allShapeAttributesKeys.forEach(key => {
                    r.setAttribute(key, p.attributes[key])
                })
                svg.append(r)
            })
        }

        if (parent === undefined) {
            rootLayer.appendChild(svg)
        } else {
            document.querySelector('#' + parent).appendChild(svg)
        }
    }

    // OTHER ELEMENTS THAN SVG
    if (tagName != "svg" && tagName != "SPAN") {
        let toAppend
        if (parent === undefined) {
            toAppend = new Happened(tagName, id, rootLayer)
        } else {
            toAppend = new Happened(tagName, id, document.querySelector('#' + parent))
        }

        toAppend.csa()
        toAppend.styler(id, style.style)
        let computedElement = toAppend.get()

        if (classes != undefined) {
            computedElement.className = classes
            classesArray = classes.split(' ')
        }

        if (attributes != undefined) {
            attributes.forEach(attr => {
                computedElement.setAttribute(attr.attributeName, attr.attributeValue)
            })
        }

        if (tagName === "IMG") {
            const existingSrc = attributes.find(x => x.attributeName === "src")
            if (existingSrc != undefined) {
                computedElement.src = existingSrc.attributeValue
            } else {
                let webpPath = "/content/sections/" + section + "/img/" + id + ".webp"
                computedElement.src = webpPath
            }
        }

        if (text != "" && text != undefined && text != null) {
            computedElement.innerText = text
        } else {
            if (typeof textArray === "object" && textArray.length > 0) {
                textArray.sort((a, b) => a.pos - b.pos)
                let positions = 0
                textArray.forEach(n => {
                    if (n.node === "text") {
                        let textNodeElement = document.createTextNode(n.textContent)
                        computedElement.insertBefore(textNodeElement, computedElement.childNodes[positions])
                        positions++
                    }

                    if (n.node === "BR") {
                        let brNodeElement = document.createElement('BR')
                        computedElement.insertBefore(brNodeElement, computedElement.childNodes[positions])
                        positions++
                    }

                    if (n.node === "SPAN") {
                        let textSpanElement = document.createElement('SPAN')
                        textSpanElement.style = n.style
                        textSpanElement.innerText = n.textContent
                        computedElement.insertBefore(textSpanElement, computedElement.childNodes[positions])
                        positions++
                    }
                })
            }
        }

        if (tagName === "VIDEO") {
            let videoPath = "/content/sections/" + section + "/videos/" + id + ".mp4"
            computedElement.setAttribute("controls", 'controls')
            computedElement.src = videoPath
        }
    }

}

function featuresRenderer() {

    // READS FROM NAVIGATOR STRAGE
    let section = lab_local_storage_object('global').section

    let scriptFilePresence = document.querySelector('#currentFeatures')

    if (scriptFilePresence === null || scriptFilePresence === undefined || scriptFilePresence === "") {
        let createFeatureScript = new Happened('script', 'currentFeatures', computed_body)
        createFeatureScript.csa()
        let computedFeatureScript = createFeatureScript.get()
        computedFeatureScript.src = "/content/sections/" + section + "/features.js"
    } else {
        scriptFilePresence.remove()
        let createFeatureScript = new Happened('script', 'currentFeatures', computed_body)
        createFeatureScript.csa()
        let computedFeatureScript = createFeatureScript.get()
        computedFeatureScript.src = "/content/sections/" + section + "/features.js"
    }
}

function renderApplication(app) {
    let rootLayerElements = getRootLayerChildren(computed_body.children)
    rootLayerElements.forEach(el => {
        el.remove()
    })

    try {
        let stylesCheck = document.querySelector('#appStyles')
        if (stylesCheck === null) {
            let appStylesElement = new Happened('link', 'appStyles', document.head)
            appStylesElement.csa()
            let computedAppStyles = appStylesElement.get()
            computedAppStyles.setAttribute('rel', 'stylesheet')
            computedAppStyles.href = "/content/ressources/style.css"
        }
    } catch (error) {

    }

    let findIcon = [...document.head.children].find(s => s.rel === 'shortcut icon')

    if (app.icon === true) {
        findIcon.href = "/content/ressources/appIcon.ico"
    }

    let currentGlobalStorage = lab_local_storage_object('global')

    lab_local_storage_object_update("global", {"section" : app.section})
    const elements = app.elements[currentGlobalStorage.viewPortMode]
    let path

    async function renderParents() {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.tagName === 'svg') {
                path = app.paths.find(x => x.id === element.id.split("SVG")[0])
                if (path === undefined) {
                    path = app.paths.filter(p => p.parent === element.id)
                }
            }
            if (element.style.parent === undefined) {
                elementsRenderer(element.id, element.style.parent, element.tagName, element.attributes, element.style, element.classes, element.style.text, path, element.style.textArray)
            }
        }
    }

    renderParents().then(() => {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.tagName === 'svg') {
                path = app.paths.find(x => x.id === element.id.split("SVG")[0])
                if (path === undefined) {
                    path = app.paths.filter(p => p.parent === element.id)
                }
            }

            if (element.style.parent != undefined && element.style.parent != null && element.style.parent != "") {
                elementsRenderer(element.id, element.style.parent, element.tagName, element.attributes, element.style, element.classes, element.style.text, path, element.style.textArray)
            }
        }
    })

    if (app.configuration && app.configuration.scripts && app.configuration.scripts.length > 0) {
        let promises = []

        app.configuration.scripts.forEach(s => {
            let name = s.split('.')[0]
            let scriptFilePresence = document.querySelector('#' + name)
            let loadScript = new Promise((resolve, reject) => {
                if (scriptFilePresence === null || scriptFilePresence === undefined || scriptFilePresence === "") {
                    let createScriptElement = new Happened('script', name, computed_body)
                    createScriptElement.csa()
                    let computedScript = createScriptElement.get()
                    computedScript.type = 'text/javascript'
                    computedScript.src = "/content/ressources/scripts/" + s

                    computedScript.onload = () => resolve()
                    computedScript.onerror = () => reject()
                } else {
                    scriptFilePresence.remove()
                    let createScriptElement = new Happened('script', name, computed_body)
                    createScriptElement.csa()
                    let computedScript = createScriptElement.get()
                    computedScript.src = "/content/ressources/scripts/" + s

                    computedScript.onload = () => resolve()
                    computedScript.onerror = () => reject()
                }
            })

            promises.push(loadScript)
        })

        Promise.all(promises)
            .then(() => {
                featuresRenderer()
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des scripts : ", error)
            })
    } else {
        featuresRenderer()
    }
}

socket.on('renderApp', appObject => {
    sectionElementsObject = appObject
    renderApplication(appObject)
})

function askSection(section) {
    if (section === 'home') {
        new editInBS("global", "section", "home").edit()
        window.open(window.location.protocol + "//" + window.location.host + "/", "_self")
    } else {
        new editInBS("global", "section", section).edit()
        window.open(window.location.protocol + "//" + window.location.host + "/" + section, "_self")
    }
}

class Happened {
    constructor(tag, id, parent) {
        this.tag = tag
        this.id = id
        this.parent = parent
    }

    // CREATE / SET / APPEND
    csa(insertBefore) {
        let taggued = document.createElement(this.tag)
        taggued.setAttribute('id', this.id)
        if (insertBefore === true) {
            this.parent.insertBefore(taggued, this.parent.firstChild)
        } else {
            this.parent.appendChild(taggued)
        }
    }

    span(span, parentTextNode) {
        let taggued = document.createElement(this.tag)
        taggued.setAttribute('id', this.id)
        let contenuTexte = parentTextNode.firstChild.nodeValue
        let referencePosition = contenuTexte.indexOf(span.textValue)
        let partieAvant = parentTextNode.firstChild.splitText(referencePosition)

    }

    addClass(c, id) {
        let select = document.querySelector('#' + id)

        select.setAttribute('class', c)
    }

    get() {
        let select = document.querySelector('#' + this.id)
        return select
    }

    styler(i, parametersArray) {
        let select = document.querySelector('#' + i)
        let onlyStyles = {}

        for (let [key, val] of Object.entries(parametersArray)) {
            if (key != 'id') {
                onlyStyles[key] = val
            }
        }

        for (let [key, val] of Object.entries(onlyStyles)) {
            let camelKey = camelize(key)
            select.style[camelKey] = val
        }
    }
}