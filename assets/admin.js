const $ = (selector) => document.querySelector(selector);
import { auth, firebaseConfigured } from "./firebase-client.js";
import { onAuthStateChanged, getIdTokenResult, signOut } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

const loading = document.querySelector("#admin-loading");
const consolePanel = document.querySelector("#admin-console");
const deniedPanel = document.querySelector("#admin-denied");

function showDenied(title, detail, allowSignOut = false) {
  loading.hidden = true;
  consolePanel.hidden = true;
  deniedPanel.hidden = false;
  deniedPanel.innerHTML = '<div class="admin-denied-icon">🔐</div><div class="staff-eyebrow">RESTRICTED AREA</div><h1></h1><p></p><a class="staff-primary-button" href="/account/">OPEN ACCOUNT ↗</a>';
  deniedPanel.querySelector("h1").textContent = title;
  deniedPanel.querySelector("p").textContent = detail;
  if (allowSignOut) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "staff-secondary-button";
    button.textContent = "SIGN OUT";
    button.addEventListener("click", () => signOut(auth));
    deniedPanel.append(button);
  }
}

if (!firebaseConfigured || !auth) {
  showDenied("ACCOUNT SYSTEM NOT CONNECTED.", "Firebase is not configured yet. Set up the Firebase project before administrator access can be verified.");
} else {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.replace("/account/?return=" + encodeURIComponent("/admin/"));
      return;
    }
    try {
      const token = await getIdTokenResult(user, true);
      if (token.claims.admin !== true || !user.emailVerified) {
        showDenied("ADMINISTRATOR ACCESS REQUIRED.", "This verified account does not have the server-assigned admin role. Ask the site owner to grant access to the intended account.", true);
        return;
      }
      $("#admin-email").textContent = user.email || user.uid;
      loading.hidden = true;
      consolePanel.hidden = false;
    } catch (error) {
      console.error("Admin token verification failed.", error);
      showDenied("ACCESS CHECK FAILED.", "The administrator permission could not be verified. Sign in again or contact the site owner.", true);
    }
  });
}

document.querySelector("#admin-signout")?.addEventListener("click", () => {
  if (auth) signOut(auth);
});
