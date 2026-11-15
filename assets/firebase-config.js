// Firebase web-app configuration.
// These values identify the Firebase project; they are public client settings,
// not administrator credentials. Never put service-account keys in this file.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Auth + Firestore require the core web-app fields. Storage/messaging are optional.
export const firebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId
].every((value) => typeof value === "string" && value.trim().length > 0);
