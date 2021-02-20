import { MessageHeader } from "./types";
export default abstract class Message<T> {
	readonly header: MessageHeader;
	abstract payload: T;
	constructor(header: MessageHeader) {
		this.header = header;
	}
}
