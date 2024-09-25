import { useState, useEffect, useCallback } from 'react';
import './App.css';

const LightStrip = () => {
  const [lights, setLights] = useState([false, false, false, false, false, false]);
  const [sequenceCount, setSequenceCount] = useState(0);
  const [manualSequence, setManualSequence] = useState([2, 1, 3, 5, 0, 2, 1]); // Initial manual sequence
  const [inputSequence, setInputSequence] = useState(""); // To store user input sequence

  // Define light colors
  const colors = [
    "rgb(0, 255, 255)", // Skyblue
    "rgb(255, 255, 255)", // White
    "rgb(255, 192, 203)", // Pink
    "rgba(255, 0, 0, 0.6)", // Red
    "rgba(255, 165, 0, 0.6)", // Orange
    "rgba(255, 255, 0, 0.6)", // Yellow
  ];

  // Toggle a light on/off
  const toggleLight = useCallback((index: number) => {
    setLights((prevLights) => {
      const newLights = [...prevLights];
      newLights[index] = !newLights[index];
      return newLights;
    });
  }, []);

  useEffect(() => {
    const lightSequence = [];

    const interval = setInterval(() => {
      let lightIndex;

      // If the sequence count is less than the manual sequence length, toggle lights in sequence
      if (sequenceCount < manualSequence.length) {
        lightIndex = manualSequence[sequenceCount]; // Sequential toggling
        setSequenceCount((prevCount) => prevCount + 1);
      } else {
        // After reaching the end of the manual sequence, toggle lights randomly
        lightIndex = Math.floor(Math.random() * lights.length);
      }

      // Add the light index to the sequence and toggle the light
      lightSequence.push(lightIndex);
      toggleLight(lightIndex);

      return () => clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [sequenceCount, toggleLight, lights.length, manualSequence]);

  // Function to handle user input
  const handleInputChange = (e: any) => {
    setInputSequence(e.target.value);
  };

  // Function to handle applying the new sequence after a 4-second delay or on pressing enter
  const handleApplySequence = (e: any) => {
    if (e.key === "Enter") {
      try {
        const parsedSequence = JSON.parse(inputSequence);

        // Validate if the input is an array of numbers
        if (Array.isArray(parsedSequence) && parsedSequence.every(num => typeof num === 'number')) {
          setTimeout(() => {
            setManualSequence(parsedSequence);
            setSequenceCount(0); // Reset the sequence count
          }, 4000); // 4-second delay
        } else {
          alert("Please enter a valid array of numbers.");
        }
      } catch (error) {
        alert("Invalid input. Please enter a valid array.");
      }
    }
  };

  return (
    <div className="container">
      <div className="light-strip">
        {lights.map((isOn, index) => (
          <div
            key={index}
            className={`light ${isOn ? "on" : ""}`}
            style={{ backgroundColor: colors[index] }}
          />
        ))}
      </div>
      <div className="screen">
        {lights.map((isOn, index) =>
          isOn ? (
            <div
              key={index}
              className="light-cone"
              style={{
                marginTop: '-20px',
                background: `radial-gradient(circle at ${(index + 0.5) * 16.66}% 0%, ${colors[index]} 0%, transparent 80%)`,
                clipPath: `polygon(${(index * 16.66) + 10}% 0%, ${(index + 1) * 16.66 - 10}% 0%, ${(index + 1) * 16.66 + 5}% 100%, ${(index * 16.66) - 5}% 100%)`,
                animation: `rotate-cone-${index % 2 === 0 ? 'left' : 'right'}-${index} 5s infinite ease-in-out`,
                transformOrigin: `${(index + 0.5) * 16.66}% 0%` // Rotates around the specific light source
              }}
            />
          ) : null
        )}
      </div>

      {/* Input field to accept a new sequence */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter light sequence as array (e.g., [2,1,3,5,0])"
          value={inputSequence}
          onChange={handleInputChange}
          onKeyDown={handleApplySequence}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="app-container">
        <LightStrip />
      </div>
    </>
  );
}

export default App;
