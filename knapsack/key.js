const {
  generateMod,
  generateMultiplier,
  generateSuperIncreasingSequence,
  seqValidation,
  modValidation,
  mulValidation,
} = require("../middleware/knapsack-helpers");
const generateKeys = (length) => {
  const privateKey = generateSuperIncreasingSequence(length);
  const mod = generateMod(privateKey);
  const multiplier = generateMultiplier(mod);

  const publicKey = privateKey.map((weight) => (weight * multiplier) % mod);

  return { privateKey, publicKey, mod, multiplier };
};

const inputKeys = ({ privateKey, mod, multiplier }) => {
  try {
    seqValidation(privateKey);
    modValidation(mod, privateKey);
    mulValidation(multiplier, mod);
    const publicKey = privateKey.map((weight) => (weight * multiplier) % mod);
    return { publicKey, message: null };
  } catch (error) {
    return { publicKey: null, message: error.message };
  }
};

module.exports = { generateKeys, inputKeys };
