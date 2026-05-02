export async function init(): Promise<void> {
  const form = document.getElementById("contact-form") as HTMLFormElement;
  const emailInput = document.getElementById(
    "contact-email",
  ) as HTMLInputElement;
  const emailError = document.getElementById("email-error");
  const message = document.getElementById("contact-form-message");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  emailInput?.addEventListener("input", () => {
    const value = emailInput.value.trim();
    if (value.length === 0) {
      emailInput.classList.remove("input--error");
      emailError?.classList.remove("contact-form__error--visible");
      return;
    }
    if (emailRegex.test(value)) {
      emailInput.classList.remove("input--error");
      emailError?.classList.remove("contact-form__error--visible");
    } else {
      emailInput.classList.add("input--error");
      if (emailError) {
        emailError.textContent = "Please enter a valid email";
        emailError.classList.add("contact-form__error--visible");
      }
    }
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    if (!emailRegex.test(emailInput?.value.trim() || "")) {
      isValid = false;
      emailInput?.classList.add("input--error");
      if (emailError) {
        emailError.textContent = "Please enter a valid email";
        emailError.classList.add("contact-form__error--visible");
      }
    }

    if (!isValid) return;

    if (message) {
      message.textContent = "Thank you! Your message has been sent.";
      form.reset();
      setTimeout(() => {
        message.textContent = "";
      }, 3000);
    }
  });
}
