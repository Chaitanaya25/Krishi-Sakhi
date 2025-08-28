from typing import List, Dict
from datetime import datetime


# naive, rule-based advisories using weather


def build_advisories(farmer: Dict, weather: Dict) -> List[Dict]:
    advs: List[Dict] = []

    daily = weather.get("daily", {})
    precip_sum = daily.get("precipitation_sum", [])
    tmax = daily.get("temperature_2m_max", [])
    tmin = daily.get("temperature_2m_min", [])

    if precip_sum:
        # If rain > 5mm tomorrow: avoid spraying
        if len(precip_sum) > 1 and precip_sum[1] and precip_sum[1] >= 5:
            advs.append({
                "text": "Heavy rain likely tomorrow. Avoid pesticide spraying; reschedule irrigation.",
                "severity": "warn",
                "source": "rule",
            })


    if tmax and max(tmax[:3]) >= 35:
        advs.append({
            "text": "High temperatures expected in next 3 days. Consider morning/evening irrigation to reduce stress.",
            "severity": "info",
            "source": "rule",
        })


    if tmin and min(tmin[:3]) <= 18:
        advs.append({
            "text": "Cool nights ahead. Monitor for fungal diseases; ensure proper field sanitation.",
            "severity": "info",
            "source": "rule",
        })


# crop-specific placeholder
    crops = (farmer.get("crops") or "").lower()
    if "banana" in crops:
        advs.append({
            "text": "Banana: Propping recommended before strong winds; maintain drainage to avoid waterlogging.",
            "severity": "info",
            "source": "rule",
        })


    if not advs:
        advs.append({
            "text": "No critical alerts. Maintain regular scouting for pests and keep activity log updated.",
            "severity": "info",
            "source": "rule",
        })


    return advs
