// --- Firebase Configuration ---
const firebaseConfig = { apiKey: "AIzaSyDVb2f4wKrJbox752z5uBUz9IUz0-KXL6k", authDomain: "kingocheatmod.firebaseapp.com", databaseURL: "https://kingocheatmod-default-rtdb.asia-southeast1.firebasedatabase.app", projectId: "kingocheatmod", storageBucket: "kingocheatmod.appspot.com", messagingSenderId: "527539428232", appId: "1:527539428232:web:d25dd023ae49fbf5d4383d", measurementId: "G-LYQSYX0X21" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- DOM Elements ---
const appTitleEl = document.getElementById('appTitle');
const loginView = document.getElementById('loginView');
const signalView = document.getElementById('signalView');
const userKeyInput = document.getElementById('userKeyInput');
const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('errorMessage');
const tempMessageSignalDiv = document.getElementById('tempMessageSignal');
const langToggleButton = document.getElementById('langToggleButton');

const userInfoKey = document.getElementById('userInfoKey');
const userInfoExpiryDate = document.getElementById('userInfoExpiryDate');
const expiryCountdownDisplay = document.getElementById('expiryCountdownDisplay');
const aviatorSignalX = document.getElementById('aviatorSignalX');
const nextRoundButton = document.getElementById('nextRoundButton');
const waitMessage = document.getElementById('waitMessage');
const logoutButton = document.getElementById('logoutButton');

// --- Language Data ---
const languageData = {
    en: {
        appTitle: "Aviator Signal Access",
        loginTitle: "Aviator Signal Access",
        loginSubtitle: "Enter your User Key to access the signals.",
        userKeyLabel: "User Key:",
        userKeyPlaceholder: "Enter your key",
        loginButtonText: "Login",
        verifyingKey: "Verifying key...",
        keyNotApproved: "Key not approved. Contact support.",
        keyExpired: "Your key has expired.",
        invalidKeyError: "Invalid User Key. Please check and try again.",
        loginFailedError: "Login failed. Please try again later.",
        loginSuccess: "Login Successful!",
        userInfoTitle: "Your Access Details:",
        keyLabel: "Key",
        expiresOnLabel: "Expires on",
        timeLeftLabel: "Time Left",
        currentSignalLabel: "Current Signal:",
        nextRoundButtonText: "Next Round",
        nextRoundWaiting: "Waiting...",
        nextSignalIn: "Next signal in: {seconds}s",
        logoutButtonText: "Logout",
        loggedOut: "Logged out successfully.",
        sessionExpired: "Your session has expired.",
        disclaimerTitle: "Important Note:",
        disclaimerText1: "Always place small bets.",
        disclaimerText2: "With 100% signals, do not bet large amounts as it may get your game ID banned.",
        disclaimerText3: "To stay safe, bet small amounts like 50, 100, 500, 800.",
        langToggleToBn: "বাংলা",
        langToggleToEn: "English",
        expired: "Expired",
        na: "N/A"
    },
    bn: {
        appTitle: "এভিয়েটর সিগন্যাল",
        loginTitle: "এভিয়েটর সিগন্যাল",
        loginSubtitle: "সিগন্যাল অ্যাক্সেস করতে আপনার ইউজার কী লিখুন।",
        userKeyLabel: "ইউজার কী:",
        userKeyPlaceholder: "আপনার কী লিখুন",
        loginButtonText: "লগইন",
        verifyingKey: "কী যাচাই করা হচ্ছে...",
        keyNotApproved: "কী অনুমোদিত নয়। সাপোর্টে যোগাযোগ করুন।",
        keyExpired: "আপনার কী-এর মেয়াদ শেষ হয়ে গেছে।",
        invalidKeyError: "অবৈধ ইউজার কী। অনুগ্রহ করে চেক করে আবার চেষ্টা করুন।",
        loginFailedError: "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        loginSuccess: "লগইন সফল!",
        userInfoTitle: "আপনার অ্যাক্সেসের বিবরণ:",
        keyLabel: "কী",
        expiresOnLabel: "মেয়াদ শেষ হবে",
        timeLeftLabel: "বাকি সময়",
        currentSignalLabel: "বর্তমান সিগন্যাল:",
        nextRoundButtonText: "পরবর্তী রাউন্ড",
        nextRoundWaiting: "অপেক্ষা করুন...",
        nextSignalIn: "পরবর্তী সিগন্যাল: {seconds} সেকেন্ডে",
        logoutButtonText: "লগ আউট",
        loggedOut: "সফলভাবে লগ আউট করা হয়েছে।",
        sessionExpired: "আপনার সেশনের মেয়াদ শেষ হয়ে গেছে।",
        disclaimerTitle: "গুরুত্বপূর্ণ ಸೂಚನೆ:",
        disclaimerText1: "সব সময় ছোট বেট ধরবেন।",
        disclaimerText2: "১০০% সিগনাল বেশি টাকা বেট ধরবেন না এত করে আপনার গেম আইডি ব্যান করে দিবে।",
        disclaimerText3: "তাই সেফ থাকার জন্য কম টাকা ধরবেন যেমন, ৫০, ১০০, ৫০০, ৮০০।",
        langToggleToBn: "বাংলা",
        langToggleToEn: "English",
        expired: "মেয়াদ শেষ",
        na: "প্রযোজ্য নয়"
    }
};
let currentLanguage = localStorage.getItem('aviatorSignalLang') || 'en';

// --- App State ---
let loggedInSubmissionData = null;
let nextRoundTimerInterval;
let nextRoundTimeout;
let keyExpiryInterval;
const NEXT_ROUND_WAIT_SECONDS = 7;

// --- Language Functions ---
function updateLanguage() {
    const lang = languageData[currentLanguage];
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (lang[key]) {
            el.textContent = lang[key];
        }
    });
    document.querySelectorAll('[data-lang-key-placeholder]').forEach(el => {
        const key = el.dataset.langKeyPlaceholder;
        if (lang[key]) {
            el.placeholder = lang[key];
        }
    });
    appTitleEl.textContent = lang.appTitle;
    langToggleButton.textContent = currentLanguage === 'en' ? lang.langToggleToBn : lang.langToggleToEn;
    if(errorMessage.textContent && errorMessage.dataset.errorKey) {
        errorMessage.textContent = lang[errorMessage.dataset.errorKey] || errorMessage.textContent;
    }
}

langToggleButton.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'bn' : 'en';
    localStorage.setItem('aviatorSignalLang', currentLanguage);
    updateLanguage();
    if (loggedInSubmissionData && keyExpiryInterval) {
         startKeyExpiryCountdown();
    }
    const waitMsgText = waitMessage.textContent;
    if(waitMsgText && nextRoundButton.disabled){
        const secondsMatch = waitMsgText.match(/\d+/);
        if(secondsMatch){
            const currentSeconds = parseInt(secondsMatch[0]);
             waitMessage.textContent = languageData[currentLanguage].nextSignalIn.replace('{seconds}', currentSeconds);
        }
    }
});


// --- Helper Functions ---
function showView(viewId) {
    loginView.classList.remove('active');
    signalView.classList.remove('active');
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0,0);
}

function showTemporaryMessageSignal(messageKey, isSuccess = true, duration = 3000) {
    const messageText = languageData[currentLanguage][messageKey] || messageKey;
    tempMessageSignalDiv.textContent = messageText;
    tempMessageSignalDiv.style.backgroundColor = isSuccess ? '#00cc66' : '#ff3366';
    tempMessageSignalDiv.style.display = 'block';
    setTimeout(() => tempMessageSignalDiv.style.opacity = '1', 10);
    setTimeout(() => {
        tempMessageSignalDiv.style.opacity = '0';
        setTimeout(() => { tempMessageSignalDiv.style.display = 'none'; }, 500);
    }, duration);
}

function formatTimeDifference(ms) {
    const lang = languageData[currentLanguage];
    if (ms <= 0) return lang.expired;
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));

    let parts = [];
    if (days > 0) parts.push(`${days}${currentLanguage === 'bn' ? 'দি' : 'd'}`);
    if (hours > 0) parts.push(`${hours}${currentLanguage === 'bn' ? 'ঘ' : 'h'}`);
    if (minutes > 0) parts.push(`${minutes}${currentLanguage === 'bn' ? 'মি' : 'm'}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}${currentLanguage === 'bn' ? 'সে' : 's'}`);

    return parts.join(' ');
}

// --- Login Logic ---
async function handleLogin() {
    const enteredKey = userKeyInput.value.trim();
    const lang = languageData[currentLanguage];
    if (!enteredKey) {
        errorMessage.textContent = lang.userKeyPlaceholder;
        errorMessage.dataset.errorKey = 'userKeyPlaceholder';
        return;
    }
    errorMessage.textContent = lang.verifyingKey;
    errorMessage.dataset.errorKey = 'verifyingKey';
    loginButton.disabled = true;

    try {
        const submissionsRef = db.ref('submissions');
        const snapshot = await submissionsRef.orderByChild('loginKey').equalTo(enteredKey).once('value');

        if (snapshot.exists()) {
            let foundSubmission = null;
            let submissionId = null;
            snapshot.forEach(childSnapshot => {
                if (!foundSubmission) {
                    foundSubmission = childSnapshot.val();
                    submissionId = childSnapshot.key;
                }
            });

            if (foundSubmission) {
                if (foundSubmission.status !== 'approved') {
                    errorMessage.textContent = lang.keyNotApproved;
                    errorMessage.dataset.errorKey = 'keyNotApproved';
                    loginButton.disabled = false;
                    return;
                }
                const now = new Date();
                const expiryDate = new Date(foundSubmission.keyExpiryTimestamp);
                if (now > expiryDate) {
                    errorMessage.textContent = lang.keyExpired;
                    errorMessage.dataset.errorKey = 'keyExpired';
                    loginButton.disabled = false;
                    return;
                }

                loggedInSubmissionData = foundSubmission;
                loggedInSubmissionData.id = submissionId;

                showTemporaryMessageSignal("loginSuccess", true, 2000);
                errorMessage.textContent = "";
                errorMessage.removeAttribute('data-error-key');
                userKeyInput.value = "";
                displayUserInfo();
                startKeyExpiryCountdown();
                generateNewAviatorSignal();
                nextRoundButton.disabled = false;
                nextRoundButton.textContent = lang.nextRoundButtonText;
                waitMessage.textContent = "";
                showView('signalView');

            } else {
                errorMessage.textContent = lang.invalidKeyError;
                errorMessage.dataset.errorKey = 'invalidKeyError';
            }
        } else {
            errorMessage.textContent = lang.invalidKeyError;
            errorMessage.dataset.errorKey = 'invalidKeyError';
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.textContent = lang.loginFailedError;
        errorMessage.dataset.errorKey = 'loginFailedError';
    } finally {
        loginButton.disabled = false;
    }
}

loginButton.addEventListener('click', handleLogin);
userKeyInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        handleLogin();
    }
});

// --- Display User Info & Start Expiry Countdown ---
function displayUserInfo() {
    if (!loggedInSubmissionData) return;
    const lang = languageData[currentLanguage];
    userInfoKey.textContent = loggedInSubmissionData.loginKey ? loggedInSubmissionData.loginKey.slice(0, 12) + "..." : lang.na;
    const expiryDateString = loggedInSubmissionData.keyExpiryTimestamp
        ? new Date(loggedInSubmissionData.keyExpiryTimestamp).toLocaleString(currentLanguage === 'bn' ? 'bn-BD' : 'en-US', {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        : lang.na;
    userInfoExpiryDate.textContent = expiryDateString;
}

function startKeyExpiryCountdown() {
    clearInterval(keyExpiryInterval);
    const lang = languageData[currentLanguage];
    if (!loggedInSubmissionData || !loggedInSubmissionData.keyExpiryTimestamp) {
        expiryCountdownDisplay.textContent = lang.na;
        return;
    }

    const expiryTime = new Date(loggedInSubmissionData.keyExpiryTimestamp).getTime();

    function updateExpiry() {
        const now = new Date().getTime();
        const timeLeft = expiryTime - now;

        if (timeLeft <= 0) {
            expiryCountdownDisplay.textContent = formatTimeDifference(timeLeft); 
            clearInterval(keyExpiryInterval);
            showTemporaryMessageSignal("sessionExpired", false, 5000);
            if (signalView.classList.contains('active')) {
                setTimeout(() => logoutButton.click(), 3000);
            }
            return;
        }
        expiryCountdownDisplay.textContent = formatTimeDifference(timeLeft);
    }
    updateExpiry();
    keyExpiryInterval = setInterval(updateExpiry, 1000);
}

// --- Aviator Signal Logic ---
function generateNewAviatorSignal() {
    const randomX = (Math.random() * (10.00 - 1.01) + 1.01).toFixed(2);
    aviatorSignalX.textContent = `${randomX}x`;
}

nextRoundButton.addEventListener('click', () => {
    if (nextRoundButton.disabled) return;
    const lang = languageData[currentLanguage];

    nextRoundButton.disabled = true;
    nextRoundButton.textContent = lang.nextRoundWaiting;
    aviatorSignalX.textContent = "--- x";

    let countdown = NEXT_ROUND_WAIT_SECONDS;
    waitMessage.textContent = lang.nextSignalIn.replace('{seconds}', countdown);

    clearInterval(nextRoundTimerInterval);
    nextRoundTimerInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            waitMessage.textContent = lang.nextSignalIn.replace('{seconds}', countdown);
        } else {
            clearInterval(nextRoundTimerInterval);
        }
    }, 1000);

    clearTimeout(nextRoundTimeout);
    nextRoundTimeout = setTimeout(() => {
        generateNewAviatorSignal();
        nextRoundButton.disabled = false;
        nextRoundButton.textContent = lang.nextRoundButtonText;
        waitMessage.textContent = "";
    }, NEXT_ROUND_WAIT_SECONDS * 1000);
});


// --- Logout Logic ---
logoutButton.addEventListener('click', () => {
    loggedInSubmissionData = null;
    clearTimeout(nextRoundTimeout);
    clearInterval(nextRoundTimerInterval);
    clearInterval(keyExpiryInterval);
    const lang = languageData[currentLanguage];

    userInfoKey.textContent = "";
    userInfoExpiryDate.textContent = "";
    expiryCountdownDisplay.textContent = "";
    aviatorSignalX.textContent = "--- x";
    nextRoundButton.disabled = false;
    nextRoundButton.textContent = lang.nextRoundButtonText;
    waitMessage.textContent = "";
    errorMessage.textContent = "";
    errorMessage.removeAttribute('data-error-key');

    showTemporaryMessageSignal("loggedOut", true, 2000);
    showView('loginView');
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', async () => {
    updateLanguage();
    showView('loginView');
});