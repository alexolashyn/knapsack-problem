const { binaryToMessage, messageToBinary } = require("../middleware/binary");

const { modInverse, findSubsetSum } = require("../middleware/knapsack-helpers");

const encryption = ({ publicKey, message }) => {
  const binaryMessage = messageToBinary(message);

  const n = publicKey.length;
  const splitMessage = [];

  for (let i = 0; i < binaryMessage.length; i += n) {
    const pi = binaryMessage.slice(i, i + n);
    if (pi.length === n) {
      splitMessage.push(pi);
    } else {
      splitMessage.push(pi.padEnd(n, "0"));
    }
  }

  return splitMessage.map(function (pi) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += publicKey[i] * parseInt(pi[i]);
    }
    return sum;
  });
};

const decryption = ({ privateKey, message, multiplier, mod }) => {
  const inverse = modInverse(multiplier, mod);

  const pi = [];

  message.forEach((el) => {
    const target = (el * inverse) % mod;
    const subset = findSubsetSum(privateKey, target);

    for (let i = 0; i < privateKey.length; i += 1) {
      subset.includes(privateKey[i]) ? pi.push(1) : pi.push(0);
    }
  });
  return binaryToMessage(pi.join(""));
};

module.exports = { encryption, decryption };
