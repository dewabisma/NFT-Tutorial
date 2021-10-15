const path = require("path");
const dotenvPath = path.join(path.resolve(), "../", ".env");

require("dotenv").config({ path: dotenvPath });

const { API_URL, METAMASK_PUBLIC_KEY, METAMASK_PRIVATE_KEY } = process.env;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contract = require("../artifacts/contracts/myNFT.sol/MyNFT.json");

const web3 = createAlchemyWeb3(API_URL);

const contractAddress = "0x8a734efac07636d63303a6b0938d143981577534";

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(
    METAMASK_PUBLIC_KEY,
    "latest"
  ); //get latest nonce

  //the transaction
  const tx = {
    from: METAMASK_PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods
      .mintNFT(METAMASK_PUBLIC_KEY, tokenURI)
      .encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(
    tx,
    METAMASK_PRIVATE_KEY
  );
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmRcn5tweDmPVDw1gvTzu5SDPAgASmGv43ghr5D5Uaysmj"
);
