import React, { createContext, useContext, useState } from "react";
import { ClientSocketSession } from "../../shared/websocket/sessions/ClientSocketSession";

type State<T> = [T, (newValue: T) => void];

function WebSocketContext(
	connectionUrl: string,
	sessionState: State<ClientSocketSession | undefined>,
	connectState: State<boolean>
) {
	const [session, setSession] = sessionState;

	const [connected, setConnected] = connectState;

	return {
		session,
		connected,
		async connect() {
			return new Promise<ClientSocketSession>((rs) => {
				const socket = new WebSocket(connectionUrl);
				const session = new ClientSocketSession(socket);

				socket.addEventListener("open", () => {
					setSession(session);
					setConnected(true);
					rs(session);
				});
				socket.addEventListener("close", () => {
					setConnected(false);
				});
			});
		},
	};
}

export type WebSocketState = ReturnType<typeof WebSocketContext>;

const Context = createContext({} as WebSocketState);

const { Provider } = Context;

export interface Props {
	url: string;
}

export const WebSocketProvider: React.FC<Props> = ({ children, url }) => {
	const [session, setSession] = useState<ClientSocketSession | undefined>(
		undefined
	);
	const [connected, setConnected] = useState<boolean>(false);
	const ctx = WebSocketContext(
		url,
		[session, setSession],
		[connected, setConnected]
	);

	return <Provider value={{ ...ctx }}>{children}</Provider>;
};
export default WebSocketContext;

export const useWebSocket = () => useContext(Context);
