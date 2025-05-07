import { useEffect, useRef, useState } from 'react';
import './App.css'
import * as faceapi from 'face-api.js';
import useCamera from './hooks/useCamera';
import startCanvas from './func/drawCanvas';
import useTimer from './hooks/useTimer';
import type { PredictionResultI } from './types';
import TimeSeriesChart from './components/TimeSeriesChart';
import ColumnChart from './components/ColumnChart';

function App() {
  const videoRef = useRef<HTMLVideoElement >(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number|null>(null);
  const predictionResultsRef = useRef<PredictionResultI[]>([]);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [stopDetecting, setStopDetecting] = useState(true);
  const [displayedResults, setDisplayedResults] = useState<PredictionResultI[]>([]);

  const {isRecording} = useCamera(videoRef);
  const {formattedTime, handleStartTimer, handleStopTimer} = useTimer();
  
  useEffect(() => {
    faceapi.nets.tinyFaceDetector.loadFromUri("models").then(() => setIsModelLoaded(true));
  }, [])
  
  const handleStopDetecting = () =>{
    animationIdRef.current = null;
    setStopDetecting(true);
    handleStopTimer();
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setDisplayedResults(predictionResultsRef.current);
    console.log("stop canvas", predictionResultsRef.current);
  }

  const handleStartDetecting = () =>{
    if(isRecording && isModelLoaded){
      predictionResultsRef.current = [];
      console.log("start canvas", predictionResultsRef);
      animationIdRef.current = 1;
      startCanvas(canvasRef.current!, videoRef.current!, animationIdRef, predictionResultsRef.current);
      setStopDetecting(false);
      handleStartTimer();
    }
  }

  return (
    <main style={{display: 'grid', gridTemplateColumns: "1fr 2fr", gap: "1rem"}}>
      <div className='container' style={{ margin: "auto", padding: "1rem", position: "relative", width: "fit-content", gridColumn: "1"}}>
        <canvas width={640} height={480} ref={canvasRef} style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}/>
        <video ref={videoRef} width={640} height={480}/>
        <canvas id='face' width={48} height={48}/>
        <div style={{display: "flex", flexDirection: "column"}}>
          {stopDetecting ? (<button disabled={!isModelLoaded} onClick={handleStartDetecting}>Empezar</button>) 
          : 
          <button onClick={handleStopDetecting}>Detener</button>
          }
          <span>{formattedTime}</span>
        </div>
      </div>

      <div className='container' style={{gridColumn: "2", width: "100%", paddingTop: "1rem"}}>
        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
          <div style={{width: "100%"}}>
            <TimeSeriesChart data={displayedResults}/>
          </div>
          <div style={{width: "100%"}}>
            <ColumnChart data={displayedResults}/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
