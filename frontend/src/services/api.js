const API_URL = "http://127.0.0.1:8000";

export async function scanWebsite(url) {

    const response = await fetch(
        `${API_URL}/scan?url=${encodeURIComponent(url)}`
    );

    return await response.json();
}

export async function uploadLog(file) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/upload-log`,
        {
            method: "POST",
            body: formData
        }
    );

    return await response.json();
}

export async function getEvents() {

    const response = await fetch(

        `${API_URL}/events`

    );

    return await response.json();

}