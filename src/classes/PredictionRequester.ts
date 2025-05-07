import type { PredictionResultI } from "../types";

export default class PredictionRequester{
    private canvas;
    private socket;
    public stopRequesting = true;
    public predictionResult = 0;
    public predictionsResults: PredictionResultI[];

    constructor(predictionsResults: PredictionResultI[]){
        this.socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)
        this.socket.onopen = () =>{
            console.log("socket abierto");
        };
        this.socket.onerror = () =>{
            console.log("error en socket");
        };
        this.socket.onmessage = (event: MessageEvent) =>{
            this.predictionResult = Number(event.data);
            this.predictionsResults.push({emotion: this.predictionResult, time: Date.now()})
        }
        this.predictionsResults = predictionsResults
        this.canvas = document.getElementById("face") as HTMLCanvasElement;
        this.sendRequest();
    }

    private sendRequest(){
        setInterval(() =>{
            if(this.stopRequesting){
                return
            }
            this.canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob!);
                reader.onloadend = () => {
                  const arrayBuffer = reader.result;
                  this.socket.send(arrayBuffer!);
                  
                  // Aquí tienes los bytes como Uint8Array
                  console.log("hago petición", arrayBuffer);
                };
              }, 'image/png')
        }, import.meta.env.VITE_MS_REQUESTS)
    }
}