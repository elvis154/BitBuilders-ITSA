import React, { useState } from 'react';
import "../styles/texttospeech.css"; // Ensure this file contains your styles

const TextToSpeech = () => {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('hi-IN');
  const [speaker, setSpeaker] = useState('meera');
  const [pitch, setPitch] = useState(0);
  const [pace, setPace] = useState(1);
  const [loudness, setLoudness] = useState(1);
  const [speechSampleRate, setSpeechSampleRate] = useState(8000);
  const [model, setModel] = useState('bulbul:v1');
  const [audioSrc, setAudioSrc] = useState(null);
  const [error, setError] = useState(null);
  const [enablePreprocessing, setEnablePreprocessing] = useState(true); // Added back

  const handleConvertTextToSpeech = async () => {
    if (!inputText) {
      setError('Please enter some text to convert to speech.');
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'api-subscription-key': '0002f06c-4cf2-4f89-9179-ef09a1f62429', // Use environment variable
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [inputText], // List of input sentences
        target_language_code: targetLanguage, // Language code
        speaker: speaker, // Speaker
        pitch, // Pitch of the generated speech
        pace, // Pace of the generated speech
        loudness, // Loudness of the generated speech
        speech_sample_rate: speechSampleRate, // Sample rate
        model: model, // Model to use
        enable_preprocessing: enablePreprocessing, // Include preprocessing
      }),
    };

    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', options);
      const data = await response.json();

      if (response.ok) {
        if (data && data.audios && data.audios[0]) {
          const base64Audio = data.audios[0];
          const audioBlob = base64ToBlob(base64Audio, 'audio/wav');
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);
          setError(null);
        } else {
          setError('Audio data not found in response. Please check the API documentation.');
        }
      } else {
        const errorMessage = data?.error?.message || 'Failed to convert text to speech.';
        setError(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error occurred while processing the request.');
    }
  };

  // Function to convert base64 string to Blob
  const base64ToBlob = (base64, mime) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  };

  return (
    <div className="text-to-speech-container">
      <h1>Text to Speech Converter</h1>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to convert to speech"
        rows="4"
      />

      <div className="controls">
        <div className="field">
          <label>Target Language</label>
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
            <option value="hi-IN">Hindi</option>
            <option value="bn-IN">Bengali</option>
            <option value="kn-IN">Kannada</option>
            <option value="ml-IN">Malayalam</option>
            <option value="mr-IN">Marathi</option>
            <option value="od-IN">Odia</option>
            <option value="pa-IN">Punjabi</option>
            <option value="ta-IN">Tamil</option>
            <option value="te-IN">Telugu</option>
            <option value="en-IN">English</option>
            <option value="gu-IN">Gujarati</option>
          </select>
        </div>

        <div className="field">
          <label>Speaker</label>
          <select value={speaker} onChange={(e) => setSpeaker(e.target.value)}>
            <option value="meera">Meera</option>
            <option value="pavithra">Pavithra</option>
            <option value="maitreyi">Maitreyi</option>
            <option value="arvind">Arvind</option>
            <option value="amol">Amol</option>
            <option value="amartya">Amartya</option>
          </select>
        </div>

        <div className="field">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="bulbul:v1">bulbul:v1</option>
          </select>
        </div>

        <div className="field">
          <label>Pitch</label>
          <input
            type="number"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            min="0"
            max="10"
          />
        </div>

        <div className="field">
          <label>Pace</label>
          <input
            type="number"
            value={pace}
            onChange={(e) => setPace(Number(e.target.value))}
            min="0"
            max="10"
          />
        </div>

        <div className="field">
          <label>Loudness</label>
          <input
            type="number"
            value={loudness}
            onChange={(e) => setLoudness(Number(e.target.value))}
            min="-5"
            max="5"
          />
        </div>

        <div className="field">
          <label>Speech Sample Rate</label>
          <select
            value={speechSampleRate}
            onChange={(e) => setSpeechSampleRate(Number(e.target.value))}
          >
            <option value="8000">8000 Hz</option>
            <option value="16000">16000 Hz</option>
            <option value="22050">22050 Hz</option>
          </select>
        </div>

        <div className="field">
          <label>
            <input
              type="checkbox"
              checked={enablePreprocessing}
              onChange={(e) => setEnablePreprocessing(e.target.checked)}
            />
            Enable Preprocessing
          </label>
        </div>
      </div>

      <button onClick={handleConvertTextToSpeech}>Convert to Speech</button>

      {error && <p className="error">{error}</p>}

      {audioSrc && (
        <div className="audio-result">
          <h2>Audio Result:</h2>
          <audio controls src={audioSrc} />
          <a href={audioSrc} download="output.wav">Download Audio</a>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
