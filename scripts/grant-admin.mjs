/**
 * Grant the Firebase admin custom claim to one existing Firebase Auth user.
 *
 * Run locally from the repository root after installing firebase-admin.
 * The service-account credential stays outside this repository.
 *
 * Required environment variables:
 *   GOOGLE_APPLICATION_CREDENTIALS=/secure/path/firebase-admin.json
 *   ADMIN_UID=<Firebase Authentication user UID>
 *   CONFIRM_ADMIN_GRANT=YES
 */
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const uid = String(process.env.ADMIN_UID || "").trim();
if (!uid) {
  throw new Error("ADMIN_UID is required. Copy the UID from Firebase Authentication > Users.");
}
if (process.env.CONFIRM_ADMIN_GRANT !== "YES") {
  throw new Error("Set CONFIRM_ADMIN_GRANT=YES after confirming the intended administrator account.");
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS must point to a private service-account JSON file outside this repository.");
}

initializeApp({ credential: applicationDefault() });

const auth = getAuth();
const user = await auth.getUser(uid);

if (!user.emailVerified) {
  throw new Error("The target account email must be verified before granting administrator access.");
}

const existingClaims = user.customClaims || {};
await auth.setCustomUserClaims(uid, { ...existingClaims, admin: true });

console.log("Administrator role granted.");
console.log("UID:", uid);
console.log("The account owner must sign out and sign back in (or refresh its ID token) before the site sees the new role.");
