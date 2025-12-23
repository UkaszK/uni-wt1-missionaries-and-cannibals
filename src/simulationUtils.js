/*
 * The core functionality of this file was developed by myself.
 * Gemini was afterwards utilized to help increase code efficiency and reduce redundant function calls.
 * The file 'AI-Usage.txt' contains the chat log.
 */

const configuration = {
    canvasWidth: "100%",
    canvasHeight: 400,
    height: "100%",
    waterWidthPercent: 50,
    waterStartColor: "#6997ce",
    waterEndColor: "#5c84b1",
    shoreStartColor: "#78a251",
    shoreEndColor: "#587a45",
    boatWidthPercent: 10,
    boatHeightPercent: 15,
    boatColor: "#8a481e",
    boatDistanceFromShorePercent: 3,
    boatCornerRadius: 25,
    peoplePerLine: 3,
    verticalPeopleDistanceFromEdgesPercent: 30,
}

const draw = SVG().addTo("#canvas").size(configuration.canvasWidth, configuration.canvasHeight);

export const clearDraw = () => draw.clear();

export const toPercent = (num) => `${num}%`;

const getGradient = (start, end) => {
    return draw.gradient("linear", (add) => {
        add.stop(0, start);
        add.stop(1, end);
    }).from(0, 0).to(0, 1);
}

const getShoreWidth = () => (100 - configuration.waterWidthPercent) / 2;

export const createBackgroundElements = () => {
    const { height, waterWidthPercent } = configuration;
    const shoreWidth = getShoreWidth();

    draw.rect(toPercent(waterWidthPercent), height)
        .x(toPercent(shoreWidth))
        .fill(getGradient(configuration.waterStartColor, configuration.waterEndColor));

    const shoreGradient = getGradient(configuration.shoreStartColor, configuration.shoreEndColor);
    [0, 50 + waterWidthPercent / 2].forEach(posX => {
        draw.rect(toPercent(shoreWidth), height).x(toPercent(posX)).fill(shoreGradient);
    });
}

export const getBoatPositionX = (boatLeft) => {
    const shoreWidth = getShoreWidth();

    const boatLeftPosX = shoreWidth + configuration.boatDistanceFromShorePercent;
    const boatRightPosX = shoreWidth + configuration.waterWidthPercent - configuration.boatDistanceFromShorePercent - configuration.boatWidthPercent;

    return boatLeft ? boatLeftPosX : boatRightPosX;
}

export const createBoat = () => {
    const { boatWidthPercent, boatHeightPercent, boatColor, boatCornerRadius } = configuration;
    const boatPosX = getBoatPositionX(true);

    return draw.rect(toPercent(boatWidthPercent), toPercent(boatHeightPercent))
        .x(toPercent(boatPosX))
        .y(toPercent(50 - boatHeightPercent / 2))
        .fill(boatColor)
        .radius(boatCornerRadius);
}

export const getPersonCoords = (idx, isBottom = false, isRight = false) => {
    const { verticalPeopleDistanceFromEdgesPercent: yOffset } = configuration;
    const updatedOffset = isBottom ? 100 - yOffset : yOffset;

    const { peoplePerLine } = configuration;
    const shoreWidth = getShoreWidth();
    const slot = shoreWidth / (peoplePerLine + 1);

    const shoreStart = isRight ? (100 - shoreWidth) : 0;

    const x = shoreStart + slot + (idx % peoplePerLine) * slot;
    const row = Math.floor(idx / peoplePerLine);
    const y = isBottom ? updatedOffset - (row * 8) : updatedOffset + (row * 8);

    return { x: toPercent(x), y: toPercent(y) };
}

export const getBoatCenterCoords = (isLeft) => {
    const { boatWidthPercent } = configuration;
    const x = getBoatPositionX(isLeft) + (boatWidthPercent / 2);
    const y = 50;
    return { x, y };
}

export const createPeople = (n) => {
    const { peoplePerLine } = configuration;
    const radius = toPercent(getShoreWidth() / (peoplePerLine + 1) / 2);
    const result = [{ c: [], m: [] }, { c: [], m: [] }];

    for (let i = 0; i < n; i++) {
        const topPos = getPersonCoords(i);
        result[0].c.push(draw.circle(radius).fill("#f00").cx(topPos.x).cy(topPos.y));

        const botPos = getPersonCoords(i, true);
        result[0].m.push(draw.circle(radius).fill("#00f").cx(botPos.x).cy(botPos.y));
    }
    return result;
}