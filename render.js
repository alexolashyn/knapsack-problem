const isNotValidComponent = function (value) {
  return typeof value === "object"
    ? value.some((element) => Number.isNaN(element) || element <= 1)
    : Number.isNaN(value);
};

const getIntegerValue = (element) => Number.parseInt(element.val());

$(document).ready(() => {
  const submitButton = $("#submit-button");
  const changeButton = $("#change-button");
  const operationSelect = $("#select-operation");
  const generateButton = $("#generate-key-button");
  const inputButton = $("#input-key-button");

  inputButton.click(() => {
    const privateKey = $("#seq")
      .val()
      .split(" ")
      .map((element) => {
        return Number.parseInt(element);
      });
    if (isNotValidComponent(privateKey)) {
      return alert("Seq-value must consist only of natural integers!");
    }
    const mod = getIntegerValue($("#mod"));
    if (isNotValidComponent(mod)) {
      return alert("Mod-value must consist only of integers!");
    }
    const multiplier = getIntegerValue($("#mul"));
    if (isNotValidComponent(mul)) {
      return alert("Multiplier-value must consist only of integers!");
    }

    localStorage.setItem(
      "key",
      JSON.stringify({ privateKey, mod, multiplier }),
    );

    window.electronAPI.inputKey({ privateKey, mod, multiplier });
  });

  window.electronAPI.getInputKey((value) => {
    const { message, publicKey } = value;
    if (message) {
      alert(message);
      return;
    }

    const key = JSON.parse(localStorage.getItem("key"));
    key["publicKey"] = publicKey;
    localStorage.setItem("key", JSON.stringify(key));
  });

  generateButton.click(() => {
    const n = getIntegerValue($("#n"));
    if (isNotValidComponent(n) || n < 2) {
      return alert("N must be natural number!");
    }
    window.electronAPI.generateKey(n);
  });

  window.electronAPI.getGeneratedKey((res) => {
    localStorage.setItem("key", JSON.stringify(res));
  });

  changeButton.click(() => {
    const input = $("#input").val();
    const output = $("#output").val();

    if (input && output) {
      $("#input").val(output);
      $("#output").val("");

      return operationSelect.val(
        operationSelect.val() === "dec" ? "en" : "dec",
      );
    }

    return alert(
      "You cannot execute this command when one of the fields is empty!",
    );
  });

  submitButton.click(() => {
    if (operationSelect.val() === "en") {
      const publicKey = JSON.parse(localStorage.getItem("key")).publicKey;

      const message = $("#input").val();
      if (publicKey && message) {
        return window.electronAPI.algorithm({
          publicKey,
          message,
          operation: "en",
        });
      }
      return alert("You must provide public key and data for encryption!");
    }
    if (operationSelect.val() === "dec") {
      const { privateKey, mod, multiplier } = JSON.parse(
        localStorage.getItem("key"),
      );
      const message = $("#input")
        .val()
        .split(" ")
        .map((element) => {
          return parseInt(element);
        });
      if (privateKey && message && multiplier && mod) {
        return window.electronAPI.algorithm({
          privateKey,
          message,
          multiplier,
          mod,
          operation: "dec",
        });
      }
      return alert(
        "You must provide public key, mod, multiplier and data for encryption!",
      );
    }
  });

  window.electronAPI.algorithmResult((value) => {
    if (typeof value === "string") {
      $("#output").val(value);
      return;
    }
    $("#output").val(value.join(" "));
  });

  window.electronAPI.openFile((value) => {
    $(".message").empty();
    $("#input").val(value);
  });

  window.electronAPI.saveFile(() => {
    window.electronAPI.dataToSave($("#output").val());
  });

  window.electronAPI.createFile(() => {
    window.electronAPI.dataToSave($("#input").val());
  });
});
