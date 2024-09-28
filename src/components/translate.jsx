import React, { useState } from "react";
import "../styles/translate.css";

const Translate = () => {
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en-IN"); // Default to English (India)
  const [targetLanguage, setTargetLanguage] = useState("hi-IN"); // Default to Hindi
  const [speakerGender, setSpeakerGender] = useState("Male"); // Default to Male
  const [mode, setMode] = useState("formal"); // Default to Formal
  const [model, setModel] = useState("mayura:v1"); // Default to Mayura:v1
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    setError("");
    setTranslatedText(""); // Reset translated text on new request

    if (!inputText) {
      setError("Please enter text to translate.");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "api-subscription-key": "0002f06c-4cf2-4f89-9179-ef09a1f62429",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: inputText,
        source_language_code: sourceLanguage,
        target_language_code: targetLanguage,
        speaker_gender: speakerGender,
        mode: mode,
        model: model,
        enable_preprocessing: false,
      }),
    };

    try {
      const response = await fetch("https://api.sarvam.ai/translate", options);
      const data = await response.json();

      if (response.ok && data.translated_text) {
        setTranslatedText(data.translated_text); // Display the translated text
      } else {
        setError(data.error?.message || "Translation failed.");
      }
    } catch (err) {
      setError("Error occurred during translation. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="translate-container">
      <h1>Text Translator</h1>
      
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
        rows="4"
      />

      <div className="controls">
        <div className="field">
          <label>Source Language</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
          >
            <option value="en-IN">English (India)</option>
            <option value="hi-IN">Hindi</option>
            <option value="bn-IN">Bengali</option>
            <option value="kn-IN">Kannada</option>
            <option value="ml-IN">Malayalam</option>
            <option value="mr-IN">Marathi</option>
            <option value="pa-IN">Punjabi</option>
            <option value="ta-IN">Tamil</option>
            <option value="te-IN">Telugu</option>
            <option value="gu-IN">Gujarati</option>
          </select>
        </div>

        <div className="field">
          <label>Target Language</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="hi-IN">Hindi</option>
            <option value="bn-IN">Bengali</option>
            <option value="kn-IN">Kannada</option>
            <option value="ml-IN">Malayalam</option>
            <option value="mr-IN">Marathi</option>
            <option value="pa-IN">Punjabi</option>
            <option value="ta-IN">Tamil</option>
            <option value="te-IN">Telugu</option>
            <option value="gu-IN">Gujarati</option>
          </select>
        </div>

        <div className="field">
          <label>Speaker Gender</label>
          <select
            value={speakerGender}
            onChange={(e) => setSpeakerGender(e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="field">
          <label>Translation Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="formal">Formal</option>
            <option value="code-mixed">Code-mixed</option>
          </select>
        </div>

        <div className="field">
          <label>Translation Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="mayura:v1">Mayura:v1</option>
          </select>
        </div>
      </div>

      <button onClick={handleTranslate}>Translate</button>
      
      {error && <p className="error">{error}</p>}
      
      {translatedText && (
        <div className="translated-result">
          <h2>Translated Text:</h2>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default Translate;
