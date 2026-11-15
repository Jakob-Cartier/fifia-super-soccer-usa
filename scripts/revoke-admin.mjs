/**
 * Remove the Firebase admin custom claim from an existing Auth user.
 * Use the same trusted local credential setup as grant-admin.mjs.
 *
 * Required environment variables:
 *   GOOGLE_APPLICATION_CREDENTIALS=/secure/path/firebase-admin.json
 *   ADMIN_UID=<Firebase Authentication user UID>
 *   CONFIRM_ADMIN_REVOKE=YES
 */
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const uid = String(process.env.ADMIN_UID || "").trim();
if (!uid) throw new Error("ADMIN_UID is required.");
if (process.env.CONFIRM_ADMIN_REVOKE !== "YES") {
  throw new Error("Set CONFIRM_ADMIN_REVOKE=YES after confirming the target account.");
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS must point to a private service-account JSON file outside this repository.");
}

initializeApp({ credential: applicationDefault() });
const auth = getAuth();
const user = await auth.getUser(uid);
const claims = { ...(user.customClaims || {}) };
delete claims.admin;
await auth.setCustomUserClaims(uid, claims);

console.log("Administrator role removed.");
console.log("UID:", uid);
console.log("The account must refresh its ID token or sign in again for the change to appear.");
