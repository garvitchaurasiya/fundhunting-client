const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // This will delete the folder if it exists.


const FundhuntingPath = path.resolve(__dirname, 'contracts', 'Fundhunting.sol');
const source = fs.readFileSync(FundhuntingPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Fundhunting.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

fs.ensureDirSync(buildPath); //As we have deleted the 'build' folder above we have to create it before writing something into it. ensureDir checks if a folder with this path exists and if it doesn't it will create it for us.

var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Fundhunting.sol'].Fundhunting;
fs.outputJsonSync( // It will write some json file to the specified directory.
  path.resolve(buildPath, 'Fundhunting' + '.json'),
  output // This second argument is the content we want to write into the file
);
