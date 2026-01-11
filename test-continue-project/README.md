# Greeting CLI

A tiny Python CLI that prints a greeting.

Usage

```bash
# Run with default name
python main.py

# Provide a name
python main.py Alice

# Uppercase the greeting
python main.py --shout Alice

# Repeat the greeting 3 times
python main.py --repeat 3 Alice

# Make executable and run
chmod +x main.py
./main.py Bob
```

No external dependencies; requires Python 3.6+.

---

## Web login demo 🔐

A minimal Flask-based demo login is available in the `web/` directory. Quick steps:

- Copy `web/.env.example` to `web/.env` and set `APP_SECRET`, `LOGIN_USER`, and `LOGIN_PASS`.
- Install and run:

```bash
cd web
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run
```

Then visit `http://127.0.0.1:5000/login` and sign in with the credentials from `web/.env`.
