document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch("backend/save_contact.php", {
        method: "POST",
        body: formData,
    })
    .then(res => res.text())
    .then(data => {
        const status = document.getElementById("formStatus");
        if (data.trim() === "success") {
            status.textContent = "Message sent successfully!";
            form.reset();
        } else {
            status.textContent = "Error: " + data;
        }
    })
    .catch(err => {
        document.getElementById("formStatus").textContent = "Something went wrong!";
    });
});
