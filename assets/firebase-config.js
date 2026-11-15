// Firebase web-app configuration.
// These values identify the Firebase project; they are not admin credentials.
// Replace the empty strings with the config shown in Firebase Console > Project settings > Your apps.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim().length > 0
);
