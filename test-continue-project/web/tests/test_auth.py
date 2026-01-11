import os
import sys
from pathlib import Path
import importlib.util

# Load the app module directly to avoid package import issues in tests
app_path = Path(__file__).resolve().parent.parent / 'app.py'
spec = importlib.util.spec_from_file_location('web_app', str(app_path))
web_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(web_app)
app = getattr(web_app, 'app')


def test_login_success(monkeypatch):
    # configure test creds
    monkeypatch.setenv('LOGIN_USER', 'testuser')
    monkeypatch.setenv('LOGIN_PASS', 'testpass')
    client = app.test_client()
    resp = client.post('/login', data={'username': 'testuser', 'password': 'testpass'}, follow_redirects=True)
    assert b'Welcome' in resp.data


def test_login_fail(monkeypatch):
    monkeypatch.setenv('LOGIN_USER', 'testuser')
    monkeypatch.setenv('LOGIN_PASS', 'testpass')
    client = app.test_client()
    resp = client.post('/login', data={'username': 'testuser', 'password': 'wrong'}, follow_redirects=True)
    assert b'Invalid credentials' in resp.data
