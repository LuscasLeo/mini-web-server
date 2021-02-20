import { IncomingMessage } from "http";
import { parseDataToMessage } from "./Parser";
import SocketSession, { MessageListener } from "./SocketSession";
import WSWebSocket from "ws";

export default class ServerSocketSession extends SocketSession<WSWebSocket> {
	readonly request: IncomingMessage;

	constructor(socket: WSWebSocket, request: IncomingMessage) {
		super(socket);
		this.request = request;
	}

	onMessage(listener: MessageListener) {
		this.socket.addEventListener("message", (event) =>
			listener(parseDataToMessage(event.data))
		);
	}
}
