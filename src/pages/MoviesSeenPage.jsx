import React, { useState } from "react";
import "../styles/Profile.css";

export default function MovieSeen() {
    const [activeTab, setActiveTab] = useState("latott");
    return (
        <div className="profile-page">
            {/* Felső rész */}
            <div className="profile-header">
                <img
                    className="avatar"
                    src="https://placehold.co/80x80"
                    alt="avatar"
                />
                <span className="username">fnaf_fan01</span>
            </div>

            {/* Navigációs gombok */}
            <div className="profil-tabs">
                <button
                    className={activeTab === "profil" ? "active" : ""}
                    onClick={() => setActiveTab("profil")}
                >
                    Profil
                </button>

                <button
                    className={activeTab === "latott" ? "active" : ""}
                    onClick={() => setActiveTab("latott")}
                >
                    Látott
                </button>

                <button
                    className={activeTab === "tervezett" ? "active" : ""}
                    onClick={() => setActiveTab("tervezett")}
                >
                    Tervezett látni
                </button>

                <button
                    className={activeTab === "ertekelesek" ? "active" : ""}
                    onClick={() => setActiveTab("ertekelesek")}
                >
                    Értékelések
                </button>
            </div>
            {/* Filmek */}
            <div className="movie-list">
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
            </div>
            <div className="movie-list">
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
            </div>
            <div className="movie-list">
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
            </div>
            <div className="movie-list">
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
                <img src="https://placehold.co/120x180" alt="movie" />
            </div>
        </div>
    );
}