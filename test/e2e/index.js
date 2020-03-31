var myArgs = process.argv.slice(2);
const fs = require('fs');
const path = require('path');

const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const getPath = relativePath => path.join(__dirname, relativePath)
const originDirName = 'origin'
const compareDirName = 'compare'
const diffDirName = '__diff_output__'

let filename = myArgs[0]
let originFilepath = getPath(`./${originDirName}/${filename}.png`)
let comapreFilepath = getPath(`./${compareDirName}/${filename}.png`)

try {
    if (fs.existsSync(originFilepath) && fs.existsSync(comapreFilepath)) {
        const img1 = PNG.sync.read(fs.readFileSync(originFilepath));
        const img2 = PNG.sync.read(fs.readFileSync(comapreFilepath));
        const { width, height } = img1;
        const diff = new PNG({ width, height });

        pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
        if (!fs.existsSync(getPath(`./${originDirName}/${diffDirName}`))) {
            fs.mkdirSync(getPath(`./${originDirName}/${diffDirName}`))
        }
        let diffFilepath = getPath(`./${originDirName}/${diffDirName}/${filename}.png`)
        fs.writeFileSync(diffFilepath, PNG.sync.write(diff));
    }
} catch (err) {
    console.error(err)
}
