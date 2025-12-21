export const createNode = (cLhs, mLhs, cRhs, mRhs, boatLeft) => {
    return [{ c: cLhs, m: mLhs }, { c: cRhs, m: mRhs }, boatLeft];
}

export const movePeople = (lhs, rhs, boatLeft, cMoveCount, mMoveCount) => {
    const dir = boatLeft ? -1 : 1

    const cLhs = lhs.c + dir * cMoveCount;
    const mLhs = lhs.m + dir * mMoveCount;
    const cRhs = rhs.c - dir * cMoveCount;
    const mRhs = rhs.m - dir * mMoveCount;

    return createNode(cLhs, mLhs, cRhs, mRhs, !boatLeft);
}

export const getAllTransportCombinations = (cMax, mMax, boatCapacity) => {
    const result = [];

    for (var c = 0; c <= cMax; c++) {
        for (var m = 0; m <= mMax; m++) {
            // Skips if the boat would be empty
            if (c === 0 && m === 0) {
                continue;
            }

            // Skips if boat has missionaries on it but has more cannibals than missionaries
            if (m > 0 && c > m) {
                continue;
            }

            // Skips if cannibals and missionaries are more than the boat can take
            if (c + m > boatCapacity) {
                continue;
            }

            result.push([c, m]);
        }
    }

    return result;
}

export const getChildren = (leftSide, rightSide, boatCapacity, boatLeft) => {
    const result = [];

    const { c: cMax, m: mMax } = boatLeft ? leftSide : rightSide;
    const combinations = getAllTransportCombinations(cMax, mMax, boatCapacity);

    combinations.forEach((comb) => {
        result.push(movePeople(leftSide, rightSide, boatLeft, comb[0], comb[1]));
    });

    return result;
}

export const stringifyNode = (node) => {
    const lhs = node[0], rhs = node[1], boatLeft = node[2];
    return `${lhs.c},${lhs.m},${rhs.c},${rhs.m},${boatLeft}`
}

const win = () => {
    console.log("Win!");
}

const lose = () => {
    console.log("No solution found!");
}

// Breadth-first search for finding the winning formation
export const bfs = (n, boatCapacity) => {
    const start = createNode(n, n, 0, 0, true);
    const queue = [start];
    const visited = new Set();

    while (queue.length > 0) {
        const [lhs, rhs, boatLeft] = queue.shift();

        if ((lhs.c > lhs.m && lhs.m > 0) || (rhs.c > rhs.m && rhs.m > 0)) {
            // lose
            continue;
        }

        if (lhs.c === 0 && lhs.m === 0) {
            win();
            return true;
        }

        visited.add(stringifyNode([lhs, rhs, boatLeft]));

        const children = getChildren(lhs, rhs, boatCapacity, boatLeft);
        children.forEach((child) => {
            if (!visited.has(stringifyNode(child))) {
                queue.push(child);
            }
        })
    }

    lose();
    return false;
}