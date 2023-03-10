// Author: Lucas Almeida
// Server for translating phrases between english, spanish, and german


// Tests:
// http://localhost:5000/translate/e2g/yellow+airplane
// http://localhost:5000/translate/e2g/absolutely+loud+big+blizzard
// http://localhost:5000/translate/g2e/klein+stadt
// http://localhost:5000/translate/e2s/orange+drink
// http://localhost:5000/translate/s2e/conseguilbe+atalaya
// http://localhost:5000/translate/s2g/negro+azul
// http://localhost:5000/translate/g2s/gelb
// http://localhost:5000/translate/g2s/gelb+flugzeug
// http://localhost:5000/translate/e2s/friend


const express = require('express');
const fs = require('fs');

englishToSpanish = {};
englishToGerman = {};
spanishToEnglish = {};
germanToEnglish = {};
spanishToGerman = {};
germanToSpanish = {};


// processes a file and adds the translations to the translation object
// Params: fileName - the name of the file to process
//         translationObject - the object to add the translations to
function processFile(fileName, translationObject , shouldInverse) {
    const data = fs.readFileSync('./' + fileName, 'utf8');

    // split the line into english and translation
    let lineArr = data.split('\n');
    // ignore comments with #
    lineArr = lineArr.filter(line => line[0] !== '#');
    lineArr = lineArr.filter(line => line !== '');
    // split each line into english and translation
    
    lineArr = lineArr.map(line => line.replace('\r', ' '));

    lineArr = lineArr.map(line => line.split('\t'));
    // lowercase both english and translation
    lineArr = lineArr.map(line => [line[0].toLowerCase(), line[1].toLowerCase()]);
    // keep word only until first non alphabet/nonwhitespace character
    lineArr = lineArr.map(line => [line[0], line[1].split(/[^a-zA-Z �]/)[0].trim()]);

    

    // lowercase both english and translation
    lineArr = lineArr.map(line => [line[0].toLowerCase(), line[1].toLowerCase()]);


    // console.log(lineArr);
    

    // map the english to translation
    if (shouldInverse) {
        lineArr.forEach(line => translationObject[line[1]] = line[0]);
    } else {
        lineArr.forEach(line => translationObject[line[0]] = line[1]);
    }
    
}

// translates a phrase from english to another language
// Params: phrase - the phrase to translate
//         translationObject - the object that maps english to the other language
// Returns: the translated phrase
function translatePhrase(phrase, translationObject) {
    // split the phrase into words
    let words = phrase.split('+');
    // console.log(translationObject[words[0]]);
    // translate each word
    words = words.map(word => translationObject[word] || '?');
    // join the words back together
    return words.join(' ');
}



function main() {
    // process the files
    processFile('Spanish.txt', englishToSpanish, false);
    processFile('German.txt', englishToGerman, false);
    
    // create the reverse translations
    // spanish to english
    processFile('Spanish.txt', spanishToEnglish, true);
    // german to english
    processFile('German.txt', germanToEnglish, true);
    
    // create german to spanish and vice versa
    for (let k in englishToGerman) {
        germanToSpanish[englishToGerman[k]] = englishToSpanish[k];
    }
    for (let k in englishToSpanish) {
        spanishToGerman[englishToSpanish[k]] = englishToGerman[k];
    }
    
  
}

main();
const port = 5000;
const app = express();
app.use(express.static('public_html'));

app.get('/translate/:type/:phrase', (req, res) => {
    const translationType = req.params.type;
    const phrase = req.params.phrase;

    // grab the correct translation
    let translation;
    switch (translationType) {
        case 'e2s':
            translation = translatePhrase(phrase, englishToSpanish);
            break;
        case 'e2g':
            translation = translatePhrase(phrase, englishToGerman);
            break;
        case 's2e':
            translation = translatePhrase(phrase, spanishToEnglish);
            break;
        case 's2g':
            translation = translatePhrase(phrase, spanishToGerman);
            break;
        case 'g2e':
            translation = translatePhrase(phrase, germanToEnglish);
            break;
        case 'g2s':
            translation = translatePhrase(phrase, germanToSpanish);
            break;
        default:
            translation = phrase.replaceAll('+', ' ');
    }
    res.send(translation);
});




app.listen(port, () => console.log('Server started at http://localhost:' + port));


