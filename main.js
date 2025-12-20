const configuration = {
    defaultNumPeople: 3,
    minNumPeople: 1,
    maxNumPeople: 10,
    stepNumPeople: 1,

    defaultBoatCapacity: 2,
    minBoatCapacity: 2,
    maxBoatCapacity: 4,
    stepBoatCapacity: 1,

    defaultAnimationSpeed: 1,
    minAnimationSpeed: 0.5,
    maxAnimationSpeed: 5.0,
    stepAnimationSpeed: 0.25,
}

let state = {
    n: configuration.defaultNumPeople,
    boatCapacity: configuration.defaultBoatCapacity,
    animationSpeed: configuration.defaultAnimationSpeed
}

const slidersConfig = [
    { label: "Cannibals and Missionaries", min: configuration.minNumPeople, max: configuration.maxNumPeople, initialValue: configuration.defaultNumPeople, step: configuration.stepNumPeople },
    { label: "Boat Capacity", min: configuration.minBoatCapacity, max: configuration.maxBoatCapacity, initialValue: configuration.defaultBoatCapacity, step: configuration.stepBoatCapacity },
    { label: "Animation Speed", min: configuration.minAnimationSpeed, max: configuration.maxAnimationSpeed, initialValue: configuration.defaultAnimationSpeed, step: configuration.stepAnimationSpeed }
]

const play = () => { }
const pause = () => { }
const step = () => { }
const reset = () => { }

const buttonsConfig = [
    { label: "Play", bgColor: "bg-purple-700", icon: "fa-solid fa-play text-white", action: play },
    { label: "Pause", bgColor: "bg-orange-500", icon: "fa-solid fa-pause text-white", action: pause, },
    { label: "Step", bgColor: "bg-gray-500", icon: "fa-solid fa-rotate text-white", action: step },
    { label: "Reset", bgColor: "bg-gray-800", icon: "fa-solid fa-forward-step text-white", action: reset }
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

document.addEventListener("DOMContentLoaded", () => {
    initConfiguration();
})