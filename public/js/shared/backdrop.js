//backdrop js
const backdrop = document.querySelector(".backdrop");
const hamburger = document.querySelector("#hamburger input");
hamburger.addEventListener("change", function () {
    if (this.checked) {
        backdrop.style.display = "block";
    } else {
        backdrop.style.display = "none";
    }
});

backdrop.addEventListener("click", () => {
    backdrop.style.display = "none";
    hamburger.checked = false;
});
