import { useEffect, useRef, useState } from 'react';
import './App.css'; // Asegúrate de incluir los nuevos estilos aquí
import * as faceapi from 'face-api.js';
import useCamera from './hooks/useCamera';
import startCanvas from './func/drawCanvas';
import useTimer from './hooks/useTimer';
import type { PredictionResultI } from './types';
import TimeSeriesChart from './components/TimeSeriesChart';
import ColumnChart from './components/ColumnChart';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const predictionResultsRef = useRef<PredictionResultI[]>([]);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [stopDetecting, setStopDetecting] = useState(true);
  const [displayedResults, setDisplayedResults] = useState<PredictionResultI[]>([]);

  const { isRecording } = useCamera(videoRef);
  const { formattedTime, handleStartTimer, handleStopTimer } = useTimer();

  useEffect(() => {
    faceapi.nets.tinyFaceDetector.loadFromUri(`${import.meta.env.BASE_URL}/models`)
      .then(() => setIsModelLoaded(true));
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const handleStopDetecting = () => {
    animationIdRef.current = null;
    setStopDetecting(true);
    handleStopTimer();
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setDisplayedResults(predictionResultsRef.current);
    console.log("stop canvas", predictionResultsRef.current);
  };

  const handleStartDetecting = () => {
    if (isRecording && isModelLoaded) {
      predictionResultsRef.current = [];
      console.log("start canvas", predictionResultsRef);
      animationIdRef.current = 1;
      startCanvas(canvasRef.current!, videoRef.current!, animationIdRef, predictionResultsRef.current);
      setStopDetecting(false);
      handleStartTimer();
    }
  };

  return (
    <main className="dashboard-layout">
      {/* Panel Izquierdo: Cámara y Controles */}
      <section className="card camera-card">
        <header className="card-header">
          <h2>Reconocimiento Facial</h2>
          {!isModelLoaded && <span className="badge warning">Cargando modelo...</span>}
          {isModelLoaded && stopDetecting && <span className="badge success">Listo</span>}
          {!stopDetecting && <span className="badge danger animate-pulse">Grabando</span>}
        </header>

        <div className="media-container">
          <video ref={videoRef} width={640} height={480} className="video-feed" />
          <canvas ref={canvasRef} width={640} height={480} className="overlay-canvas" />
          {/* El canvas mini oculto o con uso secundario por si lo necesitas de debug */}
          <canvas id="face" width={48} height={48} style={{ display: 'none' }} />
        </div>

        <footer className="controls-panel">
          {stopDetecting ? (
            <button 
              className="btn btn-primary" 
              disabled={!isModelLoaded} 
              onClick={handleStartDetecting}
            >
              Empezar detección
            </button>
          ) : (
            <button className="btn btn-danger" onClick={handleStopDetecting}>
              Detener análisis
            </button>
          )}
          <div className="timer-display">
            <span className="timer-icon">⏱</span>
            <span className="timer-text">{formattedTime}</span>
          </div>
        </footer>
      </section>

      {/* Panel Derecho: Gráficos de Métricas */}
      <section className="card charts-card">
        <header className="card-header">
          <h2>Métricas y Resultados</h2>
        </header>
        
        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Evolución Temporal</h3>
            <TimeSeriesChart data={displayedResults} />
          </div>
          <hr className="divider" />
          <div className="chart-wrapper">
            <h3>Distribución de Datos</h3>
            <ColumnChart data={displayedResults} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;