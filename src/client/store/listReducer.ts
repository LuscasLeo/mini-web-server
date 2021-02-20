import { useReducer } from "react";
import { Action } from "./types";

export function useListReducer<T>(initialState: T[] = []) {
	function reducer(state: T[], action: Action<T[]>) {
		return action(state);
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	return {
		state,
		add(item: T) {
			dispatch((state) => [...state, item]);
		},
		addAll(items: T[]) {
			dispatch((state) => [...state, ...items]);
		},
		remove(item: T) {
			dispatch(
				(state) =>
					(state.indexOf(item) !== -1 && [
						...[...state].splice(0, state.indexOf(item)),
						...[...state].splice(state.indexOf(item) + 1),
					]) ||
					state
			);
		},
		clear() {
			() => [];
		},
		update(newValue: T[]) {
			() => newValue;
		},
	};
}

export type ListReducer<T> = {
	state: T[];
	add(item: T): void;
	addAll(items: T[]): void;
	remove(item: T): void;
	clear(): void;
	update(newValue: T[]): void;
};
