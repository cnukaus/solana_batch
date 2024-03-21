const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
  const nacl = require('tweetnacl');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
// Generate a random mnemonic (alternatively, you can use a predefined one)
const mnemonic = bip39.generateMnemonic();
//console.log("Mnemonic:", mnemonic);


const generateSolanaKeypairs = (mnemonic, size) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }
  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const getSOLKeypair = (seed, walletIndex) => {
    // BIP44 derivation path for Solana, the "walletIndex" will be the index of the wallet
    const derivationPath = `m/44'/501'/${walletIndex}'/0'`;

    // Derive a subkey at the specified index
    const { key } = derivePath(derivationPath, seed.toString('hex'));
    const keypair = nacl.sign.keyPair.fromSeed(key.slice(0, 32)); // Use the first 32 bytes for the Keypair

    return new Keypair({
      publicKey: keypair.publicKey,
      secretKey: keypair.secretKey
    });
  };

  // Generate ${size} private keys
  const privateKeys = [];
  for (let i = 0; i < size; i++) {
    const keypair = getSOLKeypair(seed, i);
    privateKeys.push({
      publicKey: keypair.publicKey.toBase58(), // Solana web3.js provides a method toBase58() for public keys
      privateKey: bs58.encode(keypair.secretKey) // Use bs58 to encode secret keys
    });
  }
  return privateKeys;
};
  // Log the first 5 keypairs to the console as an example
  //console.log(privateKeys.slice(0, size));
  module.exports = {
    generateSolanaKeypairs
  };