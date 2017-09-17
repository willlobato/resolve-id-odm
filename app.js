const fs = require('fs');

const FILE_CONFIGURATION = "configuration.json";

function loadConfiguration() {
    return new Promise(function(resolve, reject) {
        fs.readFile(FILE_CONFIGURATION, function(err, data) {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
    return config;
}

function getFiles(directory) {
    return new Promise(function(resolve, reject) {
        fs.readdir(directory, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
}

function resolveRegex(file, contentFile, config) {
    const uuid = config.files[file]['uuid'];
    const expression = config.files[file]['expression'];
    try {
        let regex = new RegExp(expression);
        let result = regex.exec(contentFile);
        result = result[1] + uuid + result[3];
        return result;
    } catch(e) {
        throw new Error(`Error to resolve regex ${uuid}`);
    }
}

async function main() {
    try {
        let config = await loadConfiguration();
        const files = await getFiles(config.directory);
        files.forEach(async function(fileName) {
            let path = config.directory + '/' + fileName;
            let contentFile = fs.readFileSync(path).toString();
            contentFile = resolveRegex(fileName, contentFile, config);
            fs.writeFileSync(path, contentFile);
        });
    } catch(e) {
        console.error(e);
    }
}

main();