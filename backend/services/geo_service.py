import requests


class GeoService:
    """
    Retrieves geographical information for an IP address.
    """

    BASE_URL = "http://ip-api.com/json/"

    @staticmethod
    def get_location(ip_address: str) -> dict:
        """
        Returns geographical information for the given IP address.
        """

        if not ip_address or ip_address == "Unknown":
            return GeoService.empty_location(ip_address)

        try:

            response = requests.get(
                f"{GeoService.BASE_URL}{ip_address}",
                timeout=5
            )

            data = response.json()

            if data.get("status") != "success":
                return GeoService.empty_location(ip_address)

            return {

                "ip": ip_address,

                "country": data.get("country"),

                "country_code": data.get("countryCode"),

                "region": data.get("regionName"),

                "city": data.get("city"),

                "timezone": data.get("timezone"),

                "latitude": data.get("lat"),

                "longitude": data.get("lon"),

                "isp": data.get("isp"),

                "organization": data.get("org")

            }

        except Exception:

            return GeoService.empty_location(ip_address)

    @staticmethod
    def empty_location(ip_address="Unknown"):

        return {

            "ip": ip_address,

            "country": "Unknown",

            "country_code": "Unknown",

            "region": "Unknown",

            "city": "Unknown",

            "timezone": "Unknown",

            "latitude": None,

            "longitude": None,

            "isp": "Unknown",

            "organization": "Unknown"

        }