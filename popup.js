const buttonElement = document.querySelector('button');

const saveTextToClipboard = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0"
    textArea.style.height = "0"
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        setTimeout(() => {
            window.close();
        }, 100)
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
}

const clickHandler = function () {
    let url = 'https://uchi.ru'
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        url = tabs[0].url;
        chrome.cookies.get({
            name: 'uid',
            url
        },
        (cookie) => {
            if (cookie.value) {
                saveTextToClipboard(cookie.value);
            }
        },
    )
    });
};

if (buttonElement) {
    buttonElement.addEventListener('click', clickHandler);
}