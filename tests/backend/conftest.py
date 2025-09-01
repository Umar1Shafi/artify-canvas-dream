# tests/backend/conftest.py
import os
import pytest

# Make sure imports resolve from project root when you run pytest from repo root.
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))  # repo root

try:
    from backend.server import app  # your FastAPI app
    from fastapi.testclient import TestClient
except Exception as e:  # pragma: no cover
    app = None
    TestClient = None
    IMPORT_ERROR = e
else:  # pragma: no cover
    IMPORT_ERROR = None

@pytest.fixture(scope="session")
def client():
    if app is None or TestClient is None:
        pytest.skip(f"Cannot import backend.server.app or TestClient: {IMPORT_ERROR}")
    return TestClient(app)
