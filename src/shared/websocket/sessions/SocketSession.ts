import Message from "../messages/Message";
import { HeadersToMessages, MessageHeader } from "../messages/types";
import { parseMessageToData } from "./Parser";

export type SessionWebSocket = {
	send: (data: any) => void;
};

export type MessageListener = (message: Message<MessageHeader>) => void;

export default abstract class SocketSession<T extends SessionWebSocket> {
	readonly socket: T;

	constructor(socket: T) {
		this.socket = socket;
	}

	send<H extends keyof HeadersToMessages, D extends HeadersToMessages[H]>(
		header: H,
		payload: D
	) {
		this.socket.send(parseMessageToData({ header, payload }));
	}

	abstract onMessage(listener: MessageListener): void;
}
