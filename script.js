document.addEventListener("DOMContentLoaded", () => {

    // Mobile navigation
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("navLinks");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");

            const isOpen = navLinks.classList.contains("active");
            hamburgerBtn.setAttribute("aria-expanded", isOpen);
        });
    }


    // Contact form
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        return;
    }

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    const fullNameError = document.getElementById("fullNameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const messageError = document.getElementById("messageError");

    const successAlert = document.getElementById("successAlert");


    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        // Remove previous errors
        fullName.classList.remove("error");
        email.classList.remove("error");
        phone.classList.remove("error");
        message.classList.remove("error");

        fullNameError.classList.remove("active");
        emailError.classList.remove("active");
        phoneError.classList.remove("active");
        messageError.classList.remove("active");

        // Remove previous success message
        successAlert.classList.remove("active");


        // Get values
        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim();
        const phoneValue = phone.value.trim();
        const messageValue = message.value.trim();

        let isValid = true;


        // Validate name
        if (nameValue === "") {
            fullName.classList.add("error");
            fullNameError.classList.add("active");
            isValid = false;
        }


        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            email.classList.add("error");
            emailError.classList.add("active");
            isValid = false;
        }


        // Validate phone
        if (phoneValue === "") {
            phone.classList.add("error");
            phoneError.classList.add("active");
            isValid = false;
        }


        // Validate message
        if (messageValue === "") {
            message.classList.add("error");
            messageError.classList.add("active");
            isValid = false;
        }


        // Stop if validation fails
        if (!isValid) {
            return;
        }


        // Send data to backend
        try {

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: nameValue,
                    email: emailValue,
                    phone: phoneValue,
                    message: messageValue
                })
            });


            const result = await response.json();


            if (result.success) {

                // Clear the form
                contactForm.reset();

                // Show success message
                successAlert.textContent =
                    "Thank you! Your enquiry has been submitted successfully.";

                successAlert.classList.add("active");

            } else {

                alert(result.message || "Something went wrong.");

            }

        } catch (error) {

            console.error("Error:", error);

            alert(
                "Unable to submit your enquiry. Please make sure the server is running."
            );
        }

    });

});