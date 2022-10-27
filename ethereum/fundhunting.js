import web3 from './web3';
import CompiledFundhunting from './build/Fundhunting.json';

// This file is created because anytime we want to tell web3 about a already deployed contract, we have to give web3 that contract's interface or abi. And abi is defined in the CollegeRating.json file after we compile our ethereum directory

const instance = new web3.eth.Contract( // This is our contract instance which refers to a perticular address.
    CompiledFundhunting.abi,
    '0x54fa59B0108481236004E068783d1E620846F49f'
);

export default instance;