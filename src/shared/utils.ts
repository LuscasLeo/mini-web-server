export const createLogger = (header: string) => {
	return [
		console.log,
		console.error,
		console.info,
		console.warn,
		console.debug,
	].map((log) => (...etc: any[]) => log(`${header}`, ...etc));
};

export function transformCsv(data: string[][]) {
	const header = data.shift()!;
	const list: any[] = [];
	for (const row of data) {
		const rowObj: any = {};
		for (const index in header) {
			rowObj[header[index]] = row[index];
		}
		list.unshift(rowObj);
	}

	return list;
}

export function csvToObject<T>(
	data: any[],
	mapper: { [key: string]: keyof T }
) {
	const arr: T[] = [];

	for (const row of data) {
		const rowObj: { [key in keyof T]: any } = Object.create(null);
		for (const [key] of Object.entries(mapper)) {
			rowObj[mapper[key]] = row[key];
		}
		arr.unshift(rowObj);
	}

	return arr;
}
