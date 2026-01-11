from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

def get_app_secret():
    return os.environ.get("APP_SECRET", "dev-secret")

def get_login_user():
    return os.environ.get("LOGIN_USER", "admin")

def get_login_pass_hash():
    # Prefer explicit hash, otherwise build from LOGIN_PASS
    hash_val = os.environ.get("LOGIN_PASS_HASH")
    if hash_val:
        return hash_val
    raw = os.environ.get("LOGIN_PASS", "password")
    return generate_password_hash(raw)

app = Flask(__name__)
app.secret_key = get_app_secret()

@app.route("/")
def index():
    if session.get("user"):
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        if username == get_login_user() and check_password_hash(get_login_pass_hash(), password):
            session["user"] = username
            flash("Login successful", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid credentials", "danger")
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if not session.get("user"):
        return redirect(url_for("login"))
    return render_template("dashboard.html", user=session.get("user"))

@app.route("/logout")
def logout():
    session.pop("user", None)
    flash("Logged out", "info")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
