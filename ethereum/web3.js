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
        "https://rinkeby.infura.io/v3/212a17f42b494d30b3cb8b53e8e5761c"
    );
    web3 = new Web3(provider);
}

export default web3;
