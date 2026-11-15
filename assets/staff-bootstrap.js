import { auth, firebaseConfigured } from "./firebase-client.js";
import { onAuthStateChanged, getIdTokenResult, signOut } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

const shell = document.querySelector(".staff-main");

function deny(title, detail, showSignOut = false) {
  if (!shell) return;
  shell.hidden = false;
  shell.innerHTML = "";
  const card = document.createElement("section");
  card.className = "staff-access-gate";
  card.innerHTML = '<div class="staff-access-icon" aria-hidden="true">🔐</div>' +
    '<div class="staff-eyebrow">PROTECTED STAFF AREA</div>' +
    '<h1>' + title + '</h1><p></p><a class="staff-primary-button" href="/account/">GO TO ACCOUNT ↗</a>';
  card.querySelector("p").textContent = detail;
  if (showSignOut) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "staff-secondary-button";
    button.textContent = "SIGN OUT";
    button.addEventListener("click", () => signOut(auth));
    card.append(button);
  }
  shell.append(card);
}

if (shell) shell.hidden = true;

if (!firebaseConfigured || !auth) {
  deny("ACCOUNT SYSTEM NOT CONNECTED.", "Firebase setup is required before staff access can be checked. Configure the Firebase web app first.");
} else {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      const returnTo = encodeURIComponent("/staff/");
      location.replace("/account/?return=" + returnTo);
      return;
    }

    try {
      const result = await getIdTokenResult(user, true);
      if (result.claims.admin !== true || !user.emailVerified) {
        deny("ADMIN ACCESS REQUIRED.", "This account does not have the server-assigned administrator role. Ask the site owner to grant access to the correct verified Firebase account.", true);
        return;
      }

      if (shell) shell.hidden = false;
      const layout = document.querySelector(".staff-layout");
      if (layout) {
        const bar = document.createElement("div");
        bar.className = "staff-auth-bar";
        const identity = document.createElement("div");
        identity.innerHTML = '<span class="staff-auth-dot"></span><div><strong>ADMINISTRATOR SESSION</strong><small></small></div>';
        identity.querySelector("small").textContent = user.email || user.uid;
        const actions = document.createElement("div");
        actions.className = "staff-auth-actions";
        const account = document.createElement("a");
        account.href = "/account/";
        account.textContent = "MY ACCOUNT";
        const logout = document.createElement("button");
        logout.type = "button";
        logout.textContent = "SIGN OUT";
        logout.addEventListener("click", () => signOut(auth));
        actions.append(account, logout);
        bar.append(identity, actions);
        layout.parentElement.insertBefore(bar, layout);
      }

      await import("./staff.js?v=1");
    } catch (error) {
      console.error("Staff authorization check failed.", error);
      deny("COULD NOT VERIFY ACCESS.", "The account permission check did not complete. Check the Firebase setup and try signing in again.", true);
    }
  });
}
