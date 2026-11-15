// Firebase web-app configuration for the USA National Team website.
// These are public client settings. Never put service-account keys or private secrets here.
export const firebaseConfig = {
  apiKey: "AIzaSyBEOSr6xQUyN67PsJgNAIZIoF79aC_l3q4",
  authDomain: "fifa-super-soccer-us-n-team.firebaseapp.com",
  projectId: "fifa-super-soccer-us-n-team",
  storageBucket: "fifa-super-soccer-us-n-team.firebasestorage.app",
  messagingSenderId: "137657161603",
  appId: "1:137657161603:web:a01af1d4e5a2946eb8c8b6",
  measurementId: "G-N2WKHKRNCT"
};

// Auth + Firestore require the core web-app fields. Analytics is not initialized on this static site.
export const firebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId
].every((value) => typeof value === "string" && value.trim().length > 0);
