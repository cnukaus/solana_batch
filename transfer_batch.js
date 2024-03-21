//npm i @solana/web3.js
const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const dotenv = require('dotenv');
const myRpcUrl = "";
const mnemonic = process.env.MNE_SOLANA

// Load environment variables from .env file
dotenv.config();

const connection = new web3.Connection(
  //myRpcUrl
  web3.clusterApiUrl('mainnet-beta'),
  //web3.clusterApiUrl('mainnet-beta'),
  //'confirmed' skip tx simulation
);
const getBalance = async (publicKey) => {
  const balance = await connection.getBalance(publicKey);
  return balance;
};
//transferAllFund();


const sol = 1000000000; //lamports
// Set the minimum and maximum amount of SOL to be transferred in each transaction
const give_next = 0.003 * sol
const minAmount = Math.floor(give_next * 1.0);
; // Replace with your value for 'a'
const maxAmount = Math.floor(give_next * 1.1); // Replace with your value for 'b'

// Helper function to convert SOL to lamports
const solToLamports = (sol) => sol * web3.LAMPORTS_PER_SOL;

// Helper function to send a random amount of SOL from the first wallet to a given public key
const sendRandomAmount = async (fromKeypair, toPublicKey, prodFlag= true ) => {
  // Calculate a random amount of SOL to send

  const amountInSOL = Math.floor(Math.random() * (maxAmount - minAmount) + minAmount);//solToLamports(amountInSOL);
  const before_bal = await getBalance(fromKeypair.publicKey)
  console.log(`amount lamports:${amountInSOL} from ${fromKeypair.publicKey}, current bal is ${before_bal}`)
  
  // Create a transaction
  if (prodFlag) {
    const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amountInSOL,
    })
  );

  // Sign and send the transaction
  
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair],
      {
        skipPreflight: true,
      }
    );
    return {
      signature: signature,
      amount: amountInSOL,
      destination: toPublicKey.toBase58(),
    };
  
  }
  else {
    const signature ="";
    return {
      signature: signature,
      amount: amountInSOL,
      destination: toPublicKey.toBase58(),
    };
  }
  

};

const {generateSolanaKeypairs} = require('./generate_pk');
const {transferFund} = require('./give_to_7i');
const extractPrivateKeys = (keypairsList) => {

  console.log(keypairsList.map(keypair => keypair.publicKey));
  return keypairsList.map(keypair => keypair.privateKey);
};


const disperseFunds = async (privateKeys,prodFlag=True,send_from=0,receive_from = 1) => {
  const sourceKeypair = web3.Keypair.fromSecretKey(bs58.decode(privateKeys[send_from].privateKey))//privateKeys[0].keypair; // Your first wallet keypair
  const from_addr = new web3.PublicKey(privateKeys[send_from].publicKey)
  for (let i = receive_from; i < privateKeys.length; i++) {
    const destinationKey = new web3.PublicKey(privateKeys[i].publicKey); // The public key to send funds to
    console.log(`desti public key is ${destinationKey}`)
    try {

      const result = await sendRandomAmount(sourceKeypair, destinationKey,prodFlag);
      console.log(`${from_addr} Transferred ${result.amount.toFixed(6)} SOL to ${result.destination}; transaction signature: ${result.signature}`);
    } catch (error) {
      console.error(`${from_addr} Failed to transfer to ${destinationKey.toBase58()}: ${error.message}`);
    }
    
    // Optional: Add a delay between transfers to avoid rate limits or bans
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
};
const sub_list = extractPrivateKeys(generateSolanaKeypairs(mnemonic,4)).slice(2,5)
console.log(sub_list)
transferFund(sub_list)
//disperseFunds(generateSolanaKeypairs(mnemonic,3),prodFlag=true,send_from=0,receive_from=2)
