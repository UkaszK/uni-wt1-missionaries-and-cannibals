import { bfs, getPathIterator } from "./src/coreUtils.js"
import { clearDraw, createBackgroundElements, createBoat, createPeople, getBoatCenterCoords, getBoatPositionX, getPersonCoords, toPercent } from "./src/simulationUtils.js"

const configuration = {
    defaultNumPeople: 3,
    minNumPeople: 1,
    maxNumPeople: 9,
    stepNumPeople: 1,

    defaultBoatCapacity: 2,
    minBoatCapacity: 2,
    maxBoatCapacity: 5,
    stepBoatCapacity: 1,

    defaultAnimationSpeed: 1,
    minAnimationSpeed: 0.5,
    maxAnimationSpeed: 5.0,
    stepAnimationSpeed: 0.25,

    defaultAnimationDuration: 1000,

    defaultPeople: [{ c: [], m: [] }, { c: [], m: [] }]
}

let state = {
    n: configuration.defaultNumPeople,
    boatCapacity: configuration.defaultBoatCapacity,
    animationDuration: configuration.defaultAnimationDuration / configuration.defaultAnimationSpeed,
    process: getPathIterator(configuration.defaultNumPeople, configuration.defaultBoatCapacity),
    people: createPeople(configuration.defaultNumPeople),
    boat: createBoat(),
    intervalID: undefined,
    setupValid: true,
}

const updateState = (oldState, update) => {
    state = {
        ...oldState,
        ...update
    }
}

const onChangeNumPeople = (value) => {
    updateState(state, {
        n: value,
        setupValid: !!bfs(value, state.boatCapacity)
    });

    reset();
}

const onChangeBoatCapacity = (value) => {
    updateState(state, {
        boatCapacity: value,
        setupValid: !!bfs(state.n, value)
    });

    reset();
}

const onChangeAnimationSpeed = (value) => {
    updateState(state, {
        animationDuration: configuration.defaultAnimationDuration / value,
    });

    if (state.intervalID) {
        pause();
        play();
    }
}

const slidersConfig = [
    { label: "Cannibals and Missionaries", min: configuration.minNumPeople, max: configuration.maxNumPeople, initialValue: configuration.defaultNumPeople, step: configuration.stepNumPeople, action: onChangeNumPeople },
    { label: "Boat Capacity", min: configuration.minBoatCapacity, max: configuration.maxBoatCapacity, initialValue: configuration.defaultBoatCapacity, step: configuration.stepBoatCapacity, action: onChangeBoatCapacity },
    { label: "Animation Speed", min: configuration.minAnimationSpeed, max: configuration.maxAnimationSpeed, initialValue: configuration.defaultAnimationSpeed, step: configuration.stepAnimationSpeed, action: onChangeAnimationSpeed }
]

const play = () => {
    const intervalID = window.setInterval(() => {
        step();
    }, state.animationDuration);

    updateState(state, {
        intervalID: intervalID
    });
}

const pause = () => {
    window.clearInterval(state.intervalID);

    updateState(state, {
        intervalID: undefined
    });
}

const step = () => {
    if (!state.setupValid) {
        alert("This setup does not find a valid solution and cannot be animated.")
        if (state.intervalID) {
            pause();
        }
    }

    const partialAnimationDuration = state.animationDuration / 3;
    const [lhs, rhs] = state.people;

    const current = state.process.next();
    if (current.done) {
        return;
    }

    const [newLhs, newRhs, nextBoatIsLeft] = current.value;

    const currentBoatIsLeft = !nextBoatIsLeft;
    const startBoatPos = getBoatCenterCoords(currentBoatIsLeft);
    const endBoatPos = getBoatCenterCoords(nextBoatIsLeft);
    const endBoatRectX = toPercent(getBoatPositionX(nextBoatIsLeft));

    const movingPeople = [];

    if (nextBoatIsLeft) {
        // Boat goes from right to left
        const cToMove = newLhs.c - lhs.c.length;
        for (var i = 0; i < cToMove; i++) {
            movingPeople.push({ el: rhs.c.pop(), type: 'c' });
        }

        const mToMove = newLhs.m - lhs.m.length;
        for (var i = 0; i < mToMove; i++) {
            movingPeople.push({ el: rhs.m.pop(), type: 'm' });
        }
    } else {
        // Boat goes from left to right
        const cToMove = newRhs.c - rhs.c.length;
        for (var i = 0; i < cToMove; i++) {
            movingPeople.push({ el: lhs.c.pop(), type: 'c' });
        }

        const mToMove = newRhs.m - rhs.m.length;
        for (var i = 0; i < mToMove; i++) {
            movingPeople.push({ el: lhs.m.pop(), type: 'm' });
        }
    }

    // Animation
    movingPeople.forEach((person, idx) => {
        const offset = (idx - (movingPeople.length - 1) / 2) * 2;
        const targetSide = nextBoatIsLeft ? lhs : rhs;
        const targetIdx = targetSide[person.type].length;

        const coords = getPersonCoords(targetIdx, person.type === 'm', !nextBoatIsLeft);

        // Die Animation in einer sauberen Kette (Chain)
        person.el.animate(partialAnimationDuration) // Enter
            .cx(toPercent(startBoatPos.x + offset))
            .cy(toPercent(startBoatPos.y))
            .animate(partialAnimationDuration) // Travel
            .cx(toPercent(endBoatPos.x + offset))
            .animate(partialAnimationDuration) // Arrive
            .cx(coords.x)
            .cy(coords.y);

        targetSide[person.type].push(person.el);
    });

    state.boat.animate(partialAnimationDuration, partialAnimationDuration, "now").x(endBoatRectX);
}

const reset = () => {
    pause();

    updateState(state, {
        process: getPathIterator(state.n, state.boatCapacity),
        people: configuration.defaultPeople,
        boat: createBoat(),
    });

    initCanvas();
}

const buttonsConfig = [
    { label: "Play", bgColor: "bg-purple-700", icon: "fa-solid fa-play text-white", action: play },
    { label: "Pause", bgColor: "bg-orange-500", icon: "fa-solid fa-pause text-white", action: pause, },
    { label: "Step", bgColor: "bg-gray-500", icon: "fa-solid fa-forward-step text-white", action: step },
    { label: "Reset", bgColor: "bg-gray-800", icon: "fa-solid fa-rotate text-white", action: reset }
]

const initConfiguration = () => {
    initSliders();
    initButtons();
}

const initSliders = () => {
    const slidersContainer = document.getElementById("sliders-container");
    const sliderTemplate = document.getElementById("slider-template");

    slidersConfig.forEach((config) => {
        const slider = sliderTemplate.cloneNode(true);

        slider.classList.remove("hidden");
        slider.classList.add("flex");

        const sliderLabel = slider.getElementsByClassName("slider-label")[0];
        sliderLabel.textContent = config.label;

        const sliderValue = slider.getElementsByClassName("slider-value")[0];
        sliderValue.textContent = config.initialValue;

        const sliderMin = slider.getElementsByClassName("slider-min")[0];
        sliderMin.textContent = config.min;

        const sliderMax = slider.getElementsByClassName("slider-max")[0];
        sliderMax.textContent = config.max;

        const sliderInput = slider.getElementsByTagName("input")[0];
        sliderInput.min = config.min;
        sliderInput.max = config.max;
        sliderInput.step = config.step;
        sliderInput.value = config.initialValue;

        slider.addEventListener("input", (e) => {
            sliderValue.textContent = e.target.value;
            config.action(Number(e.target.value));
        });

        slidersContainer.append(slider);
    });
}

const initButtons = () => {
    const buttonsContainer = document.getElementById("buttons-container");
    const buttonTemplate = document.getElementById("button-template");

    buttonsConfig.forEach((config) => {
        const button = buttonTemplate.cloneNode(true);

        button.classList.remove("hidden");
        button.classList.add("flex", config.bgColor);

        const buttonIcon = button.getElementsByTagName("i")[0];
        buttonIcon.className = config.icon;

        const buttonLabel = button.getElementsByClassName("button-label")[0];
        buttonLabel.textContent = config.label;


        button.addEventListener("click", () => {
            config.action();
        })

        buttonsContainer.append(button);
    });
}

const initCanvas = () => {
    clearDraw();
    const backgroundElements = createBackgroundElements();
    const boat = createBoat();
    const people = createPeople(state.n);

    updateState(state, {
        people: people,
        boat: boat,
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initConfiguration();

    initCanvas();
});