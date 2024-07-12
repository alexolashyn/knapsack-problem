const messageToBinary = (message) => {
  return message
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join("");
};

const binaryToMessage = (binary) => {
  let result = "";
  for (let i = 0; i < binary.length; i += 8) {
    let decimal = parseInt(binary.substring(i, i + 8), 2);
    result += String.fromCharCode(decimal);
  }
  return result;
};

module.exports = {
  messageToBinary,
  binaryToMessage,
};
