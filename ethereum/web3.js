import Web3 from "web3";

let web3;

// Window will be undefined when nextjs tries to do server site rendering.
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        "https://sepolia.infura.io/v3/f2d8f3681edc4ae99f2ea03ae71effdd"
    );
    web3 = new Web3(provider);
}

export default web3;
