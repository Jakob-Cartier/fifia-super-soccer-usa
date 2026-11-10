(() => {
  const form = document.querySelector("#team-application-form");
  if (!form) return;

  // Set this to the team's shared, moderator-managed application inbox.
  // Leave blank until the team has chosen and verified its inbox.
  const APPLICATION_INBOX = "";

  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.querySelector("#application-status");
  const nextField = form.querySelector('input[name="_next"]');

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(APPLICATION_INBOX);

  if (!emailLooksValid) {
    if (submitButton) submitButton.disabled = true;
    if (status) {
      status.textContent = "The form is ready, but application delivery is not connected yet. The team needs to choose its shared application inbox before submissions can be sent.";
    }
    return;
  }

  // FormSubmit receives the form and emails it to the verified team inbox.
  // Its first submission requires the inbox owner to confirm the address.
  form.action = "https://formsubmit.co/" + APPLICATION_INBOX;
  form.method = "POST";
  if (nextField) nextField.value = "https://fifasupersoccer-usnational.futbol/apply/thanks/";

  if (submitButton) submitButton.disabled = false;
  if (status) {
    status.classList.add("ready");
    status.textContent = "Application delivery is connected. Submissions will be sent to the team's verified inbox.";
  }

  form.addEventListener("submit", () => {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "SENDING APPLICATION…";
    }
  });
})();