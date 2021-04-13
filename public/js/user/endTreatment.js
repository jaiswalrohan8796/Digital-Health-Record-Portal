function endTreatmentHandler(doctorID, TreatmentNo, treatmentID) {
    const item = document.getElementById(`${treatmentID}`);
    axios
        .post(
            `/user/dashboard/current/patient-end?doctorID=${doctorID}&treatmentNo=${TreatmentNo}`
        )
        .then((res) => {
            if (res.status) {
                item.remove();
            }
        });
}
