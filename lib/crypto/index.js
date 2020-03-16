"use strict";
/**
 * @module crypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var secure_random_1 = tslib_1.__importDefault(require("secure-random"));
var bech32_1 = tslib_1.__importDefault(require("bech32"));
var crypto_browserify_1 = tslib_1.__importDefault(require("crypto-browserify"));
var uuid_1 = tslib_1.__importDefault(require("uuid"));
var is_js_1 = tslib_1.__importDefault(require("is_js"));
var bip32 = tslib_1.__importStar(require("bip32"));
var bip39 = tslib_1.__importStar(require("bip39"));
var elliptic_1 = require("elliptic");
var tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
var utils_1 = require("../utils");
// secp256k1 privkey is 32 bytes
var PRIVKEY_LEN = 32;
var MNEMONIC_LEN = 256;
var DECODED_ADDRESS_LEN = 20;
var CURVE = "secp256k1";
//hdpath
var HDPATH = "44'/714'/0'/0/";
var ec = new elliptic_1.ec(CURVE);
/**
 * Decodes an address in bech32 format.
 * @param {string} value the bech32 address to decode
 */
exports.decodeAddress = function (value) {
    var decodeAddress = bech32_1.default.decode(value);
    return Buffer.from(bech32_1.default.fromWords(decodeAddress.words));
};
/**
 * Checks whether an address is valid.
 * @param {string} address the bech32 address to decode
 * @param {string} hrp the prefix to check for the bech32 address
 * @return {boolean}
 */
exports.checkAddress = function (address, hrp) {
    try {
        if (!address.startsWith(hrp)) {
            return false;
        }
        var decodedAddress = bech32_1.default.decode(address);
        var decodedAddressLength = exports.decodeAddress(address).length;
        if (decodedAddressLength === DECODED_ADDRESS_LEN &&
            decodedAddress.prefix === hrp) {
            return true;
        }
        return false;
    }
    catch (err) {
        return false;
    }
};
/**
 * Encodes an address from input data bytes.
 * @param {string} value the public key to encode
 * @param {*} prefix the address prefix
 * @param {*} type the output type (default: hex)
 */
exports.encodeAddress = function (value, prefix, type) {
    if (prefix === void 0) { prefix = "tbnb"; }
    if (type === void 0) { type = "hex"; }
    var words;
    if (Buffer.isBuffer(value)) {
        words = bech32_1.default.toWords(Buffer.from(value));
    }
    else {
        words = bech32_1.default.toWords(Buffer.from(value, type));
    }
    return bech32_1.default.encode(prefix, words);
};
/**
 * Generates 32 bytes of random entropy
 * @param {number} len output length (default: 32 bytes)
 * @returns {string} entropy bytes hexstring
 */
exports.generatePrivateKey = function (len) {
    if (len === void 0) { len = PRIVKEY_LEN; }
    return utils_1.ab2hexstring(secure_random_1.default(len));
};
/**
 * Generates an arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 * @returns {ArrayBuffer}
 */
exports.generateRandomArray = function (length) {
    return secure_random_1.default(length);
};
/**
 * @param {string} publicKey - Encoded public key
 * @return {Elliptic.PublicKey} public key hexstring
 */
exports.getPublicKey = function (publicKey) {
    var keyPair = ec.keyFromPublic(publicKey, "hex");
    return keyPair.getPublic();
};
/**
 * Calculates the public key from a given private key.
 * @param {string} privateKeyHex the private key hexstring
 * @return {string} public key hexstring
 */
exports.getPublicKeyFromPrivateKey = function (privateKeyHex) {
    if (!privateKeyHex || privateKeyHex.length !== PRIVKEY_LEN * 2) {
        throw new Error("invalid privateKey");
    }
    var curve = new elliptic_1.ec(CURVE);
    var keypair = curve.keyFromPrivate(privateKeyHex, "hex");
    var unencodedPubKey = keypair.getPublic().encode("hex", false);
    return unencodedPubKey;
};
/**
 * PubKey performs the point-scalar multiplication from the privKey on the
 * generator point to get the pubkey.
 * @param {Buffer} privateKey
 * @return {Elliptic.PublicKey} PubKey
 * */
exports.generatePubKey = function (privateKey) {
    var curve = new elliptic_1.ec(CURVE);
    var keypair = curve.keyFromPrivate(privateKey);
    return keypair.getPublic();
};
/**
 * Gets an address from a public key hex.
 * @param {string} publicKeyHex the public key hexstring
 * @param {string} prefix the address prefix
 */
exports.getAddressFromPublicKey = function (publicKeyHex, prefix) {
    var pubKey = ec.keyFromPublic(publicKeyHex, "hex");
    var pubPoint = pubKey.getPublic();
    var compressed = pubPoint.encodeCompressed();
    var hexed = utils_1.ab2hexstring(compressed);
    var hash = utils_1.sha256ripemd160(hexed); // https://git.io/fAn8N
    var address = exports.encodeAddress(hash, prefix);
    return address;
};
/**
 * Gets an address from a private key.
 * @param {string} privateKeyHex the private key hexstring
 */
exports.getAddressFromPrivateKey = function (privateKeyHex, prefix) {
    return exports.getAddressFromPublicKey(exports.getPublicKeyFromPrivateKey(privateKeyHex), prefix);
};
/**
 * Generates a signature (64 byte <r,s>) for a transaction based on given private key.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string | Buffer} privateKey - The private key.
 * @return {Buffer} Signature. Does not include tx.
 */
exports.generateSignature = function (signBytesHex, privateKey) {
    var msgHash = utils_1.sha256(signBytesHex);
    var msgHashHex = Buffer.from(msgHash, "hex");
    var signature = tiny_secp256k1_1.default.sign(msgHashHex, typeof privateKey === "string" ? Buffer.from(privateKey, "hex") : privateKey);
    return signature;
};
/**
 * Verifies a signature (64 byte <r,s>) given the sign bytes and public key.
 * @param {string} sigHex - The signature hexstring.
 * @param {string} signBytesHex - Unsigned transaction sign bytes hexstring.
 * @param {string} publicKeyHex - The public key.
 * @return {boolean}
 */
exports.verifySignature = function (sigHex, signBytesHex, publicKeyHex) {
    var publicKey = Buffer.from(publicKeyHex, "hex");
    if (!tiny_secp256k1_1.default.isPoint(publicKey))
        throw new Error("Invalid public key provided");
    var msgHash = utils_1.sha256(signBytesHex);
    var msgHashHex = Buffer.from(msgHash, "hex");
    return tiny_secp256k1_1.default.verify(msgHashHex, publicKey, Buffer.from(sigHex, "hex"));
};
/**
 * Generates a keystore object (web3 secret storage format) given a private key to store and a password.
 * @param {string} privateKeyHex the private key hexstring.
 * @param {string} password the password.
 * @return {object} the keystore object.
 */
exports.generateKeyStore = function (privateKeyHex, password) {
    var salt = crypto_browserify_1.default.randomBytes(32);
    var iv = crypto_browserify_1.default.randomBytes(16);
    var cipherAlg = "aes-256-ctr";
    var kdf = "pbkdf2";
    var kdfparams = {
        dklen: 32,
        salt: salt.toString("hex"),
        c: 262144,
        prf: "hmac-sha256"
    };
    var derivedKey = crypto_browserify_1.default.pbkdf2Sync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, "sha256");
    var cipher = crypto_browserify_1.default.createCipheriv(cipherAlg, derivedKey.slice(0, 32), iv);
    if (!cipher) {
        throw new Error("Unsupported cipher");
    }
    var ciphertext = Buffer.concat([
        cipher.update(Buffer.from(privateKeyHex, "hex")),
        cipher.final()
    ]);
    var bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext]);
    return {
        version: 1,
        id: uuid_1.default.v4({
            random: crypto_browserify_1.default.randomBytes(16)
        }),
        crypto: {
            ciphertext: ciphertext.toString("hex"),
            cipherparams: {
                iv: iv.toString("hex")
            },
            cipher: cipherAlg,
            kdf: kdf,
            kdfparams: kdfparams,
            // mac must use sha3 according to web3 secret storage spec
            mac: utils_1.sha3(bufferValue.toString("hex"))
        }
    };
};
/**
 * Gets a private key from a keystore given its password.
 * @param {string} keystore the keystore in json format
 * @param {string} password the password.
 */
exports.getPrivateKeyFromKeyStore = function (keystore, password) {
    if (!is_js_1.default.string(password)) {
        throw new Error("No password given.");
    }
    var json = is_js_1.default.object(keystore) ? keystore : JSON.parse(keystore);
    var kdfparams = json.crypto.kdfparams;
    if (kdfparams.prf !== "hmac-sha256") {
        throw new Error("Unsupported parameters to PBKDF2");
    }
    var derivedKey = crypto_browserify_1.default.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, "hex"), kdfparams.c, kdfparams.dklen, "sha256");
    var ciphertext = Buffer.from(json.crypto.ciphertext, "hex");
    var bufferValue = Buffer.concat([derivedKey.slice(16, 32), ciphertext]);
    // try sha3 (new / ethereum keystore) mac first
    var mac = utils_1.sha3(bufferValue.toString("hex"));
    if (mac !== json.crypto.mac) {
        // the legacy (sha256) mac is next to be checked. pre-testnet keystores used a sha256 digest for the mac.
        // the sha256 mac was not compatible with ethereum keystores, so it was changed to sha3 for mainnet.
        var macLegacy = utils_1.sha256(bufferValue.toString("hex"));
        if (macLegacy !== json.crypto.mac) {
            throw new Error("Keystore mac check failed (sha3 & sha256) - wrong password?");
        }
    }
    var decipher = crypto_browserify_1.default.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 32), Buffer.from(json.crypto.cipherparams.iv, "hex"));
    var privateKey = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ]).toString("hex");
    return privateKey;
};
/**
 * Generates mnemonic phrase words using random entropy.
 */
exports.generateMnemonic = function () {
    return bip39.generateMnemonic(MNEMONIC_LEN);
};
/**
 * Validates mnemonic phrase words.
 * @param {string} mnemonic the mnemonic phrase words
 * @return {bool} validation result
 */
exports.validateMnemonic = bip39.validateMnemonic;
/**
 * Get a private key from mnemonic words.
 * @param {string} mnemonic the mnemonic phrase words
 * @param {Boolean} derive derive a private key using the default HD path (default: true)
 * @param {number} index the bip44 address index (default: 0)
 * @param {string} password according to bip39
 * @return {string} hexstring
 */
exports.getPrivateKeyFromMnemonic = function (mnemonic, derive, index, password) {
    if (derive === void 0) { derive = true; }
    if (index === void 0) { index = 0; }
    if (password === void 0) { password = ""; }
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("wrong mnemonic format");
    }
    var seed = bip39.mnemonicToSeedSync(mnemonic, password);
    if (derive) {
        var master = bip32.fromSeed(seed);
        var child = master.derivePath(HDPATH + index);
        if (!child.privateKey) {
            throw new Error("child does not have a privateKey");
        }
        return child.privateKey.toString("hex");
    }
    return seed.toString("hex");
};
//# sourceMappingURL=index.js.map