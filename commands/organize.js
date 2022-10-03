let fs = require('fs')
let path = require('path')
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]

}
function organizeFn(dirPath) {
    // console.log("organize command implemented for",dirPath);
    // 1. input-> directory path given
    let destPath;
    if (dirPath == undefined) {
        // console.log("Kindly enter the path");
        dirPath=process.cwd()
        destPath = path.join(dirPath,"organized_file")
        fs.mkdirSync(destPath)
        organizeHelper(dirPath,destPath)

        return
    } else {
        let doesExist = fs.existsSync(dirPath) // returns true if dirPath provided exists else returns false
        if (doesExist) {
            // 2. create-> organized_files -> directory
            destPath = path.join(dirPath, "organized_file");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
            else
                console.log(`File with name ${path.basename(destPath)} already exists`);
        }
        else {
            console.log("Kindly enter the correct path");
            return
        }
    }
    organizeHelper(dirPath, destPath)

    // 3. Identify categories of all the files    present in  that input directory
    //4. copy/cut files to that organized directory inside of any of category folder


}

function organizeHelper(src, dest) {
    // 3. Identify categories of all the files    present in  that input directory
    let childNames = fs.readdirSync(src) // returns the name of all the files and folders present in the src directory
    let childAddress
    for (let e in childNames) {
        childAddress = path.join(src, childNames[e]); // Here join is used to return the exact location of the file
        let isFile = fs.lstatSync(childAddress).isFile(); // If the file is present then will return true
        if (isFile) {
            // console.log(childNames[e]);
            let category = getCategory(childNames[e])
            // console.log(childNames[e],"belongs to --->",category);
            //4. copy/cut files to that organized directory inside of any of category folder

            sendFiles(childAddress, dest, category);// Here we are sending the files present in the download folder to destination on the basis of category
        }
    }

}

function sendFiles(srcFilePath, dest, category) {
    //1.)create the category files in the organized folder
    let categorypath = path.join(dest, category)
    //   console.log(categorypath);

    if (fs.existsSync(categorypath) == false) {
        fs.mkdirSync(categorypath);
    }

    let fileName = path.basename(srcFilePath)
    let destFilePath = path.join(categorypath, fileName)
    fs.copyFileSync(srcFilePath, destFilePath);
    //   fs.unlinkSync(srcFilePath)//To cut the files and paste 
    //   console.log(fileName,"copied to ",category);

}

//return the category of file present int he src folder on the basis of types
function getCategory(name) {
    let ext = path.extname(name)// to get the extension of the file
    ext = ext.slice(1)// coz in types value are not in . format
    for (let type in types) {
        let cTypeArray = types[type]
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others"
}

module.exports = {
    organizeKey: organizeFn
}