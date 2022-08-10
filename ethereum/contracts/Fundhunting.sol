// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Fundhunting{

    address FundhuntingDirector = 0x51459DD83df6b28FbDc24873fB23485d19f3F6ac;

    struct Bid{
        uint amount;
        string equity;
        string bidPlacer;
    }

    // mapping(address => string[]) public posts; // (user => posts by user).
    mapping(string => Bid[]) public bids; // (filename => bids on that file).

    function payVideoUploadingFee() public payable returns(bool){
        require(msg.value >= 0.001 ether);

        payable (FundhuntingDirector).transfer(msg.value);

        // posts[msg.sender].push(filename);

        return true;

    }

    function placeBid(
        string memory filename,
        uint amount,
        string memory equity,
        string memory bidPlacer
        ) public payable returns (bool) {
        require(msg.value >= 0.001 ether);

        payable (FundhuntingDirector).transfer(msg.value);

        Bid memory newBid = Bid({
            amount: amount,
            equity: equity,
            bidPlacer: bidPlacer
        });

        bids[filename].push(newBid);

        return true;
    }

    function getPlacedBids(string memory filename) public view returns (Bid[] memory){
        return bids[filename];
    }

    // function registerAccount(
    //     string memory username, string memory email, string memory password , string[] memory emptyArray //Much like RAM, Memory in Solidity is a temporary place to store data whereas Storage holds data between function calls
    // ) public returns(bool){
    //     User memory newUser = User({
    //         username: username,
    //         email: email,
    //         password: password,
    //         posts: emptyArray
    //     });

    //     userData[msg.sender] = newUser;
    //     return(true);

    // }

    

}