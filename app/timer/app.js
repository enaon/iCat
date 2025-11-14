// Ειδικός κώδικας για το Timer Manager app
document.addEventListener('DOMContentLoaded', function() {
    // Μετάφραση κειμένων για το Timer Manager
    const translations = {
        el: {
            title: "Timer Manager",
            connect: "Σύνδεση",
            refresh: "Ανανέωση",
            export: "Export",
            import: "Import",
            statusConnected: "Συνδεδεμένοι μέσω eW Launcher",
            statusReading: "Ανάγνωση δεδομένων...",
            statusRefreshing: "Ανανέωση...",
            statusExportSuccess: "Τα δεδομένα εξήχθησαν επιτυχώς",
            statusImportSuccess: "Τα δεδομένα εισήχθησαν επιτυχώς",
            noTimers: "Δεν υπάρχουν διαθέσιμοι χρονομετρητές. Πατήστε Ανανέωση για να εμφανιστούν τα δεδομένα.",
            noData: "Δεν βρέθηκαν δεδομένα χρονομετρητών. Πατήστε Ανανέωση για να φορτώσετε τα δεδομένα.",
            timersFound: "Βρέθηκαν {count} χρονομετρητές",
            editTitle: "Επεξεργασία χρονομετρητή",
            timerName: "Όνομα χρονομετρητή",
            timerId: "ID (μη επεξεργάσιμο)",
            timerMinutes: "Λεπτά",
            timerBuzz: "Buzz",
            timerBuzzRep: "Buzz Repetitions",
            timerRep: "Repetitions",
            buzzActive: "Ενεργό",
            buzzInactive: "Απενεργοποιημένο",
            save: "Αποθήκευση",
            cancel: "Ακύρωση",
            start: "Έναρξη",
            pause: "Παύση",
            resume: "Συνέχεια",
            stop: "Διακοπή",
            edit: "Επεξεργασία",
            statusActive: "Ενεργός",
            statusPaused: "Σε παύση",
            statusInactive: "Ανενεργός",
            totalMinutes: "Συνολικά Λεπτά",
            remainingTime: "Απομένων Χρόνος",
            repetitions: "Repetitions",
            buzzStatus: "Buzz",
            buzzRepetitions: "Buzz Repetitions"
        },
        en: {
            title: "Timer Manager",
            connect: "Connect",
            refresh: "Refresh",
            export: "Export",
            import: "Import",
            statusConnected: "Connected via eW Launcher",
            statusReading: "Reading data...",
            statusRefreshing: "Refreshing...",
            statusExportSuccess: "Data exported successfully",
            statusImportSuccess: "Data imported successfully",
            noTimers: "No timers available. Press Refresh to load data.",
            noData: "No timer data found. Press Refresh to load data.",
            timersFound: "Found {count} timers",
            editTitle: "Edit Timer",
            timerName: "Timer name",
            timerId: "ID (non-editable)",
            timerMinutes: "Minutes",
            timerBuzz: "Buzz",
            timerBuzzRep: "Buzz Repetitions",
            timerRep: "Repetitions",
            buzzActive: "Active",
            buzzInactive: "Disabled",
            save: "Save",
            cancel: "Cancel",
            start: "Start",
            pause: "Pause",
            resume: "Resume",
            stop: "Stop",
            edit: "Edit",
            statusActive: "Active",
            statusPaused: "Paused",
            statusInactive: "Inactive",
            totalMinutes: "Total Minutes",
            remainingTime: "Remaining Time",
            repetitions: "Repetitions",
            buzzStatus: "Buzz",
            buzzRepetitions: "Buzz Repetitions"
        }
    };

    // Καθολικές μεταβλητές
    let currentLanguage = 'el';
    let timersData = {};
    let editingTimerId = null;
    let dataBuffer = '';
    let autoRefreshInterval = null;
    let lastActiveTimers = {};

    // Στοιχεία DOM
    const connectBtn = document.getElementById('connectBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const timerList = document.getElementById('timerList');
    const editModal = document.getElementById('editModal');
    const timerNameInput = document.getElementById('timerName');
    const timerIdInput = document.getElementById('timerId');
    const timerMinutesInput = document.getElementById('timerMinutes');
    const timerBuzzInput = document.getElementById('timerBuzz');
    const timerBuzzRepInput = document.getElementById('timerBuzzRep');
    const timerRepInput = document.getElementById('timerRep');
    const saveTimerBtn = document.getElementById('saveTimerBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Αρχικοποίηση
    init();

    function init() {
        askParentForLanguage();
        applyLanguage(currentLanguage);
        setupEventListeners();
        setupConnectionStatus();
        //refreshData();

        // Αίτηση άδειας για ειδοποιήσεις
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }

    function setupEventListeners() {
        refreshBtn.addEventListener('click', function() {
            refreshData();
        });

        exportBtn.addEventListener('click', function() {
            exportData();
        });

        importBtn.addEventListener('click', function() {
            importFile.click();
        });

        importFile.addEventListener('change', function(e) {
            handleImport(e.target.files[0]);
        });

        // Modal events
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        cancelEditBtn.addEventListener('click', closeEditModal);
        saveTimerBtn.addEventListener('click', saveTimer);

        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.style.display === 'flex') {
                        modal.style.display = 'none';
                    }
                });
            }
        });

        // Message events
        window.addEventListener('message', handleParentMessage);
    }

    function setupConnectionStatus() {
        if (statusDot && statusText) {
            statusDot.classList.add('connected');
            statusText.textContent = translations[currentLanguage].statusConnected;
        }
    }

    function handleParentMessage(event) {
        console.log("Received message from parent:", event.data);

        if (event.data && event.data.type === 'LANGUAGE_CHANGE') {
            console.log("Changing language to:", event.data.language);
            if (event.data.language !== currentLanguage) {
                currentLanguage = event.data.language;
                applyLanguage(currentLanguage);
            }
        }
        else if (event.data && event.data.type === 'BLUETOOTH_RAW_DATA') {
            console.log("App received raw data:", event.data.data);
            handleUartData(event.data.data);
        }
        else if (event.data && event.data.type === 'APP_LOADED') {
            console.log("🎯 APP_LOADED received, calling refreshData()");
            refreshData();
        }
    }

    function handleUartData(rawData) {
        dataBuffer += rawData;

        try {
            const jsonStart = dataBuffer.indexOf('{');
            const jsonEnd = dataBuffer.lastIndexOf('}');

            if (jsonStart >= 0 && jsonEnd > jsonStart) {
                const jsonString = dataBuffer.substring(jsonStart, jsonEnd + 1);
                const jsonData = JSON.parse(jsonString);
                processRetrievedData(jsonData);
                dataBuffer = '';
            }
        }
        catch (e) {
            console.log('Λήψη δεδομένων:', rawData);
        }
    }

    function processRetrievedData(data) {
        if (data && typeof data === 'object') {
            timersData = data;
            renderTimerList();
            const t = translations[currentLanguage];
            statusText.textContent = t.timersFound.replace('{count}', Object.keys(timersData).length);

            // Έλεγχος για ενεργούς timers και ειδοποιήσεις
            checkForActiveTimersAndNotify();

            // Έναρξη/διακοπή auto refresh
            manageAutoRefresh();
        }
        else {
            const t = translations[currentLanguage];
            statusText.textContent = t.noData;
            console.error('Μη έγκυρα δεδομένα:', data);
        }
    }

    function checkForActiveTimersAndNotify() {
        const activeTimers = {};
        let anyTimerCompleted = false;

        Object.keys(timersData).forEach(key => {
            const timer = timersData[key];

            // Αποθήκευση τρέχουσας κατάστασης
            activeTimers[key] = timer.active === 1;

            // Έλεγχος αν ο timer ολοκληρώθηκε
            if (lastActiveTimers[key] && !activeTimers[key] && timer.remaining === 0) {
                anyTimerCompleted = true;
                showBrowserNotification(timer.name || 'Timer ' + key, 'Ο χρονομετρητής ολοκληρώθηκε!');
            }
        });

        // Ενημέρωση της τελευταίας κατάστασης
        lastActiveTimers = activeTimers;

        return anyTimerCompleted;
    }

    function manageAutoRefresh() {
        const hasActiveTimer = Object.values(timersData).some(timer => timer.active === 1);

        if (hasActiveTimer) {
            startAutoRefresh();
        }
        else {
            stopAutoRefresh();
        }
    }

    function startAutoRefresh() {
        if (!autoRefreshInterval) {
            autoRefreshInterval = setInterval(() => {
                refreshData();
            }, 5000); // Ανανέωση κάθε 5 δευτερόλεπτα
            console.log('Auto refresh started');
        }
    }

    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
            console.log('Auto refresh stopped');
        }
    }

    function showBrowserNotification(title, message) {
        if (!("Notification" in window)) {
            console.log("Αυτό το browser δεν υποστηρίζει ειδοποιήσεις");
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    function renderTimerList() {
        const timerKeys = Object.keys(timersData);

        if (timerKeys.length === 0) {
            const t = translations[currentLanguage];
            timerList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>${t.noTimers}</p>
                </div>
            `;
            return;
        }

        timerList.innerHTML = '';

        timerKeys.forEach(key => {
            const timer = timersData[key];

            // Υπολογισμός χρόνου που απομένει
            const totalSeconds = Math.ceil(timer.remaining / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const formattedTime = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

            // Κατάσταση χρονομετρητή
            let statusClass = 'status-inactive';
            let statusText = translations[currentLanguage].statusInactive;

            if (timer.active === 1) {
                if (timer.paused === 1) {
                    statusClass = 'status-paused';
                    statusText = translations[currentLanguage].statusPaused;
                }
                else {
                    statusClass = 'status-active';
                    statusText = translations[currentLanguage].statusActive;
                }
            }

            const t = translations[currentLanguage];
            const timerCard = document.createElement('div');
            timerCard.className = 'timer-card';
            timerCard.innerHTML = `
                <div class="timer-header">
                    <div class="timer-name">${timer.name || 'Timer ' + key}</div>
                    <div class="timer-status ${statusClass}">
                        <i class="fas ${timer.active === 1 ? (timer.paused === 1 ? 'fa-pause' : 'fa-play') : 'fa-stop'}"></i>
                        <span>${statusText}</span>
                    </div>
                </div>
                <div class="timer-info">
                    <div class="timer-detail">
                        <span class="detail-label">${t.totalMinutes}</span>
                        <span class="detail-value">${timer.min}</span>
                    </div>
                    <div class="timer-detail">
                        <span class="detail-label">${t.remainingTime}</span>
                        <span class="detail-value">${formattedTime}</span>
                    </div>
                    <div class="timer-detail">
                        <span class="detail-label">${t.repetitions}</span>
                        <span class="detail-value">${timer.rep}</span>
                    </div>
                    <div class="timer-detail">
                        <span class="detail-label">${t.buzzStatus}</span>
                        <span class="detail-value">${timer.buzz ? t.buzzActive : t.buzzInactive}</span>
                    </div>
                    <div class="timer-detail">
                        <span class="detail-label">${t.buzzRepetitions}</span>
                        <span class="detail-value">${timer.buzzRep}</span>
                    </div>
                </div>
                <div class="timer-actions">
                    ${timer.active === 1 && timer.paused === 0 ? 
                        `<button class="btn btn-warning pause-timer" data-id="${key}">
                            <i class="fas fa-pause"></i> ${t.pause}
                        </button>` : 
                        (timer.active === 1 && timer.paused === 1 ? 
                            `<button class="btn btn-success resume-timer" data-id="${key}">
                                <i class="fas fa-play"></i> ${t.resume}
                            </button>` : 
                            `<button class="btn btn-success start-timer" data-id="${key}">
                                <i class="fas fa-play"></i> ${t.start}
                            </button>`)
                    }
                    ${timer.active === 1 ? 
                        `<button class="btn btn-danger stop-timer" data-id="${key}">
                            <i class="fas fa-stop"></i> ${t.stop}
                        </button>` : ''
                    }
                    <button class="btn btn-secondary edit-timer" data-id="${key}">
                        <i class="fas fa-edit"></i> ${t.edit}
                    </button>
                </div>
            `;

            timerList.appendChild(timerCard);
        });

        // Προσθήκη event listeners για τα κουμπιά
        document.querySelectorAll('.start-timer').forEach(btn => {
            btn.addEventListener('click', function() {
                const timerId = this.getAttribute('data-id');
                startTimer(timerId);
            });
        });

        document.querySelectorAll('.pause-timer').forEach(btn => {
            btn.addEventListener('click', function() {
                const timerId = this.getAttribute('data-id');
                pauseTimer(timerId);
            });
        });

        document.querySelectorAll('.resume-timer').forEach(btn => {
            btn.addEventListener('click', function() {
                const timerId = this.getAttribute('data-id');
                resumeTimer(timerId);
            });
        });

        document.querySelectorAll('.stop-timer').forEach(btn => {
            btn.addEventListener('click', function() {
                const timerId = this.getAttribute('data-id');
                stopTimer(timerId);
            });
        });

        document.querySelectorAll('.edit-timer').forEach(btn => {
            btn.addEventListener('click', function() {
                const timerId = this.getAttribute('data-id');
                openEditModal(timerId);
            });
        });
    }

    async function refreshData() {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusReading;
            await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.timer.state.def))\n');
        }
        catch (error) {
            console.error('Σφάλμα ανανέωσης:', error);
            statusText.textContent = 'Σφάλμα ανανέωσης: ' + error.message;
        }
    }

    function exportData() {
        if (Object.keys(timersData).length === 0) {
            alert(translations[currentLanguage].noData);
            return;
        }

        const exportData = {
            timers: timersData,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `timer_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        const t = translations[currentLanguage];
        statusText.textContent = t.statusExportSuccess;
    }

    function handleImport(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData.timers || typeof importedData.timers !== 'object') {
                    throw new Error('Μη έγκυρη μορφή αρχείου');
                }

                const t = translations[currentLanguage];
                if (!confirm(`Θέλετε να εισαγάγετε ${Object.keys(importedData.timers).length} χρονομετρητές; Αυτή η ενέργεια θα αντικαταστήσει τις τρέχουσες ρυθμίσεις.`)) {
                    return;
                }

                await updateEspruinoWithImportedData(importedData.timers);
                statusText.textContent = t.statusImportSuccess;

            }
            catch (error) {
                console.error('Σφάλμα εισαγωγής:', error);
                alert('Σφάλμα κατά την εισαγωγή: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    async function updateEspruinoWithImportedData(importedTimers) {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = 'Ενημέρωση συσκευής με εισαγόμενα δεδομένα...';

            let command = 'ew.apps.timer.state.def = ' + JSON.stringify(importedTimers) + ';\n';

            const chunkSize = 100;
            for (let i = 0; i < command.length; i += chunkSize) {
                const chunk = command.substring(i, i + chunkSize);
                await sendCommand(chunk);
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            await sendCommand('if (ew.apps.timer.state.def && Object.keys(ew.apps.timer.state.def).length > 0) { \n');
            await sendCommand('  Bluetooth.println("Αποθηκεύτηκαν " + Object.keys(ew.apps.timer.state.def).length + " χρονομετρητές");\n');
            await sendCommand('} else {\n');
            await sendCommand('  Bluetooth.println("Σφάλμα: Το αντικείμενο είναι άδειο");\n');
            await sendCommand('}\n');

            await refreshData();
            statusText.textContent = 'Η συσκευή ενημερώθηκε με ' + Object.keys(importedTimers).length + ' χρονομετρητές';

        }
        catch (error) {
            console.error('Σφάλμα ενημέρωσης συσκευής:', error);
            statusText.textContent = 'Σφάλμα ενημέρωσης συσκευής: ' + error.message;
        }
    }

    async function startTimer(timerId) {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusRefreshing;
            await sendCommand(`ew.apps.timer.startTimer(${timerId});\n`);
            setTimeout(refreshData, 500);
        }
        catch (error) {
            console.error('Σφάλμα εκκίνησης:', error);
            statusText.textContent = 'Σφάλμα εκκίνησης: ' + error.message;
        }
    }

    async function pauseTimer(timerId) {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusRefreshing;
            await sendCommand(`ew.apps.timer.pauseTimer(${timerId});\n`);
            setTimeout(refreshData, 500);
        }
        catch (error) {
            console.error('Σφάλμα παύσης:', error);
            statusText.textContent = 'Σφάλμα παύσης: ' + error.message;
        }
    }

    async function resumeTimer(timerId) {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusRefreshing;
            await sendCommand(`ew.apps.timer.resumeTimer(${timerId});\n`);
            setTimeout(refreshData, 500);
        }
        catch (error) {
            console.error('Σφάλμα συνέχειας:', error);
            statusText.textContent = 'Σφάλμα συνέχειας: ' + error.message;
        }
    }

    async function stopTimer(timerId) {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusRefreshing;
            await sendCommand(`ew.apps.timer.stopTimer(${timerId});\n`);
            setTimeout(refreshData, 500);
        }
        catch (error) {
            console.error('Σφάλμα διακοπής:', error);
            statusText.textContent = 'Σφάλμα διακοπής: ' + error.message;
        }
    }

    function openEditModal(timerId) {
        const timer = timersData[timerId];
        if (!timer) return;

        editingTimerId = timerId;
        timerIdInput.value = timerId;
        timerNameInput.value = timer.name || '';
        timerMinutesInput.value = timer.min;
        timerBuzzInput.value = timer.buzz;
        timerBuzzRepInput.value = timer.buzzRep;
        timerRepInput.value = timer.rep;

        editModal.style.display = 'flex';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        editingTimerId = null;
        timerNameInput.value = '';
        timerIdInput.value = '';
        timerMinutesInput.value = '';
        timerBuzzInput.value = '1';
        timerBuzzRepInput.value = '5';
        timerRepInput.value = '0';
    }

    async function saveTimer() {
        if (!editingTimerId) return;

        const newName = timerNameInput.value.trim();
        const newMinutes = parseInt(timerMinutesInput.value);
        const newBuzz = parseInt(timerBuzzInput.value);
        const newBuzzRep = parseInt(timerBuzzRepInput.value);
        const newRep = parseInt(timerRepInput.value);

        if (!newName || isNaN(newMinutes) || isNaN(newBuzz) || isNaN(newBuzzRep) || isNaN(newRep)) {
            alert('Παρακαλώ συμπληρώστε όλα τα πεδία σωστά');
            return;
        }

        try {
            await sendCommand(`ew.apps.timer.state.def[${editingTimerId}].name = "${newName}";\n`);
            await sendCommand(`ew.apps.timer.state.def[${editingTimerId}].min = ${newMinutes};\n`);
            await sendCommand(`ew.apps.timer.state.def[${editingTimerId}].buzz = ${newBuzz};\n`);
            await sendCommand(`ew.apps.timer.state.def[${editingTimerId}].buzzRep = ${newBuzzRep};\n`);
            await sendCommand(`ew.apps.timer.state.def[${editingTimerId}].rep = ${newRep};\n`);

            const t = translations[currentLanguage];
            statusText.textContent = t.save;
        }
        catch (error) {
            console.error('Σφάλμα αποστολής εντολών:', error);
            statusText.textContent = 'Σφάλμα αποστολής εντολών: ' + error.message;
        }

        setTimeout(refreshData, 500);
        closeEditModal();
    }

    async function sendCommand(command) {
        window.parent.postMessage({
            type: 'BLUETOOTH_COMMAND',
            command: command
        }, '*');
    }

    function askParentForLanguage() {
        try {
            window.parent.postMessage({
                type: 'REQUEST_LANGUAGE'
            }, '*');
        }
        catch (e) {
            console.log("Could not ask parent for language:", e);
        }
    }

    function applyLanguage(lang) {
        console.log("Applying language:", lang);
        currentLanguage = lang;
        const t = translations[lang];

        const setTextIfExists = (id, text) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
                console.log("✅ Updated element:", id);
            }
            else {
                console.log("⚠️ Element not found:", id);
            }
        };

        setTextIfExists('titleText', t.title);
        setTextIfExists('connectText', t.connect);
        setTextIfExists('refreshText', t.refresh);
        setTextIfExists('exportText', t.export);
        setTextIfExists('importText', t.import);
        setTextIfExists('noTimersText', t.noTimers);
        setTextIfExists('editTitleText', t.editTitle);
        setTextIfExists('timerNameLabel', t.timerName);
        setTextIfExists('timerIdLabel', t.timerId);
        setTextIfExists('timerMinutesLabel', t.timerMinutes);
        setTextIfExists('timerBuzzLabel', t.timerBuzz);
        setTextIfExists('timerBuzzRepLabel', t.timerBuzzRep);
        setTextIfExists('timerRepLabel', t.timerRep);
        setTextIfExists('buzzActiveOption', t.buzzActive);
        setTextIfExists('buzzInactiveOption', t.buzzInactive);
        setTextIfExists('saveText', t.save);
        setTextIfExists('cancelText', t.cancel);

        if (statusDot && statusDot.classList.contains('connected')) {
            statusText.textContent = t.statusConnected;
        }

        if (Object.keys(timersData).length > 0) {
            renderTimerList();
            statusText.textContent = t.timersFound.replace('{count}', Object.keys(timersData).length);
        }

        console.log("Language applied successfully!");
    }
});
