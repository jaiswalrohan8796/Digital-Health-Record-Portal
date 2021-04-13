function endTreatmentHandler(healthID, TreatmentNo) {
    console.log(healthID, TreatmentNo);
    axios
        .post(
            `/doctor/dashboard/current/patient-end?healthID=${healthID}&treatmentNo=${TreatmentNo}`
        )
        .then((res) => {
            console.log(res);
        });
}
