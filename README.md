<h1 align="center">
  <img src="https://img.icons8.com/fluency/48/heart-with-pulse.png" width="35" align="center" />
  Vitalis AI
</h1>

<h3 align="center">
  Intelligent Disease Prediction System
</h3>

<p align="center">
  A machine-learning-powered platform for symptom-based disease prediction.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Machine%20Learning-Random%20Forest-FF9800?style=flat-square" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-E34F26?style=flat-square&logo=html5&logoColor=white" />
</p>

---

## 📌 Overview

**Vitalis AI** is a web-based disease prediction system that analyzes user-selected symptoms using a trained machine learning model.

The platform integrates a responsive frontend, a Java Spring Boot backend, a Python-based ML API, and a MySQL database to deliver an end-to-end prediction experience.

## ✨ Features

| Feature | Description |
|:---|:---|
| 🔐 Authentication | User registration and login |
| 👤 Patient Profile | Personal and health-related information |
| 🩺 Symptom Analysis | Multiple symptom selection |
| 🤖 AI Prediction | Random Forest-based disease prediction |
| 📊 Confidence Score | Prediction confidence percentage |
| 📜 Prediction History | Access previous predictions |
| ⚙️ REST API | Frontend, backend and ML integration |

## 🏗️ System Architecture

```mermaid
flowchart TD
    A["🌐 Frontend<br/>HTML · CSS · JavaScript"]
    B["☕ Spring Boot Backend<br/>Java · REST APIs · JWT"]
    C[("🗄️ MySQL Database")]
    D["🐍 Python ML API<br/>FastAPI"]
    E["🤖 Random Forest Model"]

    A <-->|HTTP / REST| B
    B <-->|Database Operations| C
    B <-->|Prediction Request| D
    D --> E
    E --> D
```

## 🛠️ Tech Stack

| Layer | Technologies |
|:---|:---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Java, Spring Boot |
| Machine Learning | Python, Scikit-learn |
| ML API | FastAPI, Uvicorn |
| Database | MySQL |
| Authentication | Spring Security, JWT |
| Build Tool | Maven |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
Vitalis-AI/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── patient.html
│   ├── symptoms.html
│   ├── result.html
│   ├── history.html
│   ├── profile.html
│   └── CSS & JavaScript files
│
├── backend/
│   └── vitalis-backend/
│       ├── src/main/java/
│       │   └── com/vitalis_backend/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── repository/
│       │       ├── security/
│       │       └── service/
│       ├── src/main/resources/
│       └── pom.xml
│
├── vitalis-ml/
│   ├── app.py
│   ├── requirements.txt
│   ├── model_features.pkl
│   ├── model_features.txt
│   └── prediction utilities
│
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Java JDK
- Python 3.x
- MySQL Server
- Git
- VS Code or any preferred IDE

### 1. Clone Repository

```bash
git clone https://github.com/ayushtripathi-45/Vitalis-AI.git
cd Vitalis-AI
```

### 2. Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE vitalis_db;
```

Configure these environment variables for the backend:

```env
DB_URL=jdbc:mysql://localhost:3306/vitalis_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
PORT=8080
ML_API_URL=http://127.0.0.1:8000
```

### 3. Start the ML Service

```powershell
cd vitalis-ml

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

Place the trained `random_forest.pkl` model inside the `vitalis-ml/` directory.

Start the API:

```bash
uvicorn app:app --host 127.0.0.1 --port 8000
```

API documentation: `http://127.0.0.1:8000/docs`

### 4. Start the Backend

Open another terminal:

```powershell
cd backend/vitalis-backend

.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

### 5. Start the Frontend

Open the project root in VS Code and launch `index.html` using the Live Server extension.

Ensure the frontend API configuration points to the running backend.

## 🔌 ML API Reference

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/` | API status |
| `GET` | `/health` | Service health check |
| `GET` | `/features` | Retrieve model features |
| `POST` | `/predict` | Generate prediction |

**Sample prediction request**

```json
{
  "features": {
    "feature_name": 1
  }
}
```

**Sample response**

```json
{
  "predicted_disease": "Example Disease",
  "confidence": 92.45
}
```

The actual input features must match the trained model's expected feature names and format.

## ⚙️ Environment Variables

| Variable | Purpose |
|:---|:---|
| `PORT` | Backend server port |
| `DB_URL` | MySQL connection URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `ML_API_URL` | Python ML API URL |

> Keep credentials and secret keys private. Never commit `.env` files or production secrets.

## 👥 Contributors

<table>
  <tr>
    <td align="center" width="33%">
      <strong>Ayush Tripathi</strong><br/>
      <sub>Frontend Development</sub><br/>
      <a href="https://github.com/ayushtripathi-45">GitHub ↗</a>
    </td>
    <td align="center" width="33%">
      <strong>Atharva</strong><br/>
      <sub>Machine Learning Model</sub><br/>
      <a href="YOUR_ATHARVA_GITHUB_LINK">GitHub ↗</a>
    </td>
    <td align="center" width="33%">
      <strong>Nikhil</strong><br/>
      <sub>Backend Development</sub><br/>
      <a href="YOUR_NIKHIL_GITHUB_LINK">GitHub ↗</a>
    </td>
  </tr>
</table>

## ⚠️ Disclaimer

Vitalis AI is intended for educational and informational purposes only. Its predictions are not medical diagnoses and should not replace professional medical advice, clinical evaluation, or treatment.

---

<p align="center">
  <strong>VITALIS AI</strong><br/>
  Intelligent Insights. Better Awareness.
</p>
