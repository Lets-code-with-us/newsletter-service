import fs from "fs"


export const readFile = ()=>{
    const data = fs.readFileSync('./sample.csv','utf-8')
    console.log(data)
}

readFile()