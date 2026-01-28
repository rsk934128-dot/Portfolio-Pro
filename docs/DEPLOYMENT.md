# 🚀 Deployment Guide: AI-Powered Portfolio & Blog

This guide provides step-by-step instructions for deploying your Next.js portfolio application to production. We will use **Vercel** for hosting the frontend and **Firebase** for the backend services (Firestore).

---

## 📋 Prerequisites

Before deploying, ensure you have:

*   A **Vercel account** ([Sign up here](https://vercel.com/signup)).
*   A **Firebase project** (as set up in `INSTALLATION.md`).
*   Your project code pushed to a **Git repository** (e.g., GitHub, GitLab, Bitbucket).
*   **Firebase CLI** installed on your local machine (`npm install -g firebase-tools`).

---

## Part 1: Deploying the Next.js Frontend to Vercel

Vercel is the recommended hosting platform for Next.js applications as it is developed by the same team and offers seamless integration.

### Step 1: Import Your Project in Vercel

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click the **"Add New..."** button and select **"Project"**.
3.  In the "Import Git Repository" section, find your project's repository and click **"Import"**. If you haven't connected your Git provider yet, Vercel will guide you through it.

### Step 2: Configure Your Project

Vercel will automatically detect that you are using Next.js and pre-fill most of the settings.

*   **Framework Preset:** Should be set to `Next.js`.
*   **Build and Output Settings:** You can leave these as default. Vercel knows how to build a Next.js app (`next build`).
*   **Root Directory:** If your `package.json` is in the root of your repository, you can leave this as is.

### Step 3: Add Environment Variables

This is the most critical step. You need to add the same environment variables from your local `.env.local` file to Vercel's project settings.

1.  In the "Configure Project" screen, expand the **"Environment Variables"** section.
2.  Add the following variables one by one:
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `NEXT_PUBLIC_FIREBASE_APP_ID`
    *   `GEMINI_API_KEY`

    **Important:** The Firebase variables are prefixed with `NEXT_PUBLIC_` because they need to be accessible on the client-side. The `GEMINI_API_KEY` is a server-side secret and should **NOT** have the prefix.

### Step 4: Deploy

1.  Once all environment variables are added, click the **"Deploy"** button.
2.  Vercel will start the build and deployment process. You can monitor the logs in real-time.
3.  After a few minutes, your site will be live! Vercel will provide you with a URL (e.g., `your-project.vercel.app`).

---

## Part 2: Deploying Firebase Security Rules

Your application's security depends on the Firestore rules. These must be deployed directly to your Firebase project.

### Step 1: Log in to Firebase CLI

Open your terminal and run:
```bash
firebase login
```
Follow the instructions to log in with your Google account.

### Step 2: Select Your Firebase Project

In your local project directory, associate it with your Firebase project by running:
```bash
firebase use --add
```
Select the Firebase project you created for this portfolio.

### Step 3: Deploy the Rules

Run the following command from your project's root directory to deploy the rules defined in `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```
This will upload and apply your security rules to the Firestore database.

---

## Part 3: Custom Domain (Optional)

To make your portfolio look even more professional, you can add a custom domain.

1.  In your Vercel project dashboard, go to the **"Domains"** tab.
2.  Enter your desired domain name and follow the on-screen instructions to configure your DNS records. Vercel provides clear guidance on how to update your domain registrar's settings (e.g., GoDaddy, Namecheap).

---

## 🎉 Congratulations!

Your AI-powered portfolio and blog are now live on the internet, securely connected to your Firebase backend. Every time you push a change to your main Git branch, Vercel will automatically redeploy the site with the latest updates.
