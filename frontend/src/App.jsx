import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setTranscript(data.transcript);
    setSummary(data.summary);
  };

  return (
    <div className="container">
      <h1>🎙️ AI Meeting Summarizer</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Summarize</button>

      <div className="output">
        {transcript && (
          <>
            <h2>📝 Transcript</h2>
            <pre>{transcript}</pre>
          </>
        )}

        {summary && (
          <>
            <h2>📋 Summary</h2>
            <pre>{summary}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
