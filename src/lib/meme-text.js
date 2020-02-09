import zalgo from "@favware/zalgo";

function getSpacedMemeText(text, upperCase) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return [...text].join(" ");
}

function getInvertedMemeText(text, upperCase) {
    return ["", ...text].reduce((acc , char) => {
        if (char.match(/[A-Za-z]/)) {
            char = upperCase ? char.toUpperCase() : char.toLowerCase();
            upperCase = !upperCase;
        }
        return acc + char;
    });
}

function getInsertedCowboyMemeText(text, upperCase) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return ["🤠 ", ...text.split(" ").join(" 🤠 ").split(), " 🤠"].join("");
}

function getZalgoText(text, upperCase) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return zalgo(text);
}

function getMemeTextByType(text, upperCase, memeType) {
    memeType = memeType || "Inverted";
    if (memeType === "Spaced") {
        return getSpacedMemeText(text, upperCase);
    } else if (memeType === "Cowboy") {
        return getInsertedCowboyMemeText(text, upperCase);
    } else if (memeType === "Zalgo") {
        return getZalgoText(text, upperCase);
    } else {
        return getInvertedMemeText(text, upperCase);
    }
}



function getAvailableTypes() {
    return ["Inverted", "Spaced", "Cowboy", "Zalgo"];
}

export default {
    getAvailableTypes,
    getSpacedMemeText,
    getInvertedMemeText,
    getMemeTextByType
}