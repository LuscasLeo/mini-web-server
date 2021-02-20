import Message from "../messages/Message";
import { HeadersToMessages } from "../messages/types";

export type Handler<
	T extends keyof HeadersToMessages,
	U = unknown,
	J = HeadersToMessages[T]
> = (message: J, another: U) => void | Promise<void>;

export type MessagesHandler<A = unknown> = {
	[K in keyof HeadersToMessages]?: Handler<K, A>;
};

export function handleMessage<A>(
	handlerSet: MessagesHandler<A>,
	message: Message<any>,
	another: A
) {
	if (message.header in handlerSet) {
		const r = handlerSet[message.header]!(message.payload, another);
		if (r instanceof Promise) r.catch(console.error);
	}
}
