import {token} from "./storage.js";

export const socket = new WebSocket(`wss://mighty-cove-31255.herokuapp.com/websockets?${token}`);

export function sendMessageToServer(textInput) {
    console.log(socket.readyState);
    socket.send(JSON.stringify({
        text: textInput,
    }));
}