from fastapi.testclient import TestClient

from app.main import app
from app.db import engine
from app.models import Base


client = TestClient(app)


def setup_module(module):  # type: ignore[no-redef]
    # Ensure tables exist for API tests
    Base.metadata.create_all(bind=engine)


def test_healthz():
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_version():
    r = client.get("/version")
    assert r.status_code == 200
    assert "version" in r.json()


def test_create_and_list_farmer():
    payload = {
        "name": "Test Farmer",
        # Avoid unique phone collisions by omitting phone
        "language": "en",
        "latitude": 10.0,
        "longitude": 76.0,
        "land_size_ha": 0.5,
    }
    r = client.post("/farmers/", json=payload)
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["id"] > 0
    assert created["name"] == payload["name"]

    r2 = client.get("/farmers/")
    assert r2.status_code == 200
    farmers = r2.json()
    assert any(f["id"] == created["id"] for f in farmers)
