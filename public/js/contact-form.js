
document.getElementById("contactForm").onsubmit = () => {

    clearErrors();

    let isValid = true;
    
    // Validate first name
    let firstName = document.getElementById("firstName").value.trim();
    if(!firstName) {
        document.getElementById("err-firstName").style.display = "block";
        isValid = false;
    }

    // Validate last name
    let lastName = document.getElementById("lastName").value.trim();
    if(!lastName) {
        document.getElementById("err-lastName").style.display = "block";
        isValid = false;
    }

    // Validate email
    let emailAddress = document.getElementById("emailAddress").value.trim();
    let mailingList = document.getElementById("mailingList");
    
    // Check if mailing list is checked - if so, email is required
    if(mailingList.checked && !emailAddress) {
        document.getElementById("err-emailAddress").textContent = "Email is required when subscribing to mailing list";
        document.getElementById("err-emailAddress").style.display = "block";
        isValid = false;
    }
    
    // If email is provided (regardless of mailing list), validate format
    else if(emailAddress) {
        // Using regex to validate email format
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(emailAddress)) {
            document.getElementById("err-emailAddress").textContent = "Email must contain @ and a dot (.)";
            document.getElementById("err-emailAddress").style.display = "block";
            isValid = false;
        }
    }

    // Validate LinkedIn URL
    let linkedinUrl = document.getElementById("linkedinUrl").value.trim();
    if(linkedinUrl && !linkedinUrl.startsWith("https://linkedin.com/in/")) {
        document.getElementById("err-linkedinUrl").style.display = "block";
        isValid = false;
    }

    // Validate "How did we meet" dropdown
    let howDidWeMeet = document.getElementById("howDidWeMeet").value;
    if(howDidWeMeet === "") {
        document.getElementById("err-howDidWeMeet").style.display = "block";
        isValid = false;
    }

    return isValid;

}

/* Clear all error messages when form is submitted */
function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}