<div align="center">

# 🎓 Edulytics

### Data-Driven Educational Analytics Platform

![Python](https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/API-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Chart.js](https://img.shields.io/badge/Visualization-Chart.js-21A0E0?style=for-the-badge)

**An analytics platform for educational data — helping institutions & educators visualize student performance, attendance, and trends to make data-driven decisions.**

[🐛 Report Bug](https://github.com/TanayV24/Edulytics/issues) | [💡 Request Feature](https://github.com/TanayV24/Edulytics/issues)

</div>

---

## ✨ Features

### 📊 Analytics & Insights
- 📈 **Performance Charts** — Visual graphs for test scores, subject-wise averages  
- 🧮 **Aggregate Metrics** — Class average, pass/fail rates, grade distributions  
- 📋 **Attendance & Participation Reports** — Track attendance, engagement over time  
- 🕒 **Trend Analysis** — Identify patterns in performance over semesters/terms  
- 🔍 **Filter & Search** — Filter data by class, subject, date, student — easy exploration  

### 🔧 Admin & Management Tools
- 👩‍🏫 **User Management** — Add/remove students, teachers, administrators  
- 📝 **Data Import / Upload** — CSV / Excel upload for bulk student / exam data  
- 📥 **Export Reports** — Download reports as PDF/CSV for offline review  
- 🔐 **Secure API Backend** — RESTful API to handle data securely and efficiently  
- 📡 **Modular Architecture** — Easy to extend (e.g. add feedback, assignments, notifications)  

---

## 🛠 Tech Stack

| Layer       | Technology Used             |
|-------------|-----------------------------|
| Backend     | Python, Flask, Pandas       |
| Data Storage| JSON / CSV / (Optional DB)  |
| Frontend    | HTML, CSS, JS (Chart.js)    |
| Visualization | Chart.js or equivalent     |
| API         | RESTful via Flask           |

---

## 📋 Prerequisites

- 🐍 Python 3.8+  
- 📦 Pip (Python package installer)  
- (Optional) Virtual environment for Python  
- Git  

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/TanayV24/Edulytics.git
cd Edulytics
pip install -r requirements.txt
python app.py
````

> The backend server will start (by default on `http://localhost:5000`).

Then open your browser and navigate to the front-end page (e.g. `index.html`) or use API endpoints to feed data / fetch analysis results.

---

## 🎯 Usage Example

1. Prepare student/exam/attendance data in CSV or JSON format
2. Upload data via the upload interface or place in the designated data folder
3. Use the dashboard to view analytics — charts, class performance, trend reports
4. Filter by class, subject or date to narrow data
5. Export reports as CSV or PDF for records or sharing

---

## 🐛 Troubleshooting & Tips

<details>
<summary>No data showing or blank charts</summary>

* Ensure the data file is properly formatted (headers, numeric types)
* Restart backend server after data upload
* Check the browser console for any JS/Chart.js errors

</details>

<details>
<summary>Error while importing CSV / Excel</summary>

* Validate file encoding (use UTF-8)
* Ensure required columns (e.g. student_id, subject, marks) are present
* Remove special characters or inconsistent separators

</details>

<details>
<summary>Charts not rendering correctly</summary>

* Confirm data arrays passed to Chart.js are valid (no null or undefined values)
* Refresh/clear cache after updates
* Ensure frontend JS dependencies are correctly loaded

</details>

---
