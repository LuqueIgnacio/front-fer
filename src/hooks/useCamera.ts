import { useEffect, useState } from "react";
export default function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>){
    const [isRecording, setIsRecording] = useState(false);
    useEffect(() => {
        const startCamera = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              console.log("videoref", videoRef.current.videoWidth)
              setIsRecording(true);
            }
          } catch (err) {
            console.error("Error al acceder a la cámara:", err);
          }
        };
        startCamera();
    }, []);
    return {isRecording}
}