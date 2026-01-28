# 🚀 Installation Guide: AI-Powered Portfolio & Blog

This guide provides step-by-step instructions to set up and run the project on your local machine for development and testing.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: Version 18.x or higher. ([Download here](https://nodejs.org/))
*   **npm**: Should be included with your Node.js installation.
*   **Git**: Required for cloning the repository. ([Download here](https://git-scm.com/))

---

## ⚙️ Step-by-Step Installation

### 1. Clone the Repository

First, clone the project repository from GitHub to your local machine using Git.

```bash
git clone https://github.com/your-username/portfolio-ai-blog.git
cd portfolio-ai-blog
```
*Replace `your-username/portfolio-ai-blog.git` with the actual repository URL.*

---

### 2. Install Dependencies

Navigate to the project directory and install all the necessary npm packages.

```bash
npm install
```

---

## 🔥 Firebase Setup

This project uses Firebase for its database (Firestore) and dynamic content management.

### 3. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on **"Add project"** and follow the on-screen instructions to create a new project.
3.  Once the project is created, you will be redirected to the project's dashboard.

### 4. Set Up a Web App

1.  In your Firebase project dashboard, click the Web icon (`</>`) to add a new web app.
2.  Give your app a nickname (e.g., "Portfolio Website") and click **"Register app"**.
3.  Firebase will provide you with a configuration object (`firebaseConfig`). **Copy this object.** You will need it for the environment variables.

### 5. Enable Firestore Database

1.  From the left-hand menu in the Firebase Console, go to **Build > Firestore Database**.
2.  Click **"Create database"**.
3.  Choose to start in **Production mode**.
4.  Select a location for your Firestore data (choose the one closest to you).
5.  Click **"Enable"**.

---

## 🔑 Environment Variables Setup

Create a file named `.env.local` in the root directory of the project. This file will store all your secret keys and configuration variables.

```bash
touch .env.local
```

Now, open the `.env.local` file and add the following variables. The application is configured to use these variables to initialize Firebase.

```env
# Firebase Configuration
# Copy these values from the firebaseConfig object you got in Step 4.
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Genkit (Google AI) API Key
# Get this from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

**Important:**
*   Replace the placeholder values (`YOUR_...`) with your actual Firebase and Google AI credentials.
*   The `.env.local` file should **not** be committed to Git. The `.gitignore` file is already configured to ignore it.

---

## ▶️ Running the Development Server

Once you have completed the setup, you can run the Next.js development server.

```bash
npm run dev
```

The application will start on `http://localhost:3000` (or another port if 3000 is busy). You can now view the application in your browser.

---

## 🐛 Common Issues & Fixes

*   **Firebase Permissions Error:** If you see errors related to Firestore permissions, ensure your `firestore.rules` are set up correctly in the Firebase Console under **Firestore Database > Rules**. For development, you can start with permissive rules, but ensure they are secure for production.
*   **Missing Environment Variables:** If the app crashes on startup, double-check that your `.env.local` file is correctly named and that all required variables have been added.
*   **AI Features Not Working:** Ensure your `GEMINI_API_KEY` is correct and has the necessary permissions.

---

Happy coding! ✨
