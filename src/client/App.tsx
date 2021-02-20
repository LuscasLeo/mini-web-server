import React from "react";
import { hot } from "react-hot-loader/root";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import { WebSocketProvider } from "./store/WebSocketContext";

const App: React.FC<{}> = () => {
	return (
		<WebSocketProvider url={`ws://localhost:5511`}>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Home} />
				</Switch>
			</BrowserRouter>
		</WebSocketProvider>
	);
};
export default hot(App);
