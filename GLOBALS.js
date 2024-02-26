
import          { fileURLToPath }       from 'url'
import          path                    from 'path'
import          fs                      from 'fs-extra'
import          express                 from 'express'
import          http                    from 'http'
import          { Server }              from 'socket.io'
import           nocache                from 'nocache'
import          archiver                from 'archiver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function directoryExistence(path, dir) {
    try {
        const dirs = await fs.readdir(__dirname + path)
        return dirs.includes(dir)
    } catch (err) {
        throw err
    }
}

async function getParsedJson(path) {
    try {
        const jsonString = await fs.readFile(__dirname + path, 'utf8')
        const parsedString = JSON.parse(jsonString)
        return parsedString
    } catch (err) {
        throw err
    }
}

async function getLanguageData(lng) {
    try {

        let lngPath
        const findFr = new RegExp('fr', "i")
        const findRu = new RegExp('ru', "i")
        const findEn = new RegExp('en', "i")

        if (lng.match(findFr)) {
            lngPath = '/D/R/LNG/fr.json'
        }
        if (lng.match(findRu)) {
            lngPath = '/D/R/LNG/ru.json'
        }
        if (lng.match(findEn)) {
            lngPath = '/D/R/LNG/en.json'
        }
        if (lng.match(findFr) == null && lng.match(findEn) == null && lng.match(findRu) == null) {
            lngPath = '/D/R/LNG/en.json'
        }

        const jsonString = await fs.readFile(__dirname + lngPath, 'utf8')
        const parsedString = JSON.parse(jsonString)
        return parsedString
    } catch (err) {
        throw err
    }
}

async function createDirs(paths) {
    try {
        const dirsCreation = paths.map(path => fs.mkdir(__dirname + path, { recursive: true }))
        await Promise.all(dirsCreation)
    } catch (err) {
        throw err
    }
}

async function getDirContent(path) {
    try {
        const content = await fs.readdir(__dirname + path)
        return content
    } catch (err) {
        throw err
    }
}

async function getAllMediaLists(path) {
    const mediaLists = []
    try {
        const mainContent = await getDirContent(path)

        if (mainContent.length === 0) {
            return [mediaLists]
        }

        const mediaListPromises = mainContent.map(async (listName) => {
            const files = await getDirContent(path + '/' + listName)
            const mediaList = {
                listName: listName,
                files: files,
            };
            return mediaList
        });

        return Promise.all(mediaListPromises)
    } catch (err) {
        throw err
    }
}

const GLOBALS = {
    FILEPATH           : fileURLToPath,
    PATH               : path,
    FS                 : fs,
    EXPRESS            : express,
    HTTP               : http,
    WS                 : Server,
    NOCACHE            : nocache,
    FROM_JSON          : getParsedJson,
    DIR_EX             : directoryExistence,
    NEW_DIRS           : createDirs,
    GET_DIR_CON        : getDirContent,
    GET_ALL_MEDIAS     : getAllMediaLists,
    LNG                : getLanguageData,
    ARCHIVE            : archiver,
    CDIR               : __dirname
}

export { GLOBALS }
