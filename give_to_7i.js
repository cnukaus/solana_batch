//npm i @solana/web3.js
const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const dotenv = require('dotenv');



// Load environment variables from .env file
dotenv.config();

const connection = new web3.Connection(
  web3.clusterApiUrl('mainnet-beta'),
  'confirmed'
);

// Assuming PRIVATE_KEYS is a comma-separated list of private keys
const privateKeys = process.env.PRIVATE_KEYS.split(',');
const recipientAddress = 'HbHy5B5P4Z9awKGn6ouzrkFxst1JZ4dHtrPu593K7S13'//'71vBsieyUAbzyt3kaupPEVQ1GX3XB4PvuupNDZb3rFbE' //process.env.RECIPIENT_ADDRESS;



const recipientPublicKey = new web3.PublicKey(recipientAddress);

const sol = 1000000000;
const transferAmount = 0.0001;
const transferAmountLamports = transferAmount * sol;

const getBalance = async (publicKey) => {
  const balance = await connection.getBalance(publicKey);
  return balance;
};

const transfer = async (fromWallet, toPublicKey, lamports) => {
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toPublicKey,
      lamports,
    })
  );

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );

  return signature;
};

const transferFund = async (privateKeys) => {
  /*if (!privateKeys || privateKeys.length === 0 || !recipientAddress) {
    console.error('Missing PRIVATE_KEYS or RECIPIENT_ADDRESS in the .env file');
    process.exit(1);
  }*/
  console.log(typeof(privateKeys))
  for (const privateKey of privateKeys) {
    try {
      const fromWallet = web3.Keypair.fromSecretKey(bs58.decode(privateKey));
      const balance = await getBalance(fromWallet.publicKey);

      if (balance < transferAmountLamports) {
        console.log(`Wallet with publicKey ${fromWallet.publicKey.toBase58()} does not have enough balance to transfer`);
      } else {
        const signature = await transfer(fromWallet, recipientPublicKey, transferAmountLamports);
        console.log(`Wallet with publicKey ${fromWallet.publicKey.toBase58()} transferred ${transferAmount} SOL to ${recipientAddress}`);
        console.log('SIGNATURE', signature);
      }
      
      // Add a delay before the next transfer (adjust as needed)
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the delay if necessary
    } catch (error) {
      console.error('Error during transfer: ' + error.message);
    }
  }
};

transferFund();
module.exports={
  transferFund,
}