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

function getInsertedMemeText(text, upperCase, insertion) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return [`${insertion} `, ...text.split(" ").join(` ${insertion} `).split(), ` ${insertion}`].join("");
}

function getZalgoText(text, upperCase) {
    text = upperCase ? text.toUpperCase() : text.toLowerCase();
    return zalgo(text);
}

function getMemeTextByType(text, upperCase, memeType, insertion) {
    memeType = memeType || "Inverted";
    if (memeType === "Spaced") {
        return getSpacedMemeText(text, upperCase);
    } else if (memeType === "Inserted") {
        return getInsertedMemeText(text, upperCase, insertion);
    } else if (memeType === "Zalgo") {
        return getZalgoText(text, upperCase);
    } else {
        return getInvertedMemeText(text, upperCase);
    }
}



function getAvailableTypes() {
    return ["Inverted", "Spaced", "Inserted", "Zalgo"];
}

export default {
    getAvailableTypes,
    getSpacedMemeText,
    getInvertedMemeText,
    getMemeTextByType
}