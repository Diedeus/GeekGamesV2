import { GLOBALS } from '../GLOBALS.js'

const directoryPath = process.argv[2]

const processFile = (filePath) => {
    return GLOBALS.FS.readFile(filePath, 'utf-8')
        .then(content => {
            const regex = /\.\.\/DB\/USERS_FOLDERS\/[^/]+\/apps\/[^/]+(\/content\/sections\/home[^"]+)/g;

            let newContent = content;
            let match;
            while ((match = regex.exec(content)) !== null) {
                newContent = newContent.replace(match[0], match[1]);
            }

            if (newContent !== content) {
                return GLOBALS.FS.writeFile(filePath, newContent, 'utf-8');
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la lecture ou de la modification du fichier "${filePath}": ${error}`);
        });
}

const traverseDirectory = (dirPath) => {
    return GLOBALS.FS.readdir(dirPath)
        .then(files => {
            const promises = files.map(file => {
                const fullPath = GLOBALS.PATH.join(dirPath, file)
                return GLOBALS.FS.stat(fullPath).then(stat => {
                    if (stat.isDirectory()) {
                        return traverseDirectory(fullPath);
                    } else if (file === 'elements.json') {
                        return processFile(fullPath);
                    }
                });
            });

            return Promise.all(promises);
        })
        .catch(error => {
            console.error(`Erreur lors du parcours du répertoire "${dirPath}": ${error}`)
        })
}

traverseDirectory(GLOBALS.CDIR + directoryPath)
    .then(() => {
        console.log('Routes Formatted')
    })
    .catch(error => {
        console.error('Erreur lors du traitement :', error)
    })