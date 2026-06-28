import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";

import { useEffect } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ----------------------------------------------------
// Fix Leaflet Default Icons
// ----------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

});


// ----------------------------------------------------
// Auto Fit Map
// ----------------------------------------------------

function FitBounds({ events }) {

    const map = useMap();

    useEffect(() => {

        if (!events.length) return;

        const bounds = events.map(event => [

            event.geo.latitude,

            event.geo.longitude

        ]);

        map.fitBounds(bounds, {

            padding: [40, 40]

        });

    }, [events, map]);

    return null;
}


// ----------------------------------------------------
// Marker Colors
// ----------------------------------------------------

const successIcon = new L.Icon({

    iconUrl:

        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

    shadowUrl:

        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41]

});

const failedIcon = new L.Icon({

    iconUrl:

        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

    shadowUrl:

        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41]

});


// ----------------------------------------------------
// Component
// ----------------------------------------------------

function GeoMap({ events }) {

    const validEvents = events.filter(

        event =>

            event.geo &&

            event.geo.latitude &&

            event.geo.longitude

    );

    const successCount = validEvents.filter(

        e => e.status === "Success"

    ).length;

    const failedCount = validEvents.filter(

        e => e.status === "Failed"

    ).length;

    const countries = new Set(

        validEvents.map(

            e => e.geo.country

        )

    );

    return (

        <div className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl p-5 mt-8">

            {/* Header */}

            <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-lg bg-cyan-900 flex items-center justify-center text-cyan-300 text-lg">

                    🌍

                </div>

                <div>

                    <h2 className="text-white text-xl font-semibold">

                        Authentication Origins

                    </h2>

                    <p className="text-gray-400 text-sm">

                        Authentication events by geographical location

                    </p>

                </div>

            </div>

            {/* Summary Chips */}

            <div className="flex gap-3 flex-wrap mb-5">

                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300">

                    🌍 Countries : {countries.size}

                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">

                    📍 Locations : {validEvents.length}

                </div>

                <div className="bg-green-900/30 border border-green-700 rounded-lg px-3 py-2 text-sm text-green-400">

                    🟢 Success : {successCount}

                </div>

                <div className="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-sm text-red-400">

                    🔴 Failed : {failedCount}

                </div>

            </div>

            {

                validEvents.length === 0 ?

                (

                    <div className="h-[500px] flex items-center justify-center text-gray-400">

                        No Authentication Locations Found

                    </div>

                )

                :

                (

                    <MapContainer

                        style={{

                            height: "500px",

                            width: "100%",

                            borderRadius: "12px"

                        }}

                    >

                        <FitBounds events={validEvents} />

                        {/* Dark Theme Map */}

                        <TileLayer

                            attribution="&copy; OpenStreetMap contributors &copy; CARTO"

                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

                        />

                        {

                            validEvents.map((event, index) => (

                                <Marker

                                    key={index}

                                    position={[

                                        event.geo.latitude,

                                        event.geo.longitude

                                    ]}

                                    icon={

                                        event.status === "Success"

                                            ? successIcon

                                            : failedIcon

                                    }

                                >

                                    <Popup>

                                        <div className="space-y-2">

                                            <h3 className="font-bold text-base">

                                                🛡 Authentication Event

                                            </h3>

                                            <hr />

                                            <p>

                                                <strong>Status:</strong> {event.status}

                                            </p>

                                            <p>

                                                <strong>Country:</strong> {event.geo.country}

                                            </p>

                                            <p>

                                                <strong>Region:</strong> {event.geo.region}

                                            </p>

                                            <p>

                                                <strong>City:</strong> {event.geo.city}

                                            </p>

                                            <p>

                                                <strong>IP:</strong> {event.ip_address}

                                            </p>

                                            <p>

                                                <strong>Browser:</strong> {event.browser}

                                            </p>

                                            <p>

                                                <strong>Timestamp:</strong> {event.timestamp}

                                            </p>

                                        </div>

                                    </Popup>

                                </Marker>

                            ))

                        }

                    </MapContainer>

                )

            }

        </div>

    );

}

export default GeoMap;