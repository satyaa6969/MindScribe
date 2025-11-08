# 🧠 MindScribe

An AI-powered journaling and mood-tracking application. This project uses Natural Language Processing (NLP) to analyze the sentiment of your entries and presents the insights on a data-driven dashboard.

## ✨ Live Demo

**You can use the live application here: [https://mindscribe-5nsp.onrender.com](https://mindscribe-5nsp.onrender.com)**

---

## 🚀 Features

* **Secure User Authentication:** Unique user registration and login using JWT tokens.
* **Create Entries:** A rich text form to write and save new journal entries.
* **Instant Sentiment Analysis:** Every entry is instantly analyzed upon submission for its sentiment (Positive, Negative, Neutral) and polarity score.
* **Data Dashboard:** An interactive dashboard for each user, displaying:
    * Total entry count.
    * Mood distribution (Pie Chart).
    * Sentiment trends over time (Line Chart).
    * A list of recent entries with their scores.

---

## 🛠️ Tech Stack

This is a full-stack project built with a monorepo structure.

### Backend (Django)
* **Framework:** Django & Django REST Framework
* **Language:** Python
* **NLP:** `spaCy` & `spacytextblob`
* **Database:** PostgreSQL (Production) & SQLite3 (Development)
* **Server:** `gunicorn`

### Frontend (React)
* **Library:** React.js
* **Bundler:** Vite
* **Data Fetching:** `axios`
* **Charting:** `Chart.js` (with `react-chartjs-2`)

### Deployment
* **Host:** Render
* **Services:**
    * **Backend:** Render Web Service (Python/Gunicorn)
    * **Frontend:** Render Static Site (React/Vite)
    * **Database:** Render PostgreSQL
