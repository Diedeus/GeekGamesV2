let camelize = function (str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}

class Happened {
    constructor(tag, id, parent) {
        this.tag = tag
        this.id = id
        this.parent = parent
    }

    // CREATE / SET / APPEND
    csa() {
        let taggued = document.createElement(this.tag)
        taggued.setAttribute('id', this.id)
        this.parent.appendChild(taggued)
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

class editInBS {
    constructor(object, field, value, uid) {
        this.object = object
        this.field = field
        this.value = value
        this.uid = uid
    }

    edit() {
        // Select in BS
        let nsObjectSelect = NS.getItem(this.object)

        // Parse object
        let nsObject = JSON.parse(nsObjectSelect)

        nsObject[this.field] = this.value

        NS.setItem(this.object, JSON.stringify(nsObject))
    }

    edit_one() {
        // Select in BS
        let bsObjectSelect = NS.getItem(this.object)

        // Parse object
        let bsObject =  JSON.parse(bsObjectSelect)

        // Fill the field with the value
        bsObject[this.field] = this.value

        NS.setItem(this.object,  JSON.stringify(bsObject))
    }
}

function getRootLayerChildren(collection) {
    let rootLayerChildren = [...collection]
    return rootLayerChildren.filter(x => x.nodeName != "")
}

function getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n)
    for (var p in v)
      n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p])
    return n
}

function elementsRenderer(id, parent, tagName, attributes, style, classes, text, path) {
    // READS FROM NAVIGATOR STRAGE
    let user = readBS('global', 'uid')
    let section = readBS('global', 'section')
    let appName = readBS('global', 'app')
    let env = readBS('global', 'env')

    let classesArray

    // SVG HANDLING
    if (tagName === "svg") {
        let svg = getNode("svg")
        svg.setAttributeNS(null, 'id', id)
        svg.setAttributeNS(null, 'viewBox', path.viewBox)
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

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
        if (Object.keys(path).find(k => k === 'defs') != undefined) {
            let defsElement = getNode('defs')

            path.defs.forEach(d => {
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

            let r = getNode('path')
            
            let allPathAttributesKeys = Object.keys(path.attributes)
            allPathAttributesKeys.forEach(key => {
                 r.setAttribute(key, path.attributes[key])
            })

            svg.append(r)

        } else {
            // WITHOUT DEFS
            let r = getNode('path')
            if (path.attributes != undefined) {                
                let allPathAttributesKeys = Object.keys(path.attributes)
                allPathAttributesKeys.forEach(key => {
                     r.setAttribute(key, path.attributes[key])
                })
            } else {
                r.setAttribute("d", path.path)
                r.setAttribute("fill", path.fill)
            }

            svg.append(r)
        } 

        rootLayer.appendChild(svg)
    }

    // OTHER ELEMENTS THAN SVG
    if (tagName != "svg") {
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
            if (env === "DEV") {            
                let webpPath = "../DB/USERS_FOLDERS/" + user + "/apps/" + appName + "/content/sections/" + section + "/img/" + id + ".webp"
                computedElement.src = webpPath
            }
            if (env === "PROD") {
                let webpPath = "/content/sections/" + section + "/img/" + id + ".webp"
                computedElement.src = webpPath
            }
        }

        if (text != "" && text != undefined && text != null) {
            computedElement.innerText = text
        }
        // if (tagName === "P" || tagName === "DIV") {
        //     computedElement.style.margin = 0
        //     computedElement.innerText = text
        // }



        if (tagName === "VIDEO") {
            let videoPath = "../DB/USERS_FOLDERS/" + user + "/apps/" + appName + "/content/sections/" + section + "/videos/" + id + ".mp4"
            computedElement.setAttribute("controls", 'controls')
            computedElement.src = videoPath
        }
    }

}

function featuresRenderer() {

    // READS FROM NAVIGATOR STRAGE
    let section = readBS('global', 'section')

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

function readNSWithoutFields(object) {
    if (NS.length != 0) {
        // Select in NS
        let nsObjectSelect = NS.getItem(object)
        // Parse object
        let nsObject = JSON.parse(nsObjectSelect)
        // RETURN JS OBJECT
        return nsObject

    }
}

function editInNS(objectName, object, field) {
    if (field === "" || field === undefined || field === null) {
        NS.setItem(objectName, JSON.stringify(object))
    }
}

function readBS(object, field) {
    if (NS.length != 0) {
        // Select in BS
        let nsObjectSelect = NS.getItem(object)

        // Parse object
        let nsObject = JSON.parse(nsObjectSelect)

        // Check user uid presence
        return nsObject[field]

    } else {
        console.log('The Browser storage is empty')
    }
}

function askSection(section) {
    if (section === 'home') {
        new editInBS("global", "section", "home").edit()
        window.open(window.location.protocol + "//" + window.location.host + "/", "_self")
    } else {
        new editInBS("global", "section", section).edit()
        window.open(window.location.protocol + "//" + window.location.host + "/" + section, "_self")
    }
}

