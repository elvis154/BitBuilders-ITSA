import React, { useState } from 'react';
import "../styles/speechtotext.css"; // Ensure this file contains your styles

const SpeechToText = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [languageCode, setLanguageCode] = useState('hi-IN');
  const [model, setModel] = useState('saarika:v1');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleTranscription = async () => {
    if (!audioFile) {
      setError('Please upload an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('language_code', languageCode); // Language code
    formData.append('model', model); // Model to use for transcription

    const options = {
      method: 'POST',
      headers: {
        'api-subscription-key': '0002f06c-4cf2-4f89-9179-ef09a1f62429', // Use environment variable
      },
      body: formData,
    };

    setLoading(true);
    try {
      const response = await fetch('https://api.sarvam.ai/speech-to-text', options);
      const data = await response.json();

      if (response.ok) {
        if (data && data.transcript) {
          setTranscript(data.transcript);
          setError(null);
        } else {
          setError('Transcript data not found in response.');
        }
      } else {
        const errorMessage = data?.error?.message || 'Failed to transcribe the audio.';
        setError(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error occurred while processing the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="speech-to-text-container">
      <h1>Speech to Text Transcription</h1>

      <div className="controls">
        <div className="field">
          <label>Upload Audio File (WAV/MP3)</label>
          <input type="file" accept=".wav, .mp3" onChange={handleFileChange} />
        </div>

        <div className="field">
          <label>Language Code</label>
          <select value={languageCode} onChange={(e) => setLanguageCode(e.target.value)}>
            <option value="hi-IN">Hindi</option>
            <option value="bn-IN">Bengali</option>
            <option value="kn-IN">Kannada</option>
            <option value="ml-IN">Malayalam</option>
            <option value="mr-IN">Marathi</option>
            <option value="od-IN">Odia</option>
            <option value="pa-IN">Punjabi</option>
            <option value="ta-IN">Tamil</option>
            <option value="te-IN">Telugu</option>
            <option value="gu-IN">Gujarati</option>
          </select>
        </div>

        <div className="field">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="saarika:v1">saarika:v1</option>
          </select>
        </div>
      </div>

      <button onClick={handleTranscription} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe Audio'}
      </button>

      {error && <p className="error">{error}</p>}

      {transcript && (
        <div className="transcript-result">
          <h2>Transcription Result:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
