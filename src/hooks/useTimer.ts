import { useRef, useState } from "react";

export default function useTimer(){
    const [startTime, setStartTime] = useState<number|null>(null);
    const [now, setNow] = useState<number|null>(null);
    const intervalRef = useRef<number|null>(null);

    function handleStartTimer(){
        setStartTime(Date.now());
        setNow(Date.now());

        clearInterval(intervalRef.current!);
        intervalRef.current = setInterval(() => {
        setNow(Date.now());
        }, 10);
    }

    function handleStopTimer(){
        clearInterval(intervalRef.current!);
    }

    let formattedTime = "";
    if (startTime != null && now != null) {
        const diff = now - startTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const milliseconds = diff % 1000;
        formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }
    return {handleStartTimer, handleStopTimer, formattedTime}
    
}