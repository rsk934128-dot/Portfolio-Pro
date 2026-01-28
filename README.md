<p align="center">
  <img src="https://picsum.photos/seed/hero/1600/600" />
</p>

<p align="center">
  <b>AI-Powered Portfolio & Blogging Platform</b><br/>
  Built with Next.js • Firebase • Google Gemini (Genkit)
</p>

A modern, dynamic personal portfolio and blogging platform built with **Next.js**, **React**, **ShadCN UI**, and **Firebase**, enhanced with powerful **AI-driven blogging tools** including SEO generation, topic suggestions, auto-tagging, and one-click publishing.

This project transforms a traditional portfolio into an **intelligent content engine** for personal branding.

---

## ✨ Features

### 🧑 Personal Portfolio

* Hero section with profile & bio
* Skills showcase
* Projects gallery
* Certifications
* Testimonials carousel
* Contact form

---

### 🔥 Dynamic Content Management

* All data loaded from **Firebase Firestore**
* Update profile, projects, blog posts without touching code
* Skeleton loaders while fetching data

---

### 📝 Full Blog System

* `/blog` listing page
* Individual blog detail pages
* Homepage blog previews
* Tags & filtering ready
* SEO-optimized rendering

---

### 🤖 AI Blog Assistant

Built-in AI tools that supercharge content creation:

* ✅ SEO Title Generator
* ✅ Meta Description Generator
* ✅ Auto Summary
* ✅ Automatic Tag Generation
* ✅ Topic Idea Generator
* ✅ Save as New Post to Firestore
* ✅ Blog publishing automation

---

## 🖼️ Screenshots & Live Preview

### 🏠 Portfolio Homepage

![Homepage](https://picsum.photos/seed/homepage/1200/800)

---

### 📝 Blog System

![Blog Listing](https://picsum.photos/seed/bloglist/1200/800)
![Blog Post](https://picsum.photos/seed/blogpost/1200/800)

---

### 🤖 AI Blog Assistant

SEO generation, summaries, auto-tagging, topic ideas and one-click publishing.

![AI Assistant](https://picsum.photos/seed/ai/1200/800)

---

### 💡 Topic Suggestions Panel

![Topic Ideas](https://picsum.photos/seed/topics/1200/800)

---

### 🌟 Testimonials Carousel

![Testimonials](https://picsum.photos/seed/testimonials/1200/800)

---

### 💬 AI Portfolio Chatbot *(Coming Soon)*

Interactive visitor assistant powered by Firestore + AI.

![Chatbot](https://picsum.photos/seed/chatbot/1200/800)

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14, React, TypeScript
* **UI:** ShadCN UI, TailwindCSS
* **Backend:** Firebase Firestore
* **Auth (optional):** Firebase Auth
* **AI Integration:** Google AI (Gemini) via Genkit
* **Hosting:** Vercel / Firebase Hosting

---

## 📂 Project Structure

```
src/
 ├─ app/
 │   ├─ page.tsx
 │   ├─ blog/
 │   │   ├─ page.tsx
 │   │   └─ [slug]/page.tsx
 │
 ├─ components/
 │   ├─ hero/
 │   ├─ skills/
 │   ├─ projects/
 │   ├─ testimonials/
 │   ├─ blog/
 │   └─ ai/
 │
 ├─ lib/
 │   ├─ firebase.ts
 │   └─ fetchers.ts
 │
 └─ types/
docs/
 └─ backend.json
firestore.rules
```

---

## 🔥 Firebase Data Model

### User Document

```
users/
  muskan-akram/
```

### Sub-Collections

```
projects/
skills/
certifications/
testimonials/
blogPosts/
```

---

### Blog Post Schema

```
title: string
summary: string
content: string
seoTitle: string
seoDescription: string
tags: string[]
date: timestamp
slug: string
```

---

## 🔐 Firestore Rules (Example)

```js
rules_version = '2';

service cloud.firestore {
 match /databases/{database}/documents {

  match /users/{userId}/{document=**} {
   allow read: if true;
   allow write: if request.auth != null;
  }
 }
}
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/portfolio-ai-blog.git
cd portfolio-ai-blog
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Firebase Setup

* Create Firebase project
* Enable Firestore
* Copy config into:

```
src/lib/firebase.ts
```

---

### 4️⃣ Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

GEMINI_API_KEY=
```

---

### 5️⃣ Run Dev Server

```
npm run dev
```

---

## 🧠 AI Architecture

The AI Blog Assistant works through server actions, prompt-driven generation, and Firestore write operations. The visual below outlines the data flow from the user to the backend services.

<p align="center">
  <img src="https://picsum.photos/seed/arch/1200/800" alt="Architecture Diagram" />
</p>

Key components include:
* **Frontend:** Next.js with React and ShadCN UI.
* **Backend:** Firebase for data (Firestore) and authentication.
* **AI:** Google Gemini via Genkit for all generative features.

---

## 🚀 Roadmap

Planned advanced features:

* 📊 AI Blog Analytics Dashboard
* ♻ Content Refresh Assistant
* 🔗 Auto Internal Linking
* 📈 SEO Score Estimation
* 📬 Newsletter Automation
* 👔 AI Resume Generator
* 🤖 Portfolio Chatbot

---

## 🧑‍💻 Author

**Muskan Akram**
Personal AI-powered portfolio platform.

---

## 📜 License

MIT License — free to use and modify.
