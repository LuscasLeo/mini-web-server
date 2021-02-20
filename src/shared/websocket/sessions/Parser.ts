import Message from "../messages/Message";

export function parseDataToMessage<T>(message: string) {
    return JSON.parse(message) as Message<T>;
}

export function parseMessageToData<T>(message: Message<T>) {
    return JSON.stringify(message);
}
