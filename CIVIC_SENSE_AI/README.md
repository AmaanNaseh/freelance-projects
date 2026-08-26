# CivicSenseAI

<p align="justify">
A smart automated platform for traffic police to manage safety and regulatory protocols effectively.
</p>

## Setup Guide:

Make sure to install <a href="https://www.python.org/downloads/release/python-3116/">Python 3.11.6</a>, <a href="https://code.visualstudio.com/download">VS Code</a>, <a href="https://nodejs.org/en/download">Node.js</a> and <a href="https://git-scm.com/downloads">Git</a> in your system to run this project. Then follow the steps given below:

1. **Clone the repository**

```bash
git clone <this_repo_url>
```

2. **Download dependencies**

Open project folder in VS code and Open 2 terminals

```bash
# Terminal 1
cd backend
pip install -r requirements.txt
```

```bash
# Terminal 2
cd frontend
npm install
```

3. **Setup Environment Variables**

(i) **Backend**

- Create a .env file in backend folder
- Copy paste contents from .env.example of backend folder
- Replace with your keys

(ii) **Frontend**

- Create a .env file in frontend folder
- Copy paste contents from .env.example of frontend folder
- Replace with your keys

4. **Run the application**

Open two terminals and use following commands to run the servers:

```bash
# Terminal 1
cd backend
python app.py
```

```bash
# Terminal 2
cd frontend
npm run dev
```

You can access the website at http://localhost:5173

![Sam HigginBottom University Prayagraj](https://img.shields.io/badge/Sam%20HigginBottom%20University%20Prayagraj-yellow)
![Project Code 1500](https://img.shields.io/badge/Project%20Code%201500-green)
