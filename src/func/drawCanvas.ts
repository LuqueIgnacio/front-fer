import * as faceapi from 'face-api.js';
import PredictionRequester from '../classes/PredictionRequester';
import type { PredictionResultI } from '../types';
import { emotionsLabels } from '../constants';

export default async function startCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement, animationIdRef: React.RefObject<number|null>, predictionResult: PredictionResultI[]){
    const predictionRequester = new PredictionRequester(predictionResult);
    drawCanvas(canvas, video, animationIdRef, predictionRequester);
}

async function drawCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement, animationIdRef: React.RefObject<number|null>, predictionRequester: PredictionRequester){
    const ctx = canvas.getContext("2d")!;
    if(animationIdRef.current){
        const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
        //Limpia el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //Dibuja el rectángulo alrededor del rostro detectado
        const drawOptions = {
            label: emotionsLabels[predictionRequester.predictionResult],
            lineWidth: 2
        }
        if(detection){
            predictionRequester.stopRequesting = false;
            const drawBox = new faceapi.draw.DrawBox(detection.box, drawOptions)
            drawBox.draw(canvas)
            saveFace(detection.box, video)
        }else{
            predictionRequester.stopRequesting = true;
        }
        console.log(animationIdRef)
        requestAnimationFrame(() => drawCanvas(canvas, video, animationIdRef, predictionRequester));
    }else{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        predictionRequester.stopRequesting = true;
    }
    

}

function saveFace(box: faceapi.Box, video: HTMLVideoElement){
    const faceCanvas = document.getElementById("face") as HTMLCanvasElement;
    const ctx = faceCanvas.getContext("2d");

    const scaleX = video.videoWidth / video.clientWidth;
    const scaleY = video.videoHeight / video.clientHeight;

    const realX = box.x * scaleX;
    const realY = box.y * scaleY;
    const realWidth = box.width * scaleX;
    const realHeight = box.height * scaleY;

    ctx!.drawImage(
        video,
        Math.round(realX), Math.round(realY),
        Math.round(realWidth), Math.round(realHeight),
        0, 0, 48, 48
    );
}