# Web login demo

This folder contains a minimal Flask app providing a login page for local/demo use.

Quick start

- Copy `.env.example` to `.env` and set `APP_SECRET`, `LOGIN_USER`, and `LOGIN_PASS`.
- Create a Python virtualenv and install requirements:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

- Run the app:

```bash
export FLASK_APP=app.py
flask run
```

- Visit `http://127.0.0.1:5000/login` and sign in with the credentials from `.env`.

Security notes

- This is a demo login for local development only. For production, use a proper user store and secure password management.
- Prefer setting `LOGIN_PASS_HASH` instead of `LOGIN_PASS` to avoid storing plain text passwords.
