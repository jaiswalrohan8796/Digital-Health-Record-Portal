function endTreatmentHandler(event, healthID, TreatmentNo, treatmentID) {
    const item = document.getElementById(`${treatmentID}`);
    axios
        .post(
            `/doctor/dashboard/current/patient-end?healthID=${healthID}&treatmentNo=${TreatmentNo}`
        )
        .then((res) => {
            if (res.status) {
                item.remove();
            }
        });
}
