import zalgo from "@favware/zalgo";

function getSpacedMemeText(text, upperCase) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return [...text].join(" ");
}

function getInvertedMemeText(text, upperCase) {
    return ["", ...text].reduce((acc, char) => {
        if (char.match(/[A-Za-z]/)) {
            char = upperCase ? char.toUpperCase() : char.toLowerCase();
            upperCase = !upperCase;
        }
        return acc + char;
    });
}

function getInsertedMemeText(text, upperCase, insertion) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return [
        `${insertion} `,
        ...text.split(" ").join(` ${insertion} `).split(),
        ` ${insertion}`,
    ].join("");
}

function getReversedText(text) {
    text = text.split("").reverse().join("");
    return text;
}

function getZalgoText(text, upperCase) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return zalgo(text);
}

function getMemeTextByType(text, upperCase, memeTypes, insertion) {
    if (!Array.isArray(memeTypes)) {
        memeTypes = [memeTypes];
    }
    if (memeTypes.includes("Reversed")) {
        text = getReversedText(text);
    }
    if (memeTypes.includes("Inserted")) {
        text = getInsertedMemeText(text, upperCase, insertion);
    }
    if (memeTypes.includes("Spaced")) {
        text = getSpacedMemeText(text, upperCase);
    }
    if (memeTypes.includes("Zalgo")) {
        text = getZalgoText(text, upperCase);
    }
    if (memeTypes.includes("Inverted")) {
        text = getInvertedMemeText(text, upperCase);
    }
    return text;
}

function getAvailableTypes() {
    return ["Inverted", "Spaced", "Inserted", "Reversed", "Zalgo"];
}

export default {
    getAvailableTypes,
    getSpacedMemeText,
    getInvertedMemeText,
    getMemeTextByType,
};
