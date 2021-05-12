console.log("running js");
const backdrop = document.querySelector(".backdrop");
const loader = document.querySelector(".cssload-box-loading");
const status = document.querySelector(".status-wrap");
const mess = document.querySelector("#mess");
const treatmentForm = document.querySelector("#treatmentForm");
const generalForm = document.querySelector("#generalForm");

treatmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    backdrop.style.display = "flex";
    loader.style.display = "inline-block";
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
            window.scrollTo(0, 0);
            backdrop.style.display = "none";
            loader.style.display = "none";
            if (data.data.status) {
                mess.innerHTML = `${data.data.mess}`;
                status.style.display = "flex";
                treatmentForm.reset();
            } else {
                mess.innerHTML = `Try again`;
                status.style.display = "flex";
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

generalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    backdrop.style.display = "flex";
    loader.style.display = "inline-block";
    var formData = new FormData();
    formData.append(
        "submitDate",
        generalForm.elements.namedItem("submitDate").value
    );
    formData.append(
        "testName",
        generalForm.elements.namedItem("testName").value
    );
    const treatmentNo2 = document.querySelector("#treatmentNo2");
    formData.append("treatmentNo", treatmentNo2.value);
    formData.append("remark", generalForm.elements.namedItem("remark").value);
    const healthID = document.getElementById("healthID").value;
    formData.append("healthID", healthID);
    var pdfFile2 = document.querySelector("#attachment2");
    formData.append("attachment", pdfFile2.files[0]);
    console.log(formData);
    axios
        .post("/lab/dashboard/general-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((data) => {
            console.log(data.data);
            window.scrollTo(0, 0);
            backdrop.style.display = "none";
            loader.style.display = "none";
            if (data.data.status) {
                mess.innerHTML = `${data.data.mess}`;
                status.style.display = "flex";
                generalForm.reset();
            } else {
                mess.innerHTML = `Try again`;
                status.style.display = "flex";
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
