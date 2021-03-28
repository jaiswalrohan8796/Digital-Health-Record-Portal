var inputs = document.querySelectorAll(".profile input");
const saveButton = document.getElementById("saveButton");

inputs.forEach((input) => {
    input.disabled = true;
});
var isInputDisabled = true;

const enableEdit = () => {
    if (isInputDisabled) {
        inputs.forEach((input) => {
            input.disabled = false;
        });
        isInputDisabled = false;
        saveButton.style.display = "inline";
    } else {
        inputs.forEach((input) => {
            input.disabled = true;
        });
        isInputDisabled = true;
        saveButton.style.display = "none";
    }
    console.log("enable input function called");
};
