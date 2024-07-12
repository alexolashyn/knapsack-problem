const assert = require("assert");
const { inputKeys } = require("../knapsack/key");
const { encryption } = require("../knapsack/knapsack");

describe("Knapsack algorithm", () => {
  it("should correctly generate public key", () => {
    const privateKey = [6, 11, 25];
    const mod = 126;
    const multiplier = 17;
    const result = inputKeys({ privateKey, mod, multiplier });
    assert.deepStrictEqual(result.publicKey, [102, 61, 47]);
  });

  it("should correctly encrypt message", () => {
    const message = "Hello";
    const publicKey = [6, 27, 51];
    const result = encryption({ publicKey, message });
    assert.deepStrictEqual(
      result,
      [27, 27, 0, 33, 27, 57, 57, 6, 78, 78, 0, 33, 84, 6],
    );
  });
});
