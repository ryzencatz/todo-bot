const fs = require("node:fs");
const path = require("node:path");

const dataPath = path.join(__dirname, "data.json");

function loadData() {
    return JSON.parse(
        fs.readFileSync(dataPath, "utf8")
    );
}

function saveData(data) {
    fs.writeFileSync(
        dataPath,
        JSON.stringify(data, null, 4)
    );
}

module.exports = {
    loadData,
    saveData,
};