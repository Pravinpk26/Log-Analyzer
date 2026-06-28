def detect_anomalies(statistics, authentication_event):

    anomalies = []

    # ------------------------------------
    # Brute Force Detection
    # ------------------------------------

    if statistics["failed_logins"] >= 3:

        anomalies.append({

            "type": "Brute Force Attack",

            "severity": "High",

            "message": "Multiple failed login attempts detected."

        })

    # ------------------------------------
    # Multiple IP Detection
    # ------------------------------------

    if statistics["unique_ips"] >= 3:

        anomalies.append({

            "type": "Multiple IP Addresses",

            "severity": "Medium",

            "message": "Authentication events originated from multiple IP addresses."

        })

    # ------------------------------------
    # Authentication Failure
    # ------------------------------------

    if authentication_event["status"] == "Failed":

        anomalies.append({

            "type": "Authentication Failure",

            "severity": "Medium",

            "message": "Latest authentication attempt failed."

        })

    # ------------------------------------
    # Slow Login
    # ------------------------------------

    if authentication_event["response_time"] > 3000:

        anomalies.append({

            "type": "Slow Authentication",

            "severity": "Low",

            "message": "Authentication response time is unusually high."

        })

    # ------------------------------------
    # Very Slow Authentication
    # ------------------------------------

    if authentication_event["response_time"] > 10000:

        anomalies.append({

            "type": "Performance Issue",

            "severity": "Medium",

            "message": "Authentication response exceeded 10 seconds."

        })

    # ------------------------------------
    # New Country Login
    # ------------------------------------

    geo = authentication_event.get("geo", {})

    country = geo.get("country", "Unknown")

    if country != "Unknown":

        anomalies.append({

            "type": "New Country Login",

            "severity": "Low",

            "message": f"Authentication originated from {country}."

        })

    # ------------------------------------
    # Login Outside Business Hours
    # ------------------------------------

    timestamp = authentication_event.get("timestamp", "")

    try:

        hour = int(timestamp.split(" ")[1].split(":")[0])

        if hour < 8 or hour > 20:

            anomalies.append({

                "type": "Outside Business Hours",

                "severity": "Medium",

                "message": "Authentication occurred outside normal business hours."

            })

    except:

        pass

    return anomalies