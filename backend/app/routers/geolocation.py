from fastapi import APIRouter, HTTPException
from ..config import settings
import httpx

router = APIRouter(prefix="/geo", tags=["geo"])


@router.get("/ip")
async def ip_geolocation():
    async with httpx.AsyncClient(timeout=10) as client:
        # Primary: IPinfo full API -> has "loc": "LAT,LON"
        if settings.IPINFO_TOKEN:
            r = await client.get(
                f"https://ipinfo.io/json?token={settings.IPINFO_TOKEN}"
            )
            r.raise_for_status()
            data = r.json()
            loc = data.get("loc")  # "lat,lon"
            if isinstance(loc, str) and "," in loc:
                lat_str, lon_str = loc.split(",", 1)
                return {
                    "source": "ipinfo",
                    "ip": data.get("ip"),
                    "city": data.get("city"),
                    "region": data.get("region"),
                    "country": data.get("country"),
                    "latitude": float(lat_str),
                    "longitude": float(lon_str),
                }

        # Fallback: ipwho.is (no key)
        r = await client.get("https://ipwho.is/")
        r.raise_for_status()
        j = r.json()
        if j.get("success"):
            return {
                "source": "ipwho.is",
                "ip": j.get("ip"),
                "city": j.get("city"),
                "region": j.get("region"),
                "country": j.get("country_code"),
                "latitude": j.get("latitude"),
                "longitude": j.get("longitude"),
            }

    raise HTTPException(502, "IP geolocation lookup failed")


@router.get("/test")
async def test_geolocation():
    """
    Test endpoint to verify geolocation services are working
    """
    test_results = []

    # Test IPinfo
    if settings.IPINFO_TOKEN:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(
                    f"https://ipinfo.io/json?token={settings.IPINFO_TOKEN}"
                )
                if r.status_code == 200:
                    test_results.append(
                        {
                            "service": "ipinfo",
                            "status": "working",
                            "response_time": "ok",
                        }
                    )
                else:
                    test_results.append(
                        {
                            "service": "ipinfo",
                            "status": "error",
                            "response_time": "ok",
                            "error": f"HTTP {r.status_code}",
                        }
                    )
        except Exception as e:
            test_results.append(
                {
                    "service": "ipinfo",
                    "status": "error",
                    "response_time": "timeout",
                    "error": str(e),
                }
            )
    else:
        test_results.append(
            {"service": "ipinfo", "status": "not_configured", "response_time": "n/a"}
        )

    # Test ipwho.is
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get("https://ipwho.is/")
            if r.status_code == 200:
                test_results.append(
                    {"service": "ipwho.is", "status": "working", "response_time": "ok"}
                )
            else:
                test_results.append(
                    {
                        "service": "ipwho.is",
                        "status": "error",
                        "response_time": "ok",
                        "error": f"HTTP {r.status_code}",
                    }
                )
    except Exception as e:
        test_results.append(
            {
                "service": "ipwho.is",
                "status": "error",
                "response_time": "timeout",
                "error": str(e),
            }
        )

    # Test ipapi.co
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get("https://ipapi.co/json/")
            if r.status_code == 200:
                test_results.append(
                    {"service": "ipapi.co", "status": "working", "response_time": "ok"}
                )
            else:
                test_results.append(
                    {
                        "service": "ipapi.co",
                        "status": "error",
                        "response_time": "ok",
                        "error": f"HTTP {r.status_code}",
                    }
                )
    except Exception as e:
        test_results.append(
            {
                "service": "ipapi.co",
                "status": "error",
                "response_time": "timeout",
                "error": str(e),
            }
        )

    return {
        "test_results": test_results,
        "timestamp": "now",
        "message": "Geolocation service test completed",
    }
