import { useState } from "react";

function App() {
  const [text, setText] = useState(""); // manual input
  const [fileContent, setFileContent] = useState(""); // uploaded file
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = async () => {
    const inputText = fileContent || text;

    if (!inputText.trim()) {
      setResult("Please enter some text or upload a file to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:3001/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResult(`${data.sentiment} (${data.score.toFixed(2)})`);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error: Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      setResult("Error: Please upload a text file (.txt)");
      return;
    }

    if (file.size > 1024 * 1024) {
      setResult("Error: File size must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setResult("File loaded successfully! Click 'Analyze' to get sentiment.");
    };
    reader.onerror = () => {
      setResult("Error: Failed to read file");
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    setText("");
    setFileContent("");
    setFileName("");
    setResult("");
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Sentiment Analyzer
      </h1>

      {/* File Upload */}
      <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
        <h3 className="text-lg font-medium text-gray-600 mb-4">
          Upload Text File
        </h3>
        <input
          id="fileInput"
          type="file"
          accept=".txt,text/*"
          onChange={handleFileUpload}
          className="border border-gray-300 rounded px-3 py-2 bg-white"
        />
        {fileName && (
          <p className="text-green-600 font-semibold mt-2">
            📁 File loaded: {fileName}
          </p>
        )}
      </div>

      {/* Manual Text Input */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Or Enter Text Manually
        </h3>
        <textarea
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze or upload a file above..."
          className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-800 text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Character count: {text.length} / 1000
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={analyze}
          disabled={isAnalyzing || (!text.trim() && !fileContent)}
          className={`px-6 py-3 rounded-lg font-semibold text-white ${
            isAnalyzing || (!text.trim() && !fileContent)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isAnalyzing ? "🔄 Analyzing..." : "🔍 Analyze Sentiment"}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`p-5 rounded-lg font-bold text-lg mb-6 ${
            result.startsWith("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {result}
        </div>
      )}

      {/* Instructions */}
      <div className="p-5 bg-gray-100 rounded-lg text-gray-700">
        <h4 className="font-medium text-gray-800 mb-2">📋 How to Use:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Upload a file:</strong> Click "Choose File" and select a
            .txt file
          </li>
          <li>
            <strong>Manual input:</strong> Type or paste text directly in the
            textarea
          </li>
          <li>
            <strong>Analyze:</strong> Click "Analyze Sentiment" to get the
            sentiment score
          </li>
          <li>
            <strong>Supported files:</strong> .txt files only, max 1MB
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
