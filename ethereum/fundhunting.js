import web3 from './web3';
import CompiledFundhunting from './build/Fundhunting.json';

// This file is created because anytime we want to tell web3 about a already deployed contract, we have to give web3 that contract's interface or abi. And abi is defined in the CollegeRating.json file after we compile our ethereum directory

const instance = new web3.eth.Contract( // This is our contract instance which refers to a perticular address.
    CompiledFundhunting.abi,
    '0xfD3DCD8318bD4be9c2d34E2048f73b1745870194'
);

export default instance;