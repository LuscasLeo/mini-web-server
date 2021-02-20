import { useReducer } from "react";
import { GenericType } from "typescript";
import { Action } from "./types";

export type DictKey = number | symbol | string;
export type Dict<V> = Record<DictKey, V>;

export function useDictReducer<V>(initialState: Dict<V> = {}) {
	function reducer(state: Dict<V>, action: Action<Dict<V>>) {
		return action(state);
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	return {
		state,
		put(key: DictKey, item: V) {
			dispatch((state) => ({
				...state,
				[key]: item,
			}));
		},
		putAll(entries: Record<DictKey, V>) {
			dispatch((state) => ({
				...state,
				...entries,
			}));
		},
		remove(key: DictKey) {
			dispatch((state) =>
				Object.entries(state)
					.filter(([k]) => k !== key)
					.reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {})
			);
		},
		entries() {
			return Object.entries(state);
		},
		clear() {
			dispatch(() => ({}));
		},
	};
}

export type DictReducer<V> = {
	state: Dict<V>;
	put(key: DictKey, item: V): void;
	putAll(entries: Record<DictKey, V>): void;
	remove(key: DictKey): void;
	entries(): [DictKey, V][];
	clear(): void;
};
