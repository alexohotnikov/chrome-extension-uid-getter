// Constants
const UI = {
    button: document.querySelector('#get-uid-btn'),
    credentials: document.querySelector('#student-credentials'),
    studentId: document.querySelector('#student-id'),
    credentialsContent: document.querySelector('#credentials-content'),
    loader: document.querySelector('.loader-container')
};

// Modern clipboard API usage
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showFeedback('Скопировано!');
        setTimeout(() => window.close(), 1000);
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback to old method
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showFeedback('Скопировано!');
        setTimeout(() => window.close(), 1000);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showFeedback('Ошибка копирования', true);
    } finally {
        document.body.removeChild(textArea);
    }
}

// Feedback UI
function showFeedback(message, isError = false) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isError ? 'error' : 'success'}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 6px 12px;
        border-radius: 6px;
        background: ${isError ? '#fee2e2' : '#ecfdf5'};
        color: ${isError ? '#dc2626' : '#059669'};
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Show/Hide loader functions
function showCredentialsLoader() {
    UI.loader.style.display = 'flex';
    UI.credentialsContent.style.display = 'none';
}

function hideCredentialsLoader() {
    UI.loader.style.display = 'none';
    UI.credentialsContent.classList.add('visible');
}

// Load credentials data
async function loadCredentialsData() {
    showCredentialsLoader();
    
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];
        const origin = activeTab.url.match(/^https?:\/\/([^\/]+)/)[0];

        const studentResponse = await fetch(`${origin}/profile/api/students/v2/students`);
        const studentData = await studentResponse.json();
        
        UI.studentId.innerHTML = `
            <a href="${origin}/admin/students/${studentData.id}" target="_blank">
                ${studentData.id}
            </a>
        `;

        const detailsResponse = await fetch(`${origin}/profile/api/students/v2/students/${studentData.id}`);
        const details = await detailsResponse.json();
        
        UI.credentials.innerHTML = `Логин: ${details.login}<br>Пароль: ${details.password}`;
        
        hideCredentialsLoader();
    } catch (err) {
        console.error('Error loading credentials:', err);
        UI.loader.innerHTML = `
            <div class="error-state">
                <p style="color: #dc2626; font-size: 12px;">Ошибка загрузки</p>
                <button onclick="location.reload()" class="retry-button">
                    Повторить
                </button>
            </div>
        `;
    }
}

// UID copy handler
async function handleUidCopy() {
    try {
        const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const cookie = await chrome.cookies.get({
            name: 'uid',
            url: tabs[0].url
        });
        
        if (cookie?.value) {
            await navigator.clipboard.writeText(cookie.value);
            showFeedback('UID скопирован!');
            setTimeout(() => window.close(), 1000);
        } else {
            showFeedback('UID не найден', true);
        }
    } catch (err) {
        console.error('Error copying UID:', err);
        showFeedback('Ошибка копирования', true);
    }
}

// Event Listeners
UI.button?.addEventListener('click', handleUidCopy);
window.addEventListener('load', loadCredentialsData);

// Add copy indicators
document.querySelectorAll('[data-copyable]').forEach(element => {
    element.style.cursor = 'pointer';
    element.title = 'Нажмите чтобы скопировать';
});