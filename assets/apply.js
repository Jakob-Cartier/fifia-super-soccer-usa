(() => {
  const form = document.querySelector("#team-application-form");
  if (!form) return;

  // Paste the Formspree form ID here after a trusted adult/team moderator
  // creates the form and sets the private Target Email in the Formspree dashboard.
  // Only the public form ID belongs in this file. Never put the inbox address here.
  const FORMSPREE_FORM_ID = "";

  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.querySelector("#application-status");
  const errorBox = document.querySelector("#application-error");

  const formIdIsReady = /^[a-zA-Z0-9]+$/.test(FORMSPREE_FORM_ID);

  if (!formIdIsReady) {
    if (submitButton) submitButton.disabled = true;
    if (status) {
      status.textContent = "The application form is prepared, but delivery is not connected yet. A team moderator must create the Formspree form, set its private Target Email, and add the form ID to the site.";
    }
    return;
  }

  if (typeof window.formspree !== "function") {
    if (submitButton) submitButton.disabled = true;
    if (status) status.textContent = "The form service could not load. Please refresh the page or contact team support.";
    return;
  }

  if (submitButton) submitButton.disabled = false;
  if (status) {
    status.classList.add("ready");
    status.textContent = "The application form is connected. Please review your game details before submitting.";
  }

  window.formspree("initForm", {
    formElement: "#team-application-form",
    formId: FORMSPREE_FORM_ID,
    onSuccess: () => {
      window.location.assign("/apply/thanks/");
    },
    onError: () => {
      if (status) status.textContent = "Please check the form fields and try again.";
    },
    onFailure: () => {
      if (status) status.textContent = "The application could not be sent. Please try again later or contact team support.";
    }
  });
})();