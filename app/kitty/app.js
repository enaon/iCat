// app.js - Kitty Settings App

document.addEventListener('DOMContentLoaded', function() {
    // Translations
    const translations = {
        el: {
            title: "Kitty",
            refresh: "Ανανέωση",
            save: "Αποθήκευση",
            manualClean: "Καθαρισμός",
            empty: "Άδειασμα",
            statusConnected: "Συνδεδεμένοι μέσω eW Launcher",
            statusReading: "Ανάγνωση δεδομένων...",
            statusSaving: "Αποθήκευση...",
            saveSuccess: "Οι ρυθμίσεις αποθηκεύτηκαν",
            saveError: "Σφάλμα αποθήκευσης",
            confirmSave: "Θέλετε να αποθηκεύσετε τις αλλαγές;",

            // Tabs
            mainTab: "Κύριες",
            sandTab: "Άμμος",
            advancedTab: "Για προχωρημένους",
            statsTab: "Στατιστικά",
            stateTab: "Κατάσταση",

            // Main tab
            autoCleanTitle: "Αυτόματος Καθαρισμός",
            autoCleanLabel: "Αυτόματος καθαρισμός",
            delayLabel: "Καθυστέρηση",
            minutesLabel: "λεπτά",
            autoPauseLabel: "Αυτόματη παύση",
            pauseScaleLabel: "(down scale)",
            autoLightLabel: "Αυτόματο φως",
            uvcTitle: "UV-C Λάμπα",
            uvcLabel: "Ενεργοποίηση UV-C",

            // Sand tab
            sandTypeTitle: "Τύπος Άμμου",
            sandTypeLabel: "Τύπος",
            prepLabel: "Prepare Motion",
            speedLabel: "Ταχύτητα",
            speedRangeLabel: "1-9",
            sandLimitsTitle: "Όρια Άμμου",
            maxSandLabel: "Μέγιστο",
            minSandLabel: "Ελάχιστο",

            // Advanced tab
            hardwareTitle: "Hardware",
            scaleLabel: "Ζυγαριά",
            tofLabel: "Αισθητήρας ToF",
            lidLabel: "Καπάκι",
            vibratorLabel: "Δονητής",
            voltMonLabel: "Παρακολούθηση τάσης",
            calibrationTitle: "Calibration",
            clbLabel: "Ball Calibration",
            clbRangeLabel: "-9 έως 0",
            tofSettingsTitle: "Ρυθμίσεις ToF",
            tofEmptyLabel: "Τιμή Empty",
            tofFullLabel: "Τιμή Full",
            tofLostLabel: "Τιμή Lost",
            scheduleTitle: "Προγραμματισμός",
            scheduleEnableLabel: "Ενεργός προγραμματισμός",
            scheduleHoursLabel: "Ώρες",

            // Stats tab
            statsTitle: "Στατιστικά Λειτουργίας",
            totalCyclesLabel: "Συνολικοί κύκλοι",
            todayCyclesLabel: "Σήμερα",
            failCountLabel: "Αποτυχίες",
            wasteLevelLabel: "Επίπεδο απορριμμάτων",
            powerStatusTitle: "Κατάσταση Ισχύος",
            batteryLabel: "Μπαταρία",
            powerBankLabel: "Power Bank",
            chargingLabel: "Φόρτιση",

            // State tab
            stateSysTitle: "Σύστημα",
            stateAutoTitle: "Αυτόματο",
            statePosTitle: "Θέση",
            stateVoltTitle: "Τάση",
            stateScaleTitle: "Ζυγαριά",
            stateVibratorTitle: "Δονητής",
            stateTofTitle: "Αισθητήρας Απόστασης",
            stateBusy: "Απασχολημένο",
            stateRun: "Λειτουργία",
            statePause: "Παύση",
            stateTap: "Tap",
            statePwr: "Ισχύς",
            stateCnt: "Μετρητής",
            stateAbort: "Ακύρωση",
            stateUvc: "UV-C",
            stateLock: "Κλείδωμα",
            stateBall: "Μπάλα",
            stateLid: "Καπάκι",
            stateFlip: "Flip",
            stateDir: "Κατεύθυνση",
            stateDrop: "Πτώση",
            stateBase: "Βάση",
            stateMin: "Ελάχιστο",
            stateFailed: "Αποτυχία",
            stateGrams: "Γραμμάρια",
            statePer: "Ποσοστό",
            stateAlert: "Ειδοποίηση",
            stateIdle: "Αδρανές",
            stateLast: "Τελευταίο",
            stateConnected: "Συνδεδεμένο",
            stateBattery: "Μπαταρία",
            stateDist: "Απόσταση",
            stateNa: "Μη διαθέσιμο",
            stateOn: "Ενεργό",
            stateOff: "Ανενεργό",
            stateYes: "Ναι",
            stateNo: "Όχι",
            stateLastUpdate: "Τελευταία ενημέρωση",

            // Badges
            on: "ON",
            off: "OFF",
            yes: "Ναι",
            no: "Όχι",

            // Actions
            cleanConfirm: "Θέλετε να ξεκινήσετε κύκλο καθαρισμού;",
            emptyConfirm: "ΠΡΟΣΟΧΗ! Η ενέργεια αυτή θα αδειάσει όλη την άμμο για αλλαγή. Συνέχεια;",
            cleaning: "Καθαρισμός...",
            emptying: "Άδειασμα..."
        },
        en: {
            title: "Kitty",
            refresh: "Refresh",
            save: "Save",
            manualClean: "Clean",
            empty: "Empty",
            statusConnected: "Connected via eW Launcher",
            statusReading: "Reading data...",
            statusSaving: "Saving...",
            saveSuccess: "Settings saved",
            saveError: "Save error",
            confirmSave: "Save changes?",

            // Tabs
            mainTab: "Main",
            sandTab: "Sand",
            advancedTab: "Advanced",
            statsTab: "Stats",
            stateTab: "State",

            // Main tab
            autoCleanTitle: "Auto Clean",
            autoCleanLabel: "Auto clean",
            delayLabel: "Delay",
            minutesLabel: "minutes",
            autoPauseLabel: "Auto pause",
            pauseScaleLabel: "(down scale)",
            autoLightLabel: "Auto light",
            uvcTitle: "UV-C Lamp",
            uvcLabel: "Enable UV-C",

            // Sand tab
            sandTypeTitle: "Sand Type",
            sandTypeLabel: "Type",
            prepLabel: "Prepare Motion",
            speedLabel: "Speed",
            speedRangeLabel: "1-9",
            sandLimitsTitle: "Sand Limits",
            maxSandLabel: "Maximum",
            minSandLabel: "Minimum",

            // Advanced tab
            hardwareTitle: "Hardware",
            scaleLabel: "Scale",
            tofLabel: "ToF Sensor",
            lidLabel: "Lid",
            vibratorLabel: "Vibrator",
            voltMonLabel: "Voltage Monitor",
            calibrationTitle: "Calibration",
            clbLabel: "Ball Calibration",
            clbRangeLabel: "-9 to 0",
            tofSettingsTitle: "ToF Settings",
            tofEmptyLabel: "Empty value",
            tofFullLabel: "Full value",
            tofLostLabel: "Lost value",
            scheduleTitle: "Schedule",
            scheduleEnableLabel: "Enable schedule",
            scheduleHoursLabel: "Hours",

            // Stats tab
            statsTitle: "Statistics",
            totalCyclesLabel: "Total cycles",
            todayCyclesLabel: "Today",
            failCountLabel: "Failures",
            wasteLevelLabel: "Waste level",
            powerStatusTitle: "Power Status",
            batteryLabel: "Battery",
            powerBankLabel: "Power Bank",
            chargingLabel: "Charging",

            // State tab
            stateSysTitle: "System",
            stateAutoTitle: "Auto",
            statePosTitle: "Position",
            stateVoltTitle: "Voltage",
            stateScaleTitle: "Scale",
            stateVibratorTitle: "Vibrator",
            stateTofTitle: "Distance Sensor",
            stateBusy: "Busy",
            stateRun: "Run",
            statePause: "Pause",
            stateTap: "Tap",
            statePwr: "Power",
            stateCnt: "Counter",
            stateAbort: "Abort",
            stateUvc: "UV-C",
            stateLock: "Lock",
            stateBall: "Ball",
            stateLid: "Lid",
            stateFlip: "Flip",
            stateDir: "Direction",
            stateDrop: "Drop",
            stateBase: "Base",
            stateMin: "Minimum",
            stateFailed: "Failed",
            stateGrams: "Grams",
            statePer: "Percent",
            stateAlert: "Alert",
            stateIdle: "Idle",
            stateLast: "Last",
            stateConnected: "Connected",
            stateBattery: "Battery",
            stateDist: "Distance",
            stateNa: "N/A",
            stateOn: "On",
            stateOff: "Off",
            stateYes: "Yes",
            stateNo: "No",
            stateLastUpdate: "Last update",

            // Badges
            on: "ON",
            off: "OFF",
            yes: "Yes",
            no: "No",

            // Actions
            cleanConfirm: "Start cleaning cycle?",
            emptyConfirm: "CAUTION! This action will empty the sand, to aid in replacing the sand with new one. Continue?",
            cleaning: "Cleaning...",
            emptying: "Emptying..."
        }
    };

    // State
    let currentLanguage = 'el';
    let kittySettings = null;
    let kittyState = null;
    let dataBuffer = '';
    let stateUpdateInterval = null;
    let isRefreshing = false;

    // DOM Elements
    const refreshBtn = document.getElementById('refreshBtn');
    const saveBtn = document.getElementById('saveBtn');
    const manualCleanBtn = document.getElementById('manualCleanBtn');
    const emptyBtn = document.getElementById('emptyBtn');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    // Initialize
    init();

    function init() {
        askParentForLanguage();
        applyLanguage(currentLanguage);
        setupEventListeners();
        setupSliders();
        setupConnectionStatus();
    }

    function setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                switchTab(tab);

                // Αν πάμε στην καρτέλα κατάστασης, ξεκινάμε auto-refresh
                if (tab === 'state') {
                    startStateAutoRefresh();
                }
                else {
                    stopStateAutoRefresh();
                }
            });
        });

        // Buttons
        refreshBtn.addEventListener('click', refreshData);
        saveBtn.addEventListener('click', saveSettings);
        manualCleanBtn.addEventListener('click', startManualClean);
        emptyBtn.addEventListener('click', startEmpty);

        // Sliders
        document.getElementById('autoDelay').addEventListener('input', (e) => {
            document.getElementById('autoDelayValue').textContent = e.target.value;
        });

        document.getElementById('sandSpeed').addEventListener('input', (e) => {
            document.getElementById('sandSpeedValue').textContent = e.target.value;
        });

        document.getElementById('calibration').addEventListener('input', (e) => {
            document.getElementById('calibrationValue').textContent = e.target.value;
        });

        // Sand type change - update prep and speed
        document.getElementById('sandType').addEventListener('change', (e) => {
            const type = e.target.value;
            if (kittySettings && kittySettings.sand && kittySettings.sand[type]) {
                const sand = kittySettings.sand[type];
                document.getElementById('sandPrep').className = sand.prep ? 'checkbox active' : 'checkbox';

                let speed = (19 - (sand.speed * 10)) || 1;
                document.getElementById('sandSpeed').value = speed;
                document.getElementById('sandSpeedValue').textContent = speed;

                document.getElementById('sandMax').value = sand.max || 3600;
                document.getElementById('sandMin').value = sand.min || 1000;
            }
        });

        // Parent messages
        window.addEventListener('message', handleParentMessage);
    }

    function setupSliders() {
        document.getElementById('autoDelayValue').textContent = document.getElementById('autoDelay').value;
        document.getElementById('sandSpeedValue').textContent = document.getElementById('sandSpeed').value;
        document.getElementById('calibrationValue').textContent = document.getElementById('calibration').value;
    }

    function setupConnectionStatus() {
        if (statusDot && statusText) {
            statusDot.classList.add('connected');
            statusText.textContent = translations[currentLanguage].statusConnected;
        }
    }

    function handleParentMessage(event) {
        console.log("Kitty app received message:", event.data);

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

        try {
            // Προσπάθησε να βρεις το πρώτο πλήρες JSON
            const jsonStart = dataBuffer.indexOf('{');
            const jsonEnd = dataBuffer.lastIndexOf('}');

            if (jsonStart >= 0 && jsonEnd > jsonStart) {
                const jsonString = dataBuffer.substring(jsonStart, jsonEnd + 1);
                const jsonData = JSON.parse(jsonString);

                console.log("Received data:", jsonData);

                // ΕΛΕΓΧΟΣ: Σε ποιο tab βρισκόμαστε;
                const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');

                if (activeTab === 'state') {
                    // ΣΤΟ STATE TAB: ό,τι έρθει το δείχνουμε
                    kittyState = jsonData;
                    updateStateDisplay();

                    // Ενημέρωση ώρας
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString();
                    const lastUpdate = document.getElementById('stateLastUpdate');
                    if (lastUpdate) {
                        lastUpdate.textContent = `${translations[currentLanguage].stateLastUpdate}: ${timeStr}`;
                    }
                }
                else {
                    // ΣΕ ΑΛΛΟ TAB: αποθήκευσε ανάλογα
                    if (jsonData.sand) {
                        kittySettings = jsonData;
                        populateForm(jsonData);
                        updateStats(jsonData);
                    }
                }

                dataBuffer = '';
            }
        }
        catch (e) {
            console.log("Error parsing JSON:", e);
            // Αν το JSON δεν είναι πλήρες, κράτα το buffer
            if (dataBuffer.length > 5000) dataBuffer = '';
        }
    }

    function populateForm(settings) {
        // Main tab
        document.getElementById('autoClean').className = settings.auto?.clean ? 'checkbox active' : 'checkbox';
        document.getElementById('autoDelay').value = settings.auto?.delay || 3;
        document.getElementById('autoDelayValue').textContent = settings.auto?.delay || 3;
        document.getElementById('autoPause').className = settings.auto?.pause ? 'checkbox active' : 'checkbox';
        document.getElementById('autoLight').className = settings.auto?.light ? 'checkbox active' : 'checkbox';
        document.getElementById('uvc').className = settings.auto?.uvc ? 'checkbox active' : 'checkbox';

        // Sand tab
        let sandType = settings.is?.sandType || 1;
        document.getElementById('sandType').value = sandType;

        if (settings.sand && settings.sand[sandType]) {
            document.getElementById('sandPrep').className = settings.sand[sandType].prep ? 'checkbox active' : 'checkbox';

            let speed = (19 - (settings.sand[sandType].speed * 10)) || 1;
            document.getElementById('sandSpeed').value = speed;
            document.getElementById('sandSpeedValue').textContent = speed;

            document.getElementById('sandMax').value = settings.sand[sandType].max || 3600;
            document.getElementById('sandMin').value = settings.sand[sandType].min || 1000;
        }

        // Advanced tab
        document.getElementById('hwScale').className = settings.is?.scale ? 'checkbox active' : 'checkbox';
        document.getElementById('hwTof').className = settings.is?.tof ? 'checkbox active' : 'checkbox';
        document.getElementById('hwLid').className = settings.is?.lid ? 'checkbox active' : 'checkbox';
        document.getElementById('hwVibrator').className = settings.is?.vibrator ? 'checkbox active' : 'checkbox';
        document.getElementById('hwVoltMon').className = settings.is?.voltMon ? 'checkbox active' : 'checkbox';

        let clb = settings.is?.clb || 0;
        document.getElementById('calibration').value = -clb * 100;
        document.getElementById('calibrationValue').textContent = -clb * 100;

        document.getElementById('tofEmpty').value = settings.tof?.empty || 43.5;
        document.getElementById('tofFull').value = settings.tof?.full || 35;
        document.getElementById('tofLost').value = settings.tof?.lost || 6553.5;

        document.getElementById('scheduleEnable').className = settings.auto?.every?.on ? 'checkbox active' : 'checkbox';
        if (settings.auto?.every?.hours) {
            document.getElementById('hour1').value = settings.auto.every.hours[0] || 2;
            document.getElementById('hour2').value = settings.auto.every.hours[1] || 8;
            document.getElementById('hour3').value = settings.auto.every.hours[2] || 15;
            document.getElementById('hour4').value = settings.auto.every.hours[3] || 20;
        }
    }

    function updateStats(settings) {
        document.getElementById('totalCycles').textContent = settings.is?.total || 0;
        document.getElementById('todayCycles').textContent = settings.is?.run || 0;
        document.getElementById('failCount').textContent = settings.is?.fail || 0;
        document.getElementById('wasteLevel').textContent = (settings.is?.tof?.per || 0) + '%';

        // Power stats
        document.getElementById('batteryLevel').textContent = '0%';
        document.getElementById('powerBadge').className = 'badge';
        document.getElementById('powerBadge').textContent = 'OFF';
        document.getElementById('chargingBadge').className = 'badge';
        document.getElementById('chargingBadge').textContent = translations[currentLanguage].no;
    }

    function updateStateDisplay() {
        if (!kittyState) {
            console.log("No kittyState available");
            document.getElementById('stateContainer').innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p>Περιμένοντας δεδομένα...</p>
                <p><small>Πατήστε Ανανέωση ή περιμένετε για αυτόματη ενημέρωση</small></p>
            </div>
        `;
            return;
        }

        console.log("Updating state display with:", kittyState);
        const t = translations[currentLanguage];
        const container = document.getElementById('stateContainer');
        const lastUpdate = document.getElementById('stateLastUpdate');

        // Ενημέρωση ώρας
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        if (lastUpdate) {
            lastUpdate.textContent = `${t.stateLastUpdate}: ${timeStr}`;
        }

        const stateHtml = `
        <!-- Σύστημα -->
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-microchip"></i> ${t.stateSysTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.sys?.busy ? 'led-green' : 'led-gray'}"></span> ${t.stateBusy}</span>
                <span class="state-value">${kittyState.sys?.busy ? t.stateYes : t.stateNo}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.sys?.run ? 'led-green' : 'led-gray'}"></span> ${t.stateRun}</span>
                <span class="state-value">${kittyState.sys?.run || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.sys?.pause ? 'led-yellow' : 'led-gray'}"></span> ${t.statePause}</span>
                <span class="state-value">${kittyState.sys?.pause ? t.stateYes : t.stateNo}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-hand-pointer"></i> ${t.stateTap}</span>
                <span class="state-value">${kittyState.sys?.tap || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-bolt"></i> ${t.statePwr}</span>
                <span class="state-value">${kittyState.sys?.pwr || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-counter"></i> ${t.stateCnt}</span>
                <span class="state-value">${kittyState.sys?.cnt || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.sys?.abort ? 'led-red' : 'led-gray'}"></span> ${t.stateAbort}</span>
                <span class="state-value">${kittyState.sys?.abort ? t.stateYes : t.stateNo}</span>
            </div>
        </div>

        <!-- Αυτόματο 
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-robot"></i> ${t.stateAutoTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-radiation"></i> ${t.stateUvc}</span>
                <span class="state-value">${kittyState.auto?.uvc ? t.stateOn : t.stateOff}</span>
            </div>
        </div>
        -->
        <!-- Θέση -->
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-arrows-alt"></i> ${t.statePosTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-lock"></i> ${t.stateLock}</span>
                <span class="state-value">${kittyState.pos?.lock ? t.stateYes : t.stateNo}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-circle"></i> ${t.stateBall}</span>
                <span class="state-value">${((kittyState.pos?.ball || 0) * 100).toFixed(0)}%</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-arrow-up"></i> ${t.stateLid}</span>
                <span class="state-value">${((kittyState.pos?.lid || 0) * 100).toFixed(0)}%</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-rotate"></i> ${t.stateFlip}</span>
                <span class="state-value">${kittyState.pos?.flip || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-compass"></i> ${t.stateDir}</span>
                <span class="state-value">${kittyState.pos?.dir || 0}</span>
            </div>
        </div>

        <!-- Τάση -->
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-bolt"></i> ${t.stateVoltTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-arrow-down"></i> ${t.stateDrop}</span>
                <span class="state-value">${kittyState.volt?.drop || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-chart-line"></i> ${t.stateBase}</span>
                <span class="state-value">${kittyState.volt?.base || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-exclamation-triangle"></i> ${t.stateMin}</span>
                <span class="state-value">${kittyState.volt?.min || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.volt?.failed ? 'led-red' : 'led-gray'}"></span> ${t.stateFailed}</span>
                <span class="state-value">${kittyState.volt?.failed ? t.stateYes : t.stateNo}</span>
            </div>
        </div>

        <!-- Ζυγαριά -->
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-weight"></i> ${t.stateScaleTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-weight"></i> ${t.stateGrams}</span>
                <span class="state-value">${kittyState.scale?.grams || 0}g</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-percent"></i> ${t.statePer}</span>
                <span class="state-value">${kittyState.scale?.per || 0}%</span>
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.scale?.alert ? 'led-yellow' : 'led-gray'}"></span> ${t.stateAlert}</span>
                <span class="state-value">${kittyState.scale?.alert ? t.stateYes : t.stateNo}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-pause"></i> ${t.stateIdle}</span>
                <span class="state-value">${kittyState.scale?.idle || 0}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-history"></i> ${t.stateLast}</span>
                <span class="state-value">${kittyState.scale?.last?.grams || 0}g</span>
            </div>
        </div>

        <!-- Δονητής -->
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-wave-square"></i> ${t.stateVibratorTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><span class="status-led ${kittyState.vibrator?.connected ? 'led-green' : 'led-gray'}"></span> ${t.stateConnected}</span>
                <span class="state-value">${kittyState.vibrator?.connected ? t.stateYes : t.stateNo}</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-battery-half"></i> ${t.stateBattery}</span>
                <span class="state-value">${kittyState.vibrator?.battery || 0}%</span>
            </div>
        </div>

        <!-- Αισθητήρας Απόστασης -->
        <div class="state-card">
            <div class="state-card-title">
                <i class="fas fa-ruler"></i> ${t.stateTofTitle}
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-arrows-left-right"></i> ${t.stateDist}</span>
                <span class="state-value">${kittyState.tof?.dist || 0}mm</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-percent"></i> ${t.statePer}</span>
                <span class="state-value">${kittyState.tof?.per || 0}%</span>
            </div>
            <div class="state-row">
                <span class="state-label"><i class="fas fa-microchip"></i> Κατάσταση</span>
                <span class="state-value state-value-badge">${kittyState.tof?.state || 'na'}</span>
            </div>
        </div>
    `;

        container.innerHTML = stateHtml;
    }

    function collectFormData() {
        if (!kittySettings) return {};

        // Deep copy existing settings
        const updatedSettings = JSON.parse(JSON.stringify(kittySettings));

        // Ensure all required objects exist
        if (!updatedSettings.is) updatedSettings.is = {};
        if (!updatedSettings.auto) updatedSettings.auto = {};
        if (!updatedSettings.sand) updatedSettings.sand = kittySettings.sand || {
            1: { name: "betonite", speed: 1, max: 3600, min: 1000, prep: 1 },
            2: { name: "silicone", speed: 1, max: 1500, min: 500, prep: 1 },
            3: { name: "pellet", speed: 1, max: 2800, min: 800, prep: 1 },
            4: { name: "tofu", speed: 1, max: 2000, min: 600, prep: 1 }
        };
        if (!updatedSettings.tof) updatedSettings.tof = { empty: 43.5, full: 35, lost: 6553.5 };

        // Main tab
        updatedSettings.auto.clean = document.getElementById('autoClean').classList.contains('active') ? 1 : 0;
        updatedSettings.auto.delay = parseInt(document.getElementById('autoDelay').value);
        updatedSettings.auto.pause = document.getElementById('autoPause').classList.contains('active') ? 1 : 0;
        updatedSettings.auto.light = document.getElementById('autoLight').classList.contains('active') ? 1 : 0;
        updatedSettings.auto.uvc = document.getElementById('uvc').classList.contains('active') ? 1 : 0;

        // Sand tab
        let sandType = parseInt(document.getElementById('sandType').value);
        updatedSettings.is.sandType = sandType;

        if (updatedSettings.sand[sandType]) {
            updatedSettings.sand[sandType].prep = document.getElementById('sandPrep').classList.contains('active') ? 1 : 0;

            let speedValue = parseInt(document.getElementById('sandSpeed').value);
            updatedSettings.sand[sandType].speed = (19 - speedValue) / 10;

            updatedSettings.sand[sandType].max = parseInt(document.getElementById('sandMax').value);
            updatedSettings.sand[sandType].min = parseInt(document.getElementById('sandMin').value);
        }

        // Advanced tab
        updatedSettings.is.scale = document.getElementById('hwScale').classList.contains('active') ? 1 : 0;
        updatedSettings.is.tof = document.getElementById('hwTof').classList.contains('active') ? 1 : 0;
        updatedSettings.is.lid = document.getElementById('hwLid').classList.contains('active') ? 1 : 0;
        updatedSettings.is.vibrator = document.getElementById('hwVibrator').classList.contains('active') ? 1 : 0;
        updatedSettings.is.voltMon = document.getElementById('hwVoltMon').classList.contains('active') ? 1 : 0;

        let calValue = parseInt(document.getElementById('calibration').value);
        updatedSettings.is.clb = -calValue / 100;

        updatedSettings.tof.empty = parseFloat(document.getElementById('tofEmpty').value);
        updatedSettings.tof.full = parseFloat(document.getElementById('tofFull').value);
        updatedSettings.tof.lost = parseFloat(document.getElementById('tofLost').value);

        if (!updatedSettings.auto.every) updatedSettings.auto.every = { on: 0, hours: [2, 8, 15, 20] };
        updatedSettings.auto.every.on = document.getElementById('scheduleEnable').classList.contains('active') ? 1 : 0;
        updatedSettings.auto.every.hours = [
            parseInt(document.getElementById('hour1').value),
            parseInt(document.getElementById('hour2').value),
            parseInt(document.getElementById('hour3').value),
            parseInt(document.getElementById('hour4').value)
        ];

        return updatedSettings;
    }

    async function refreshData() {
        if (isRefreshing) return;

        const t = translations[currentLanguage];
        statusText.textContent = t.statusReading;
        isRefreshing = true;

        const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');

        // Πάντα φέρνουμε το state.def για τα settings
        await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.kitty.state.def))\n');

        // Αν είμαστε στην καρτέλα κατάστασης, φέρνουμε και το state.is
        if (activeTab === 'state') {
            setTimeout(async() => {
                await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.kitty.state.is))\n');
            }, 200); // Μικρή καθυστέρηση για να μην μπερδευτούν τα μηνύματα
        }

        setTimeout(() => {
            isRefreshing = false;
        }, 1500);
    }

    async function saveSettings() {
        const t = translations[currentLanguage];

        if (!confirm(t.confirmSave)) return;

        try {
            statusText.textContent = t.statusSaving;
            const settings = collectFormData();

            let command = 'ew.apps.kitty.state.def = ' + JSON.stringify(settings) + ';\n';
            command += 'ew.apps.kitty.state.update();\n';

            await sendCommand(command);

            statusText.textContent = t.saveSuccess;
            setTimeout(() => {
                statusText.textContent = t.statusConnected;
            }, 2000);
        }
        catch (error) {
            console.error('Save error:', error);
            statusText.textContent = t.saveError + ': ' + error.message;
        }
    }

    async function startManualClean() {
        const t = translations[currentLanguage];

        if (!confirm(t.cleanConfirm)) return;

        statusText.textContent = t.cleaning;
        await sendCommand('ew.apps.kitty.state.is.sys.manual = 1; ew.apps.kitty.call.wake("clean");\n');

        setTimeout(refreshData, 1000);
    }

    async function startEmpty() {
        const t = translations[currentLanguage];

        if (!confirm(t.emptyConfirm)) return;

        statusText.textContent = t.emptying;
        await sendCommand('ew.apps.kitty.state.is.sys.manual = 1; ew.apps.kitty.call.wake("empty");\n');

        setTimeout(refreshData, 1000);
    }

    async function sendCommand(command) {
        // Split long commands
        const chunkSize = 100;
        for (let i = 0; i < command.length; i += chunkSize) {
            const chunk = command.substring(i, i + chunkSize);
            window.parent.postMessage({
                type: 'BLUETOOTH_COMMAND',
                command: chunk
            }, '*');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
    }

    function toggleCheckbox(id) {
        const checkbox = document.getElementById(id);
        checkbox.classList.toggle('active');
    }

    function askParentForLanguage() {
        window.parent.postMessage({
            type: 'REQUEST_LANGUAGE'
        }, '*');
    }

    function applyLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];

        const setText = (id, text) => {
            const element = document.getElementById(id);
            if (element) element.textContent = text;
        };

        setText('titleText', t.title);
        setText('refreshText', t.refresh);
        setText('saveText', t.save);
        setText('manualCleanText', t.manualClean);
        setText('emptyText', t.empty);
        setText('statusText', t.statusConnected);

        setText('mainTabText', t.mainTab);
        setText('sandTabText', t.sandTab);
        setText('advancedTabText', t.advancedTab);
        setText('statsTabText', t.statsTab);
        setText('stateTabText', t.stateTab);

        setText('autoCleanTitle', t.autoCleanTitle);
        setText('autoCleanLabel', t.autoCleanLabel);
        setText('delayLabel', t.delayLabel);
        setText('minutesLabel', t.minutesLabel);
        setText('autoPauseLabel', t.autoPauseLabel);
        setText('pauseScaleLabel', t.pauseScaleLabel);
        setText('autoLightLabel', t.autoLightLabel);
        setText('uvcTitle', t.uvcTitle);
        setText('uvcLabel', t.uvcLabel);

        setText('sandTypeTitle', t.sandTypeTitle);
        setText('sandTypeLabel', t.sandTypeLabel);
        setText('prepLabel', t.prepLabel);
        setText('speedLabel', t.speedLabel);
        setText('speedRangeLabel', t.speedRangeLabel);
        setText('sandLimitsTitle', t.sandLimitsTitle);
        setText('maxSandLabel', t.maxSandLabel);
        setText('minSandLabel', t.minSandLabel);

        setText('hardwareTitle', t.hardwareTitle);
        setText('scaleLabel', t.scaleLabel);
        setText('tofLabel', t.tofLabel);
        setText('lidLabel', t.lidLabel);
        setText('vibratorLabel', t.vibratorLabel);
        setText('voltMonLabel', t.voltMonLabel);
        setText('calibrationTitle', t.calibrationTitle);
        setText('clbLabel', t.clbLabel);
        setText('clbRangeLabel', t.clbRangeLabel);
        setText('tofSettingsTitle', t.tofSettingsTitle);
        setText('tofEmptyLabel', t.tofEmptyLabel);
        setText('tofFullLabel', t.tofFullLabel);
        setText('tofLostLabel', t.tofLostLabel);
        setText('scheduleTitle', t.scheduleTitle);
        setText('scheduleEnableLabel', t.scheduleEnableLabel);
        setText('scheduleHoursLabel', t.scheduleHoursLabel);

        setText('statsTitle', t.statsTitle);
        setText('totalCyclesLabel', t.totalCyclesLabel);
        setText('todayCyclesLabel', t.todayCyclesLabel);
        setText('failCountLabel', t.failCountLabel);
        setText('wasteLevelLabel', t.wasteLevelLabel);
        setText('powerStatusTitle', t.powerStatusTitle);
        setText('batteryLabel', t.batteryLabel);
        setText('powerBankLabel', t.powerBankLabel);
        setText('chargingLabel', t.chargingLabel);

        setText('stateLastUpdate', t.stateLastUpdate);

        // Update status text if connected
        if (statusDot && statusDot.classList.contains('connected')) {
            statusText.textContent = t.statusConnected;
        }

        // Αν είμαστε στην καρτέλα κατάστασης, ανανεώνουμε την εμφάνιση
        const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');
        if (activeTab === 'state' && kittyState) {
            updateStateDisplay();
        }
    }

    // Auto-refresh functions for state tab
    function startStateAutoRefresh() {
        if (stateUpdateInterval) {
            clearInterval(stateUpdateInterval);
        }

        // Αν δεν υπάρχουν δεδομένα, δείξε μήνυμα αναμονής
        if (!kittyState) {
            updateStateDisplay(); // Αυτό θα δείξει το μήνυμα "Περιμένοντας δεδομένα..."
        }

        // Άμεση πρώτη φόρτωση
        fetchStateData();

        // Κάθε 1 δευτερόλεπτο
        stateUpdateInterval = setInterval(fetchStateData, 1000);
    }

    function stopStateAutoRefresh() {
        if (stateUpdateInterval) {
            clearInterval(stateUpdateInterval);
            stateUpdateInterval = null;
        }
    }

    async function fetchStateData() {
        const spinner = document.getElementById('stateRefreshSpinner');
        const updateStatus = document.getElementById('stateUpdateStatus');

        spinner.classList.remove('hidden'); // Αντί για style.display

        if (updateStatus) updateStatus.textContent = translations[currentLanguage]?.statusReading || 'Ανανέωση...';

        dataBuffer = '';
        await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.kitty.state.is))\n');

        setTimeout(() => {
            spinner.classList.add('hidden');
            if (updateStatus && updateStatus.textContent.includes('Ανανέωση')) {
                updateStatus.textContent = '';
            }
        }, 2000);
    }

    // Make toggleCheckbox globally available
    window.toggleCheckbox = toggleCheckbox;
});
