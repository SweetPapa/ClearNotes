const fs = require('fs');

function saveToFileAsync(jData){
    let data = JSON.stringify(jData, null, 2);

    fs.writeFile('test.json', data, (err) => {
        if (err) throw err;
        // console.log('Data written to file');
    });
}

function readFromFileSync(renderFn){
    fs.readFile("test.json", (err, data)=>{
        if (err) console.log(err);
        let jData =  JSON.parse(data)
        renderFn.send("jsonNotes", jData);
        console.log(jData)
    })
}


module.exports = {
    saveToFileAsync,
    readFromFileSync
}