const backdrop = document.querySelector(".backdrop");
const loader = document.querySelector(".cssload-box-loading");
const status = document.querySelector(".status-wrap");
const mess = document.querySelector("#mess");

function endTreatmentHandler(event, healthID, TreatmentNo, treatmentID) {
    backdrop.style.display = "flex";
    loader.style.display = "inline-block";
    const item = document.getElementById(`${treatmentID}`);
    axios
        .post(
            `/doctor/dashboard/current/patient-end?healthID=${healthID}&treatmentNo=${TreatmentNo}`
        )
        .then((res) => {
            if (res.data.status) {
                backdrop.style.display = "none";
                loader.style.display = "none";
                item.remove();
            }
            if (res.data.data) {
                mess.innerHTML = `${res.data.data}`;
                status.style.display = "flex";
            } else {
                mess.innerHTML = `Try again`;
                status.style.display = "flex";
            }
        })
        .catch((e) => {
            console.log(e);
            mess.innerHTML = `Try again`;
            status.style.display = "flex";
        })
        .finally(() => {
            window.scrollTo(0, 0);
            backdrop.style.display = "none";
            loader.style.display = "none";
            setTimeout(() => {
                status.style.display = "none";
            },3000);
        });
}
