const math = require("mathjs");

const findSubsetSum = (numbers, target, subset = [], index = 0) => {
  if (target === 0) {
    return subset;
  }

  if (target < 0 || index >= numbers.length) {
    return null;
  }

  let include = findSubsetSum(
    numbers,
    target - numbers[index],
    subset.concat(numbers[index]),
    index + 1,
  );

  if (include) return include;

  return findSubsetSum(numbers, target, subset, index + 1);
};

const modInverse = (multiplier, mod) => {
  for (let x = 1; x < mod; x++) {
    if (((multiplier % mod) * (x % mod)) % mod === 1) {
      return x;
    }
  }
};

const generateMultiplier = (mod) => {
  let multiplier;
  do {
    multiplier = Math.ceil(Math.random() * 100) + 1;
  } while (math.gcd(multiplier, mod) !== 1);

  return multiplier;
};

const generateMod = (privateKey) =>
  privateKey.reduce((a, b) => a + b, 0) + Math.ceil(Math.random() * 100) + 1;

const generateSuperIncreasingSequence = (length) => {
  const sequence = [];
  let sum = 0;

  for (let i = 0; i < length; i++) {
    const value = sum + 1 + Math.floor(Math.random() * 10);
    sequence.push(value);
    sum += value;
  }
  return sequence;
};

const seqValidation = (seq) => {
  let sum = seq[0];
  for (let i = 1; i < seq.length; i += 1) {
    if (seq[i] <= sum) {
      throw new Error("Provided sequence must be super increasing!");
    }
    sum += seq[i];
  }
};

const modValidation = (mod, seq) => {
  const sum = seq.reduce((a, b) => a + b, 0);
  if (mod <= sum) {
    throw new Error("Provided must must be bigger than sum of sequence!");
  }
};

const mulValidation = (mul, mod) => {
  if (math.gcd(mul, mod) !== 1) {
    throw new Error("Greatest common divisor for mul and mod must be equal 1!");
  }
};

module.exports = {
  findSubsetSum,
  modInverse,
  generateMod,
  generateMultiplier,
  generateSuperIncreasingSequence,
  seqValidation,
  modValidation,
  mulValidation,
};
