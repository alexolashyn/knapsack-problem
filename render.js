const isNotValidComponent = function (value) {
  return typeof value === "object"
    ? value.some((element) => Number.isNaN(element) || element <= 1)
    : Number.isNaN(value);
};

const getIntegerValue = (element) => Number.parseInt(element.val());

const setAlert = function (alert, isSuccess) {

  $('body').prepend(`<div class="alert ${isSuccess && 'success-alert'}"><div>${alert}</div></div>`);
}

const removeAlert = function () {
  $('.alert').remove();
}

$(document).ready(() => {
  const submitButton = $("#submit-button");
  const changeButton = $("#change-button");
  const operationSelect = $("#select-operation");
  const generateButton = $("#generate-key-button");
  const inputButton = $("#input-key-button");

  inputButton.click(() => {
    localStorage.clear()
    const privateKey = $("#seq")
      .val()
      .split(" ")
      .map((element) => {
        return Number.parseInt(element);
      });
    if (isNotValidComponent(privateKey)) {
      setAlert("Seq-value must consist only of natural integers!");
      return setTimeout(removeAlert, 3000);
    }
    const mod = getIntegerValue($("#mod"));
    if (isNotValidComponent(mod)) {
      setAlert("Mod-value must consist only of integers!");
      return setTimeout(removeAlert, 3000);
    }
    const multiplier = getIntegerValue($("#mul"));
    if (isNotValidComponent(multiplier)) {
      setAlert("Multiplier-value must consist only of integers!");
      return setTimeout(removeAlert, 3000);
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
      setAlert(message);
      return setTimeout(removeAlert, 3000);
    }

    const key = JSON.parse(localStorage.getItem("key"));
    key["publicKey"] = publicKey;
    localStorage.setItem("key", JSON.stringify(key));
    setAlert("Key was successfully assigned!", true);
    return setTimeout(removeAlert, 3000);
  });

  generateButton.click(() => {
    localStorage.clear()
    const n = getIntegerValue($("#n"));
    if (isNotValidComponent(n) || n < 2) {
      setAlert("N must be natural number!");
      return setTimeout(removeAlert, 3000);
    }
    window.electronAPI.generateKey(n);
  });

  window.electronAPI.getGeneratedKey((res) => {
    localStorage.setItem("key", JSON.stringify(res));
    setAlert("Key was successfully generated!", true);
    return setTimeout(removeAlert, 3000);

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

    setAlert(
        "You cannot execute this command when one of the fields is empty!",
    );
    return setTimeout(removeAlert, 3000);
  });

  submitButton.click(() => {
    if (operationSelect.val() === "en") {
      const key = localStorage.getItem("key")

      if(!key) {
        setAlert(
            "You must generate or input key before operation start!",
        );
        return setTimeout(removeAlert, 3000);
      }

      const publicKey = JSON.parse(key).publicKey;

      const message = $("#input").val();
      if (publicKey && message) {
        return window.electronAPI.algorithm({
          publicKey,
          message,
          operation: "en",
        });
      }
      setAlert(
          "You must generate or input key correctly before operation start!",
      );
      return setTimeout(removeAlert, 3000);
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
