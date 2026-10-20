// app.js - eWtag App (iTag/gTag/eTag toggles + iKey/gKey fields)
document.addEventListener('DOMContentLoaded', function() {
    const translations = {
        el: {
            title: "eWtag",
            tagsTitle: "Tags",
            keysTitle: "Keys",
            iTagLabel: "iTag",
            gTagLabel: "gTag",
            eTagLabel: "eTag",
            iTagHint: "Apple Find My",
            gTagHint: "Google Find My",
            eTagHint: "eucWatch tag",
            iKeyLabel: "iKey",
            gKeyLabel: "gKey",
            iKeyHint: "base64 · 28 bytes",
            gKeyHint: "hex · 20 bytes",
            refresh: "Ανανέωση",
            save: "Αποθήκευση",
            statusConnected: "eWtag",
            statusReading: "Ανάγνωση δεδομένων...",
            statusSaving: "Αποθήκευση...",
            saveSuccess: "Οι ρυθμίσεις αποθηκεύτηκαν",
            saveError: "Σφάλμα αποθήκευσης",
            confirmSave: "Θέλετε να αποθηκεύσετε τις αλλαγές;",
            readError: "Πρώτα διάβασε τα δεδομένα"
        },
        en: {
            title: "eWtag",
            tagsTitle: "Tags",
            keysTitle: "Keys",
            iTagLabel: "iTag",
            gTagLabel: "gTag",
            eTagLabel: "eTag",
            iTagHint: "Apple Find My",
            gTagHint: "Google Find My",
            eTagHint: "eucWatch tag",
            iKeyLabel: "iKey",
            gKeyLabel: "gKey",
            iKeyHint: "base64 · 28 bytes",
            gKeyHint: "hex · 20 bytes",
            refresh: "Refresh",
            save: "Save",
            statusConnected: "eWtag",
            statusReading: "Reading data...",
            statusSaving: "Saving...",
            saveSuccess: "Settings saved",
            saveError: "Save error",
            confirmSave: "Save changes?",
            readError: "Read data first"
        }
    };

    let currentLanguage = 'el';
    let settings = null;
    let dataBuffer = '';

    const refreshBtn = document.getElementById('refreshBtn');
    const saveBtn = document.getElementById('saveBtn');
    const statusText = document.getElementById('statusText');
    const iTagToggle = document.getElementById('iTagToggle');
    const gTagToggle = document.getElementById('gTagToggle');
    const eTagToggle = document.getElementById('eTagToggle');
    const iKeyInput = document.getElementById('iKeyInput');
    const gKeyInput = document.getElementById('gKeyInput');

    init();

    function init() {
        askParentForLanguage();
        applyLanguage(currentLanguage);
        setupEventListeners();
        setupConnectionStatus();
    }

    function setupEventListeners() {
        refreshBtn.addEventListener('click', refreshData);
        saveBtn.addEventListener('click', saveSettings);

        iTagToggle.addEventListener('click', function() { toggleTag('iTag', iTagToggle); });
        gTagToggle.addEventListener('click', function() { toggleTag('gTag', gTagToggle); });
        eTagToggle.addEventListener('click', function() { toggleETag(); });

        iKeyInput.addEventListener('change', function() { setKey('iKey', iKeyInput); });
        gKeyInput.addEventListener('change', function() { setKey('gKey', gKeyInput); });

        window.addEventListener('message', handleParentMessage);
    }

    function setupConnectionStatus() {
        statusText.textContent = translations[currentLanguage].statusConnected;
    }

    function handleParentMessage(event) {
        if (event.data && event.data.type === 'LANGUAGE_CHANGE') {
            if (event.data.language !== currentLanguage) {
                currentLanguage = event.data.language;
                applyLanguage(currentLanguage);
            }
        }
        else if (event.data && event.data.type === 'BLUETOOTH_RAW_DATA') {
            handleUartData(event.data.data);
        }
        else if (event.data && event.data.type === 'APP_LOADED') {
            refreshData();
        }
    }

    function handleUartData(rawData) {
        dataBuffer += rawData;
        let jsonStart = dataBuffer.indexOf('{');
        while (jsonStart >= 0) {
            try {
                let depth = 0, jsonEnd = -1;
                for (let i = jsonStart; i < dataBuffer.length; i++) {
                    if (dataBuffer[i] === '{') depth++;
                    else if (dataBuffer[i] === '}') depth--;
                    if (depth === 0) { jsonEnd = i; break; }
                }
                if (jsonEnd > jsonStart) {
                    const jsonString = dataBuffer.substring(jsonStart, jsonEnd + 1);
                    const jsonData = JSON.parse(jsonString);
                    if (isEwtagDef(jsonData)) {
                        settings = jsonData;
                        populateForm(settings);
                        statusText.textContent = translations[currentLanguage].statusConnected;
                    }
                    dataBuffer = dataBuffer.substring(jsonEnd + 1);
                    jsonStart = dataBuffer.indexOf('{');
                }
                else break;
            }
            catch (e) {
                const nextStart = dataBuffer.indexOf('{', jsonStart + 1);
                if (nextStart > jsonStart) jsonStart = nextStart;
                else break;
            }
        }
        if (dataBuffer.length > 10000) dataBuffer = dataBuffer.substring(dataBuffer.length - 10000);
    }

    function isEwtagDef(d) {
        return d && (d.iTag !== undefined || d.gTag !== undefined || d.eTag !== undefined);
    }

    function populateForm(s) {
        if (!s) return;
        iTagToggle.className = s.iTag ? 'checkbox active' : 'checkbox';
        gTagToggle.className = s.gTag ? 'checkbox active' : 'checkbox';
        eTagToggle.className = s.eTag ? 'checkbox active' : 'checkbox';
        iKeyInput.value = s.iKey || '';
        gKeyInput.value = s.gKey || '';
    }

    function collectFormData() {
        if (!settings) return null;
        const s = JSON.parse(JSON.stringify(settings));
        const e = eTagToggle.classList.contains('active') ? 1 : 0;
        s.iTag = iTagToggle.classList.contains('active') ? 1 : 0;
        s.gTag = gTagToggle.classList.contains('active') ? 1 : 0;
        s.eTag = e;
        s.iKey = iKeyInput.value.trim();
        s.gKey = gKeyInput.value.trim();
        return s;
    }

    async function toggleTag(key, el) {
        const val = el.classList.toggle('active') ? 1 : 0;
        if (settings) settings[key] = val;
        await sendCommand('\x10');
        await new Promise(r => setTimeout(r, 50));
        await sendCommand('ew.apps.ewtag.state.def.' + key + ' = ' + val + ';\n');
    }

    async function toggleETag() {
        const val = eTagToggle.classList.toggle('active') ? 1 : 0;
        if (settings) settings.eTag = val;
        await sendCommand('\x10');
        await new Promise(r => setTimeout(r, 50));
        await sendCommand('ew.apps.ewtag.state.def.eTag = ' + val + ';\n');
    }

    async function setKey(key, el) {
        const val = el.value.trim();
        if (settings) settings[key] = val;
        await sendCommand('\x10');
        await new Promise(r => setTimeout(r, 50));
        await sendCommand('ew.apps.ewtag.state.def.' + key + ' = ' + JSON.stringify(val) + ';\n');
    }

    async function refreshData() {
        const t = translations[currentLanguage];
        statusText.textContent = t.statusReading;
        dataBuffer = '';
        await sendCommand('\x10');
        await new Promise(r => setTimeout(r, 100));
        await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.ewtag.state.def))\n');
        setTimeout(() => { if (statusText.textContent === t.statusReading) statusText.textContent = t.statusConnected; }, 3000);
    }

    async function saveSettings() {
        const t = translations[currentLanguage];
        const s = collectFormData();
        if (!s) {
            statusText.textContent = t.readError;
            await refreshData();
            return;
        }
        if (!confirm(t.confirmSave)) return;
        try {
            statusText.textContent = t.statusSaving;
            await sendCommand('\x10');
            await new Promise(r => setTimeout(r, 100));
            await sendCommand('ew.apps.ewtag.state.def = ' + JSON.stringify(s) + ';\n');
            await sendCommand('ew.apps.ewtag.init();\n');
            await sendCommand('ew.sys.updt();\n');
            statusText.textContent = t.saveSuccess;
            setTimeout(() => { statusText.textContent = t.statusConnected; }, 2000);
            setTimeout(refreshData, 500);
        }
        catch (error) {
            console.error(error);
            statusText.textContent = t.saveError + ': ' + error.message;
        }
    }

    async function sendCommand(command) {
        const chunkSize = 100;
        for (let i = 0; i < command.length; i += chunkSize) {
            const chunk = command.substring(i, i + chunkSize);
            window.parent.postMessage({ type: 'BLUETOOTH_COMMAND', command: chunk }, '*');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    function askParentForLanguage() {
        window.parent.postMessage({ type: 'REQUEST_LANGUAGE' }, '*');
    }

    function applyLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];
        const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
        setText('statusText', t.title);
        setText('tagsTitle', t.tagsTitle);
        setText('keysTitle', t.keysTitle);
        setText('iTagLabel', t.iTagLabel);
        setText('gTagLabel', t.gTagLabel);
        setText('eTagLabel', t.eTagLabel);
        setText('iTagHint', t.iTagHint);
        setText('gTagHint', t.gTagHint);
        setText('eTagHint', t.eTagHint);
        setText('iKeyLabel', t.iKeyLabel);
        setText('gKeyLabel', t.gKeyLabel);
        setText('iKeyHint', t.iKeyHint);
        setText('gKeyHint', t.gKeyHint);
        setText('refreshText', t.refresh);
        setText('saveText', t.save);
    }
});
