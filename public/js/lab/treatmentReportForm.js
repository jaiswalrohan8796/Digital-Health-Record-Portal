console.log("running js");
const backdrop = document.querySelector(".backdrop");
const loader = document.querySelector(".cssload-box-loading");
const status = document.querySelector(".status");
const mess = document.querySelector("#mess");
const treatmentForm = document.querySelector("#treatmentForm");

treatmentForm.addEventListener("submit", (e) => {
    backdrop.style.display = "flex";
    loader.style.display = "inline-block";
    e.preventDefault();
    var formData = new FormData();
    formData.append(
        "submitDate",
        treatmentForm.elements.namedItem("submitDate").value
    );
    formData.append(
        "testName",
        treatmentForm.elements.namedItem("testName").value
    );
    formData.append(
        "treatmentNo",
        treatmentForm.elements.namedItem("treatmentNo").value
    );
    formData.append("remark", treatmentForm.elements.namedItem("remark").value);
    const healthID = document.getElementById("healthID").value;
    formData.append("healthID", healthID);
    var pdfFile = document.querySelector("#attachment");
    formData.append("attachment", pdfFile.files[0]);
    console.log(formData);
    axios
        .post("/lab/dashboard/treatment-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((data) => {
            console.log(data.data);
            backdrop.style.display = "none";
            loader.style.display = "none";
            if (data.data.status) {
                mess.innerHTML = `${data.data.mess}`;
                status.style.display = "flex";
                treatmentForm.reset();
            }
        })
        .catch((e) => {
            console.log(e);
        })
        .finally(() => {
            backdrop.style.display = "none";
            loader.style.display = "none";
        });
});
