const buttonElement = document.querySelector('button');

const saveTextToClipboard = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // hidden element
    textArea.style.opacity = "0";
    textArea.style.maxHeight = "0";
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


window.addEventListener('load', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        var _origin = activeTab.url.match(/^https?:\/\/([^\/]+)/)[0];

        (async () => {
            const response = await fetch(`${_origin}/profile/api/students/v2/students`);
            const data = await response.json();
            document.querySelector('#student-id').innerHTML = `<h4><a href="${_origin}/admin/students/${data.id}" target="_blank">ID студента: ${data.id}</a></h4>`;
    
            const studentResponse = await fetch(`${_origin}/profile/api/students/v2/students/${data.id}`);
            const studentData = await studentResponse.json();
            document.querySelector('#student-credentials').innerHTML = `Логин: ${studentData.login} <br /> Пароль: ${studentData.password}`;
        })();
      });
});
