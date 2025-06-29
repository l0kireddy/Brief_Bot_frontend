import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "video/mp4", "video/quicktime", "audio/x-m4a"];

  const handleFile = (selectedFile) => {
    if (!validTypes.includes(selectedFile.type)) {
      setError("❌ Unsupported file type! Only audio/video allowed.");
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    setLoading(true);
    setTranscript("");
    setSummary("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch summary");

      const data = await res.json();
      setTranscript(data.transcript);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  return (
    <div className="container">
      <h1>🎙️ AI Meeting Summarizer</h1>

      <div
        className="dropzone"
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p>📂 Drag & Drop your audio/video file here or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file && <p className="filename">✅ Selected: {file.name}</p>}
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Summarize"}
      </button>

      {/* 🔵 PROGRESS BAR */}
      {loading && (
        <div className="progress-bar-wrapper">
          <div className="progress-bar"></div>
          <p className="loading-text"> Transcribing & Summarizing your meeting...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="output">
        {transcript && (
          <div className="card">
            <h2>📝 Transcript</h2>
            <pre>{transcript}</pre>
          </div>
        )}

        {summary && (
          <div className="card">
            <h2>📋 Summary</h2>
            <pre>{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
