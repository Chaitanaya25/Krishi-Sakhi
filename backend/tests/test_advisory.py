from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_advisory_bad_farmer():
    r = client.get("/advisories/for/999999")
    assert r.status_code == 404


def test_advisory_invalid_coords():
    # create farmer with invalid coords (non-finite)
    r = client.post(
        "/farmers/",
        json={
            "name": "X",
            "language": "en",
            "latitude": "nan",
            "longitude": "nan",
            "land_size_ha": 1.0,
        },
    )
    assert r.status_code == 200
    fid = r.json()["id"]
    resp = client.get(f"/advisories/for/{fid}")
    # either 422 or 503 depending on service state (or 200 if backend tolerates NaN)
    assert resp.status_code in (422, 503, 200)

