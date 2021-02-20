export enum MessageHeader {
	HANDSHAKE,
	CONNECTION_CLOSE,
	CONNECTION_ERROR,
	CONNECTION_OPEN,
	CONNECTION_PING,
	CONNECTION_PONG,
	CONNECTION_UNEXPECTED_RESPONSE,
}

export type HeadersToMessages = {
	[MessageHeader.HANDSHAKE]: { message: string };
	[MessageHeader.CONNECTION_CLOSE]: {};
	[MessageHeader.CONNECTION_ERROR]: { error: Error };
	[MessageHeader.CONNECTION_OPEN]: {};
	[MessageHeader.CONNECTION_PING]: { data: Buffer };
	[MessageHeader.CONNECTION_PONG]: { data: Buffer };
	[MessageHeader.CONNECTION_UNEXPECTED_RESPONSE]: {};
};
