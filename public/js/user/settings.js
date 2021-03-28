var profileinputs = document.querySelectorAll(".profileinput");
const profilesaveButton = document.getElementById("profilesaveButton");
var medicalinputs = document.querySelectorAll(".medicalinput");
const medicalsaveButton = document.getElementById("medicalsaveButton");

profileinputs.forEach((profileinput) => {
    profileinput.disabled = true;
});
var isprofileInputDisabled = true;

medicalinputs.forEach((medicalinput) => {
    medicalinput.disabled = true;
});
var ismedicalInputDisabled = true;

const enableprofileEdit = () => {
    if (isprofileInputDisabled) {
        profileinputs.forEach((profileinput) => {
            profileinput.disabled = false;
        });
        isprofileInputDisabled = false;
        profilesaveButton.style.display = "inline";
    } else {
        profileinputs.forEach((profileinput) => {
            profileinput.disabled = true;
        });
        isprofileInputDisabled = true;
        profilesaveButton.style.display = "none";
    }
    console.log("enable input function called");
};
const enableMedicalEdit = () => {
    if (ismedicalInputDisabled) {
        medicalinputs.forEach((medicalinput) => {
            medicalinput.disabled = false;
        });
        ismedicalInputDisabled = false;
        medicalsaveButton.style.display = "inline";
    } else {
        medicalinputs.forEach((medicalinput) => {
            medicalinput.disabled = true;
        });
        ismedicalInputDisabled = true;
        medicalsaveButton.style.display = "none";
    }
    console.log("enable input function called");
};
