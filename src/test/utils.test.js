import { bfs, createNode, getAllTransportCombinations, getChildren, movePeople, stringifyNode } from "../utils"

test("createCannibalsAndMissionariesArray to correctly create objects", () => {
    expect(createNode(2, 2, 1, 1, true)).toEqual([{ c: 2, m: 2 }, { c: 1, m: 1 }, true]);
    expect(createNode(4, 0, 3, 1, false)).toEqual([{ c: 4, m: 0 }, { c: 3, m: 1 }, false]);
})

test("moveCannibalsAndMissionaries to correctly add and subtract for each side", () => {
    expect(movePeople({ c: 2, m: 2 }, { c: 1, m: 1 }, true, 1, 1)).toEqual(createNode(1, 1, 2, 2, false));
    expect(movePeople({ c: 1, m: 2 }, { c: 3, m: 4 }, false, 1, 1)).toEqual(createNode(2, 3, 2, 3, true));
})

test("getAllTransportCombinations to correctly return all possible combinations and not the wrong ones", () => {

    const res1 = getAllTransportCombinations(4, 4, 3);
    expect(res1).toEqual([[0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [2, 0], [3, 0]])

    // Not more cannibals than missionaries
    expect(res1).not.toContainEqual([2, 1]);

    // Not more passengers than boat capacity
    expect(res1).not.toContainEqual([3, 3]);
    expect(res1).not.toContainEqual([4, 4]);

    const res2 = getAllTransportCombinations(5, 5, 5);
    expect(res2).toContainEqual([2, 0]);
    expect(res2).toContainEqual([5, 0]);

    expect(res2).toContainEqual([1, 1]);
    expect(res2).toContainEqual([2, 3]);

    expect(res2).toContainEqual([0, 2]);
    expect(res2).toContainEqual([0, 5]);

    expect(res2).not.toContainEqual([3, 3]);
    expect(res2).not.toContainEqual([3, 1]);
})

test("getChildren to correctly return all possible children", () => {
    const res1 = getChildren({ c: 3, m: 3 }, { c: 3, m: 3 }, 2, true)
    expect(res1).toContainEqual([{ c: 3, m: 2 }, { c: 3, m: 4 }, false]);
    expect(res1).toContainEqual([{ c: 3, m: 1 }, { c: 3, m: 5 }, false]);
    expect(res1).toContainEqual([{ c: 2, m: 3 }, { c: 4, m: 3 }, false]);
    expect(res1).toContainEqual([{ c: 2, m: 2 }, { c: 4, m: 4 }, false]);
    expect(res1).toContainEqual([{ c: 1, m: 3 }, { c: 5, m: 3 }, false]);

    const res2 = getChildren({ c: 0, m: 0 }, { c: 5, m: 5 }, 5, false)
    expect(res2).toContainEqual([{ c: 1, m: 0 }, { c: 4, m: 5 }, true]);
    expect(res2).toContainEqual([{ c: 3, m: 0 }, { c: 2, m: 5 }, true]);
    expect(res2).toContainEqual([{ c: 5, m: 0 }, { c: 0, m: 5 }, true]);

    expect(res2).toContainEqual([{ c: 1, m: 1 }, { c: 4, m: 4 }, true]);
    expect(res2).toContainEqual([{ c: 2, m: 2 }, { c: 3, m: 3 }, true]);
    expect(res2).not.toContainEqual([{ c: 3, m: 3 }, { c: 2, m: 2 }, true]);

    expect(res2).toContainEqual([{ c: 0, m: 1 }, { c: 5, m: 4 }, true]);
    expect(res2).toContainEqual([{ c: 0, m: 3 }, { c: 5, m: 2 }, true]);
    expect(res2).toContainEqual([{ c: 0, m: 5 }, { c: 5, m: 0 }, true]);
})

test("stringifyNode to correctly convert nodes into strings", () => {
    expect(stringifyNode(createNode(2, 2, 1, 1, false))).toBe("2,2,1,1,false");
    expect(stringifyNode(createNode(4, 3, 2, 0, true))).toBe("4,3,2,0,true");
})

test("bfs to correctly determine winning formation", () => {
    expect(bfs(3, 2)).toBe(true);
    expect(bfs(4, 2)).toBe(false);
    expect(bfs(5, 3)).toBe(true);
    expect(bfs(10, 4)).toBe(true);
    expect(bfs(50, 4)).toBe(true);
})