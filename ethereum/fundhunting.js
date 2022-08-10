import web3 from './web3';
import CompiledFundhunting from './build/Fundhunting.json';

// This file is created because anytime we want to tell web3 about a already deployed contract, we have to give web3 that contract's interface or abi. And abi is defined in the CollegeRating.json file after we compile our ethereum directory

const instance = new web3.eth.Contract( // This is our contract instance which refers to a perticular address.
    CompiledFundhunting.abi,
    '0x68879a3F7Cc8f05693DC90e3c578BBed18690c65'
);

export default instance;