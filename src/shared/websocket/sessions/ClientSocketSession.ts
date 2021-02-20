import { parseDataToMessage } from "./Parser";
import SocketSession, { MessageListener } from "./SocketSession";

export class ClientSocketSession extends SocketSession<WebSocket> {
	onMessage(listener: MessageListener) {
		this.socket.addEventListener("message", (event) =>
			listener(parseDataToMessage(event.data))
		);
	}
}
