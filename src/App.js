import React, { useState } from "react";

const API_URL = "https://1u5txu1g0h.execute-api.us-east-1.amazonaws.com/text2speech_stage";
const MAX_CHAR_LIMIT = 500;

function App() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Joanna");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  // Handle text input
  const handleTextChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length > MAX_CHAR_LIMIT) {
      setError(`Character limit exceeded!`);
    }
    else {
      setError("");
      setText(inputText);
    }
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) {
      setMessage("Please enter the text.");
      return;
    }

    setMessage("Processing...");
    setIsProcessing(true);

    const requestBody = {
      text: text,
      choice_of_voice: voice
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), 
      });

      const data = await response.json();

      console.log(data);

      if (data.download_url) {
        setDownloadUrl(data.download_url);
        setMessage("Conversion successful! Click the button to download.");
      } else {
        setMessage("Error: Could not process request.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }

    setIsProcessing(false);
  };
  

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Text-to-Speech Converter</h2>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your text here"
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        maxLength={MAX_CHAR_LENGTH}
      />
      <p style={{ color: text.length > MAX_CHAR_LIMIT ? "red" : "black" }}>
        {text.length}/{MAX_CHAR_LIMIT}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Voice Selection */}
      <select
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option value="Joanna">Joanna (Female)</option>
        <option value="Matthew">Matthew (Male)</option>
      </select>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isProcessing || text.length > MAX_CHAR_LIMIT || text.length === 0}
        style={{
          width: "100%",
          padding: "10px",
          background: isProcessing || text.length > MAX_CHAR_LIMIT || text.length === 0 ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: isProcessing || text.length > MAX_CHAR_LIMIT || text.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? "Processing..." : "Convert to Speech"}
      </button>

      {/* Status Message */}
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      {/* Download Button */}
      {downloadUrl && (
        <a href={downloadUrl} download="speech.mp3">
          <button style={{ marginTop: "20px", padding: "10px", background: "green", color: "white", border: "none" }}>
            Download Audio
          </button>
        </a>
      )}
    </div>
  );
}

export default App;
