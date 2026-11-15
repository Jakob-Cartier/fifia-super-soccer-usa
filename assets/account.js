import { auth, db, firebaseConfigured } from "./firebase-client.js";
import {
  GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,
  signOut, onAuthStateChanged, updateProfile, getIdTokenResult
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const $ = (selector) => document.querySelector(selector);
const authPanel = $("#auth-panel");
const accountPanel = $("#signed-in-panel");
const messageBox = $("#account-message");
const googleButton = $("#google-signin");
const signInForm = $("#signin-form");
const signUpForm = $("#signup-form");
const setupNote = $("#firebase-setup-note");

function setMessage(message, error = false, target = messageBox) {
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("is-error", error);
  target.classList.toggle("is-success", !error && Boolean(message));
}
function friendlyError(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-email": "Enter a valid email address.",
    "auth/user-disabled": "This account is disabled. Contact the team site administrator.",
    "auth/user-not-found": "No account was found for that email. Create an account first.",
    "auth/wrong-password": "That email and password combination was not accepted.",
    "auth/invalid-credential": "That sign-in did not work. Check your details and try again.",
    "auth/email-already-in-use": "An account already exists with that email. Try signing in.",
    "auth/weak-password": "Choose a stronger password with at least 8 characters.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed before finishing.",
    "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
    "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication yet.",
    "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Authentication yet.",
    "auth/network-request-failed": "Network connection failed. Check your connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later."
  };
  return messages[code] || "The account request could not be completed. Please try again.";
}
function setBusy(button, busy, label) {
  if (!button) return;
  button.disabled = busy;
  button.dataset.originalLabel ||= button.textContent.trim();
  button.textContent = busy ? label : button.dataset.originalLabel;
}
function safeReturnPath() {
  const value = new URLSearchParams(location.search).get("return") || "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
function goToReturn() {
  const path = safeReturnPath();
  if (path !== "/" && path !== "/account/") location.assign(path);
}

function setAuthTab(tab) {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    const active = button.dataset.authTab === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  signInForm.hidden = tab !== "signin";
  signUpForm.hidden = tab !== "signup";
  setMessage("");
}
document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
});

async function ensureProfile(user) {
  if (!db) return;
  const profileRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(profileRef);
  if (!snapshot.exists()) {
    await setDoc(profileRef, {
      uid: user.uid,
      displayName: user.displayName || "USA Team Member",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

function renderSignedOut() {
  authPanel.hidden = false;
  accountPanel.hidden = true;
}
async function renderSignedIn(user) {
  authPanel.hidden = true;
  accountPanel.hidden = false;
  $("#profile-name").textContent = user.displayName || "USA Team Member";
  $("#profile-email").textContent = user.email || "";
  $("#profile-photo").src = user.photoURL || "/assets/crest.png";
  $("#profile-photo").alt = user.photoURL ? "Account profile photo" : "USA National Team crest";
  $("#profile-form [name=displayName]").value = user.displayName || "";
  $("#profile-role").textContent = "MEMBER ACCOUNT";
  $("#admin-access").hidden = true;
  $("#verification-note").hidden = Boolean(user.emailVerified || !user.providerData.some((provider) => provider.providerId === "password"));

  try {
    await ensureProfile(user);
  } catch (error) {
    console.warn("Account profile document is not available yet.", error);
  }

  try {
    const token = await getIdTokenResult(user);
    if (token.claims.admin === true) {
      $("#profile-role").textContent = "SITE ADMINISTRATOR";
      $("#admin-access").hidden = false;
    }
  } catch (error) {
    console.warn("Could not read account permissions.", error);
  }
}

if (!firebaseConfigured || !auth) {
  setupNote.hidden = false;
  [googleButton, ...signInForm.querySelectorAll("input,button"), ...signUpForm.querySelectorAll("input,button")].forEach((node) => {
    node.disabled = true;
  });
  $("#account-message").textContent = "Account setup is not connected yet.";
  renderSignedOut();
} else {
  googleButton.addEventListener("click", async () => {
    setBusy(googleButton, true, "CONNECTING TO GOOGLE…");
    setMessage("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      goToReturn();
    } catch (error) {
      setMessage(friendlyError(error), true);
    } finally {
      setBusy(googleButton, false);
    }
  });

  signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(signInForm);
    const button = signInForm.querySelector('button[type="submit"]');
    setBusy(button, true, "SIGNING IN…");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, String(form.get("email") || "").trim(), String(form.get("password") || ""));
      goToReturn();
    } catch (error) {
      setMessage(friendlyError(error), true);
    } finally {
      setBusy(button, false);
    }
  });

  signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(signUpForm);
    const displayName = String(form.get("displayName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (!displayName) return setMessage("Choose a display name.", true);
    if (password.length < 8) return setMessage("Use a password with at least 8 characters.", true);
    if (password !== confirmPassword) return setMessage("The passwords do not match.", true);
    const button = signUpForm.querySelector('button[type="submit"]');
    setBusy(button, true, "CREATING ACCOUNT…");
    setMessage("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      await ensureProfile(credential.user);
      await sendEmailVerification(credential.user);
      setMessage("Account created. A verification email has been sent. Check your inbox.", false);
      await renderSignedIn(credential.user);
    } catch (error) {
      setMessage(friendlyError(error), true);
    } finally {
      setBusy(button, false);
    }
  });

  $("#forgot-password").addEventListener("click", async () => {
    const email = String(signInForm.elements.email.value || "").trim();
    if (!email) return setMessage("Enter your email address first, then choose Forgot password.", true);
    try {
      await sendPasswordResetEmail(auth, email, { url: location.origin + "/account/" });
      setMessage("If an account exists for that address, a password reset email has been sent.");
    } catch (error) {
      setMessage(friendlyError(error), true);
    }
  });

  $("#resend-verification").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent.", false, $("#signed-in-message"));
    } catch (error) {
      setMessage(friendlyError(error), true, $("#signed-in-message"));
    }
  });

  $("#profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user || !db) return;
    const displayName = String(new FormData(event.currentTarget).get("displayName") || "").trim();
    if (!displayName) return setMessage("Enter a display name.", true, $("#signed-in-message"));
    const button = event.currentTarget.querySelector('button[type="submit"]');
    setBusy(button, true, "SAVING…");
    try {
      await updateProfile(user, { displayName });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        photoURL: user.photoURL || "",
        updatedAt: serverTimestamp()
      }, { merge: true });
      $("#profile-name").textContent = displayName;
      setMessage("Your profile has been updated.", false, $("#signed-in-message"));
    } catch (error) {
      setMessage(friendlyError(error), true, $("#signed-in-message"));
    } finally {
      setBusy(button, false);
    }
  });

  $("#signout-button").addEventListener("click", async () => {
    try {
      await signOut(auth);
      setMessage("You have signed out.");
    } catch (error) {
      setMessage(friendlyError(error), true, $("#signed-in-message"));
    }
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) await renderSignedIn(user);
    else renderSignedOut();
  });
}
