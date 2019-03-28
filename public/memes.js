const memeTextInput = document.querySelector(".js-meme-text-input");
const memeTextOutput = document.querySelector(".js-meme-text-output");

function outputMemeText(evt) {
    const text = evt.target.value;
    let upperCase = false;
    let newText = "";
    [...text].forEach(char => {
        if (char !== " ") {
            newText += upperCase ? char.toUpperCase() : char.toLowerCase();
            upperCase = !upperCase;
        } else {
            newText += " ";
        }
    });
    memeTextOutput.innerHTML = newText;
}

memeTextInput.addEventListener("input", outputMemeText);