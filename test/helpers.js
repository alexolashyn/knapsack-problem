const assert = require("assert");

const { messageToBinary, binaryToMessage } = require("../middleware/binary");
const { findSubsetSum, modInverse } = require("../middleware/knapsack-helpers");

describe("Middleware functions", () => {
  it("should convert message to binary", () => {
    const text = "hello, world!";

    const result = messageToBinary(text);
    assert.equal(
      result,
      "01101000011001010110110001101100011011110010110000100000011101110110111101110010011011000110010000100001",
    );
  });

  it("should convert binary to message", () => {
    const text =
      "01101000011001010110110001101100011011110010110000100000011101110110111101110010011011000110010000100001";

    const result = binaryToMessage(text);
    assert.equal(result, "hello, world!");
  });

  it("should find subset by provided sum", () => {
    const numbers = [1, 2, 4, 10, 20, 40];
    const target = 17;
    const result = findSubsetSum(numbers, target);
    assert.deepStrictEqual(result[0], 1);
  });

  it("should find mod inverse", () => {
    const a = 31;
    const mod = 110;

    const result = modInverse(31, 110);
    assert.equal(result, 71);
  });
});
