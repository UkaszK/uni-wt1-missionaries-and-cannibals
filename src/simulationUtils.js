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

const toPercent = (num) => `${num}%`;

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

export const createBoat = () => {
    const { boatWidthPercent, boatHeightPercent, boatColor, boatCornerRadius, boatDistanceFromShorePercent } = configuration;
    const boatPosX = getShoreWidth() + boatDistanceFromShorePercent;

    return draw.rect(toPercent(boatWidthPercent), toPercent(boatHeightPercent))
        .x(toPercent(boatPosX))
        .y(toPercent(50 - boatHeightPercent / 2))
        .fill(boatColor)
        .radius(boatCornerRadius);
}

const getPersonCoords = (idx, baseOffset, isBottom = false) => {
    const { peoplePerLine } = configuration;
    const shoreWidth = getShoreWidth();
    const slot = shoreWidth / (peoplePerLine + 1);

    const x = slot + (idx % peoplePerLine) * slot;
    const row = Math.floor(idx / peoplePerLine);
    const y = isBottom ? baseOffset - (row * 8) : baseOffset + (row * 8);

    return { x: toPercent(x), y: toPercent(y) };
}

export const createPeople = (n) => {
    const { verticalPeopleDistanceFromEdgesPercent: yOffset, peoplePerLine } = configuration;
    const radius = toPercent(getShoreWidth() / (peoplePerLine + 1) / 2);
    const result = [];

    for (let i = 0; i < n; i++) {
        const topPos = getPersonCoords(i, yOffset);
        result.push(draw.circle(radius).fill("#f00").cx(topPos.x).cy(topPos.y));

        const botPos = getPersonCoords(i, 100 - yOffset, true);
        result.push(draw.circle(radius).fill("#00f").cx(botPos.x).cy(botPos.y));
    }
    return result;
}