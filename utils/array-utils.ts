export function upsertIntoArray<T>(array: T[], element: T, idKey: keyof T): T[] {
    // (1)
    const i = array.findIndex((e) => e[idKey] === element[idKey]);
    if (i > -1)
        array[i] = element; // (2)
    else array.push(element);
    return [...array];
}
