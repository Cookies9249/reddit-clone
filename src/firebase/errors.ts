// Custom firebase error messages
// Used in user authentication process

// Alternatively, in components/Modal/Auth/SignUp, where the error messages are being displayed, display: { error || userError.message === "Firebase: Error (auth/email-already-in-use)." && 'Email arleady in use' || ... }

export const FIREBASE_ERRORS = {
    "Firebase: Error (auth/email-already-in-use).":
    "Email already in use",
    "Firebase: Error (auth/user-not-found).":
    "Invalid email",
    "Firebase: Error (auth/wrong-password).":
    "Invalid password",
    "Firebase: Password should be at least 6 characters (auth/weak-password).": "Password should be at least 6 characters",
}