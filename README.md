# Salon Website

A Firebase-backed public salon website and protected admin panel.

## Project Structure

- `frontend/` - public React/Vite website
- `admin-panel/` - protected React/Vite administration panel
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `firebase.json` - Firebase rules deployment configuration
- `QA_CHECKLIST.md` - production QA checklist and manual test cases

## Requirements

- Node.js 20 or newer
- A Firebase project with Authentication, Firestore, and Storage enabled
- Firebase CLI for deploying and emulator-testing rules

## Local Setup

Create a local `.env` in both `frontend/` and `admin-panel/` using the corresponding `.env.example`. Never commit `.env` files or credentials.

Required variables in both apps:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Install and run each app independently:

```text
cd frontend
npm install
npm run dev
```

```text
cd admin-panel
npm install
npm run dev
```

## Verification

```text
npm run lint
npm run build
```

Run both commands from each app directory. Production output is written to that app's `dist/` directory.

## Firebase Deployment

From the repository root, authenticate with the Firebase CLI, select the intended project, then deploy only the rules when ready:

```text
firebase use <project-id>
firebase deploy --only firestore:rules,storage
```

Provision the first admin user through a trusted process. The admin panel requires a matching `adminUsers/{uid}` Firestore record with `role: "admin"` and `isActive: true`.

Review [QA_CHECKLIST.md](QA_CHECKLIST.md) before client demonstration. Anonymous forms require production abuse protection such as App Check, rate limiting, CAPTCHA, or a trusted backend.
