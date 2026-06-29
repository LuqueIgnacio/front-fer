import { useEffect, useState } from "react";

export default function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Guardamos una referencia local para saber si el efecto fue cancelado
    let isCancelled = false;
    let localStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
        if (isCancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        localStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.warn("El auto-play fue bloqueado o interrumpido:", err);
          });

          console.log("Cámara iniciada correctamente.");
          setIsRecording(true);
        }
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      setIsRecording(false);
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [videoRef]);

  return { isRecording };
}