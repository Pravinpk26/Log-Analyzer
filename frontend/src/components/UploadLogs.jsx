import { useState } from "react";
import { uploadLog, getEvents } from "../services/api";

function UploadLogs({ onUpload }) {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {

        if (!file) return;

        setLoading(true);

        try {

            await uploadLog(file);

            const events = await getEvents();

            onUpload(events.events);

            alert("Log uploaded successfully!");

        }

        catch (error) {

            console.error(error);

            alert("Upload Failed");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

            <h2 className="text-xl font-bold mb-4">

                Upload Authentication Logs

            </h2>

            <div className="flex gap-4 items-center">

                <input

                    type="file"

                    accept=".json,.csv"

                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }

                />

                <button

                    onClick={handleUpload}

                    className="bg-green-600 text-white px-6 py-2 rounded-lg"

                >

                    {

                        loading

                            ?

                            "Uploading..."

                            :

                            "Upload"

                    }

                </button>

            </div>

        </div>

    );

}

export default UploadLogs;