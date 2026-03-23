// Ειδικός κώδικας για το System Settings app
document.addEventListener('DOMContentLoaded', function() {
    // Μετάφραση κειμένων για το System Settings
    const translations = {
        el: {
            title: "Ρυθμίσεις Συστήματος",
            subtitle: "Διαμόρφωση και προτιμήσεις συσκευής",
            tabGeneral: "Γενικά",
            tabDisplay: "Οθόνη",
            tabBluetooth: "Bluetooth",
            tabDevice: "Συσκευή",
            tabTime: "Χρόνος",
            deviceSettings: "",
            deviceName: "Όνομα Συσκευής",
            deviceRoles: "Ρόλοι Συσκευής",
            systemSettings: "",
            noWd: "Watchdog Απενεργοποιημένο",
            frce: "Εξαναγκασμός Αλλαγής Ονόματος",
            displayFeatures: "Λειτουργίες Οθόνης",
            faceInfo: "Πληροφορίες σε ενέργειες",
            faceBuzz: "Δόνηση στην πλοήγηση",
            faceScrn: "Αυτόματη ενεργοποίηση οθόνης",
            faceTxt: "Κείμενο σε εικονίδια",
            displayAppearance: "Εμφάνιση Οθόνης",
            faceSize: "Μέγεθος Κειμένου",
            faceBri: "Φωτεινότητα",
            displayInfo: "Πληροφορίες Οθόνης",
            faceBpp: "Bit Χρώματος",
            bluetoothSettings: "Ρυθμίσεις Bluetooth",
            btPhyC: "PHY Λειτουργία Σύνδεσης",
            btPhyA: "PHY Λειτουργία Διαφήμισης",
            btRfTX: "Ισχύς Μεταδότη Radio",
            bluetoothAdvanced: "Προχωρημένες Bluetooth",
            btUart: "Υπηρεσία Nordic UART",
            btIntA: "Διάστημα Διαφήμισης (ms)",
            btIntC: "Διάστημα Σύνδεσης",
            btMtu: "Μέγεθος MTU",
            bluetoothInfo: "Πληροφορίες Bluetooth",
            btConn: "BT Συνδετικό",
            btAdv: "BT Διαφήμιση",
            btAddr: "Διεύθυνση BT",
            btCode: "Κωδικός BT",
            btCodeValidation: "ο κωδικός BT πρέπει να έχει ακριβώς 6 ψηφία",
            btCodeInfo: "πρέπει να εχει ακριβώς 6 ψηφία",
            btPair: "Ασφαλής σύνδεση",
            btUartDisableWarning: "ΠΡΟΕΙΔΟΠΟΙΗΣΗ: Αν απενεργοποιήσετε την Nordic UART υπηρεσία, θα χάσετε την ικανότητα επικοινωνίας με τη συσκευή μέσω Bluetooth. Θέλετε να συνεχίσετε;",
            btUartDisableTitle: "Προειδοποίηση Απενεργοποίησης UART",
            sensorSettings: "Ρυθμίσεις Αισθητήρων",
            devAcc: "Επιταχυνσιόμετρο",
            devAccM: "Λειτουργία Επιταχυνσιόμετρου",
            deviceInfo: "Πληροφορίες Συσκευής",
            devTouchType: "Ελεγκτής Αφής",
            devAccType: "Τύπος Επιταχυνσιόμετρου",
            devBoard: "Τύπος Πλακέτας",
            devFirm: "Έκδοση Firmware",
            timeSettings: "Ρυθμίσεις Χρόνου",
            timeHr24: "24ωρη Μορφή",
            timeTimezone: "Ζώνη Ώρας",
            syncTime: "Συγχρονισμός Ώρας",
            syncTimeInfo: "Συγχρονισμός τρέχουσας ώρας browser στη συσκευή",
            syncConfirm: "Θέλετε να συγχρονίσετε την τρέχουσα ώρα του browser στη συσκευή;",
            syncing: "Συγχρονισμός ώρας...",
            syncSuccess: "Η ώρα συγχρονίστηκε επιτυχώς",
            syncError: "Σφάλμα συγχρονισμού ώρας",
            exportSettings: "Εξαγωγή",
            importSettings: "Εισαγωγή",
            saveSettings: "Αποθήκευση",
            addRole: "Προσθήκη",
            remove: "Αφαίρεση",
            settingsSaved: "Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς",
            settingsError: "Σφάλμα αποθήκευσης ρυθμίσεων",
            confirmSave: "Θέλετε να αποθηκεύσετε τις αλλαγές;",
            statusConnected: "Συνδεδεμένοι μέσω eW Launcher",
            statusReading: "Ανάγνωση δεδομένων...",
            statusRefreshing: "Ανανέωση...",
            resetDevice: "Επανεκκίνηση",
            resetConfirm: "Είστε σίγουρος ότι θέλετε να κάνετε reset τη συσκευή; Αυτή η διαδικασία δεν μπορεί να αναιρεθεί.",
            resetting: "Γίνεται reset...",
            resetSuccess: "Η συσκευή reset επιτυχώς",
            resetError: "Σφάλμα κατά το reset"
        },
        en: {
            title: "System Settings",
            subtitle: "Device configuration and preferences",
            tabGeneral: "General",
            tabDisplay: "Display",
            tabBluetooth: "Bluetooth",
            tabDevice: "Device",
            tabTime: "Time",
            deviceSettings: "",
            deviceName: "Device Name",
            deviceRoles: "Device Roles",
            systemSettings: "",
            noWd: "Disable Watchdog",
            frce: "Force Name Change",
            displayFeatures: "",
            faceInfo: "Show info on actions",
            faceBuzz: "Haptic on navigation",
            faceScrn: "Display auto turn on",
            faceTxt: "Text on icons",
            displayAppearance: "",
            faceSize: "Text Size",
            faceBri: "Brightness",
            displayInfo: "",
            faceBpp: "Color Bit Mode",
            bluetoothSettings: "",
            btPhyC: "PHY Connection Mode",
            btPhyA: "PHY Advertising Mode",
            btRfTX: "Radio TX Power",
            bluetoothAdvanced: "",
            btUart: "Nordic UART Service",
            btIntA: "Advertising Interval (ms)",
            btIntC: "Connection Interval",
            btMtu: "MTU Size",
            bluetoothInfo: "",
            btConn: "BT Connectable",
            btAdv: "BT Advertising",
            btAddr: "BT Address",
            btCode: "BT Code",
            btCodeValidation: "BT code must be exactly 6 digits",
            btCodeInfo: "Must be exactly 6 digits",
            btPair: "Secure connection",
            btUartDisableWarning: "WARNING: If you disable the Nordic UART service, you will lose the ability to communicate with the device via Bluetooth. Do you want to continue?",
            btUartDisableTitle: "UART Disable Warning",
            sensorSettings: "",
            devAcc: "Accelerometer",
            devAccM: "Accelerometer Mode",
            deviceInfo: "",
            devTouchType: "Touch Controller",
            devAccType: "Accelerometer Type",
            devBoard: "Board Type",
            devFirm: "Firmware Version",
            timeSettings: "",
            timeHr24: "24 Hour Mode",
            timeTimezone: "Timezone",
            syncTime: "Sync Browser Time",
            syncTimeInfo: "Sync current browser time to device",
            syncConfirm: "Do you want to sync current browser time to device?",
            syncing: "Syncing time...",
            syncSuccess: "Time synced successfully",
            syncError: "Time sync error",
            exportSettings: "Export",
            importSettings: "Import",
            saveSettings: "Save",
            addRole: "Add",
            remove: "Remove",
            settingsSaved: "Settings saved successfully",
            settingsError: "Error saving settings",
            confirmSave: "Do you want to save changes?",
            statusConnected: "Connected via eW Launcher",
            statusReading: "Reading data...",
            statusRefreshing: "Refreshing...",
            resetDevice: "Reboot",
            resetConfirm: "Are you sure you want to reset the device? This action cannot be undone.",
            resetting: "Resetting...",
            resetSuccess: "Device reset successfully",
            resetError: "Error during reset",
        }
    };

    // Καθολικές μεταβλητές
    let currentLanguage = 'el';
    let systemSettings = {};
    let currentRoles = [];
    let dataBuffer = '';

    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const roleTags = document.getElementById('roleTags');
    const addRoleBtn = document.getElementById('addRoleBtn');
    const newRoleSelect = document.getElementById('newRole');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const exportSettingsBtn = document.getElementById('exportSettingsBtn');
    const importSettingsBtn = document.getElementById('importSettingsBtn');
    const importSettingsFile = document.getElementById('importSettingsFile');

    // Αρχικοποίηση
    init();

    function init() {
        askParentForLanguage();
        applyLanguage(currentLanguage);
        setupEventListeners();
        // Αφαίρεσε το auto refreshData() - θα καλείται από APP_LOADED
    }

    function setupEventListeners() {
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                switchTab(tab);
            });
        });

        // BT Code validation
        const btCodeInput = document.getElementById('btCode');
        if (btCodeInput) {
            btCodeInput.addEventListener('input', function(e) {
                // Κρατάει μόνο numbers
                this.value = this.value.replace(/[^0-9]/g, '');

                // Περιορίζει σε 6 ψηφία
                if (this.value.length > 6) {
                    this.value = this.value.slice(0, 6);
                }
            });
        }

        // UART Checkbox warning
        const btUartCheckbox = document.getElementById('btUart');
        if (btUartCheckbox) {
            btUartCheckbox.addEventListener('change', handleUartToggle);
        }

        // time sync
        const syncTimeBtn = document.getElementById('syncTimeBtn');
        if (syncTimeBtn) {
            syncTimeBtn.addEventListener('click', syncTime);
        }

        // reset
        const resetDeviceBtn = document.getElementById('resetDeviceBtn');
        if (resetDeviceBtn) {
            resetDeviceBtn.addEventListener('click', resetDevice);
        }

        // Role management
        addRoleBtn.addEventListener('click', addRole);

        // Settings actions
        saveSettingsBtn.addEventListener('click', saveSettings);
        exportSettingsBtn.addEventListener('click', exportSettings);
        importSettingsBtn.addEventListener('click', () => importSettingsFile.click());
        importSettingsFile.addEventListener('change', handleImportSettings);

        // Range value updates
        document.getElementById('faceSize').addEventListener('input', updateRangeValue);
        document.getElementById('faceBri').addEventListener('input', updateRangeValue);

        // Parent messages
        window.addEventListener('message', handleParentMessage);
    }


    function handleParentMessage(event) {
        console.log("Settings app received message:", event.data);

        if (event.data && event.data.type === 'LANGUAGE_CHANGE') {
            console.log("Changing language to:", event.data.language);
            if (event.data.language !== currentLanguage) {
                currentLanguage = event.data.language;
                applyLanguage(currentLanguage);
            }
        }
        else if (event.data && event.data.type === 'BLUETOOTH_RAW_DATA') {
            console.log("Settings app received raw data:", event.data.data);
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
            systemSettings = data;
            populateSettingsForm(data);
            console.log("System settings loaded successfully");
        }
        else {
            console.error('Μη έγκυρα δεδομένα:', data);
        }
    }


    function populateSettingsForm(settings) {
        systemSettings = settings;

        // General settings
        document.getElementById('deviceName').value = settings.name || '';
        currentRoles = settings.role || [];
        renderRoleTags();
        document.getElementById('noWd').checked = settings.noWd === 1;
        document.getElementById('frce').checked = settings.frce === 1;

        // Face settings - χρησιμοποίησε optional chaining με fallback
        document.getElementById('faceInfo').checked = settings.face?.info === 1;
        document.getElementById('faceBuzz').checked = settings.face.buzz === 1;
        document.getElementById('faceScrn').checked = settings.face?.scrn === 1;
        document.getElementById('faceTxt').checked = settings.face?.txt === 1;
        document.getElementById('faceSize').value = settings.face?.size ?? 0.8;
        document.getElementById('faceBri').value = settings.face?.bri ?? 7;
        document.getElementById('faceBpp').value = settings.face?.bpp ?? 4;

        // Bluetooth settings
        document.getElementById('btPhyC').value = settings.bt?.phyC ?? '1mbps';
        document.getElementById('btPhyA').value = settings.bt?.phyA ?? '1mbps';
        document.getElementById('btUart').checked = settings.bt?.uart === 1;
        document.getElementById('btRfTX').value = settings.bt?.rfTX ?? 8;
        document.getElementById('btIntA').value = settings.bt?.intA ?? 1626;
        document.getElementById('btIntC').value = settings.bt?.intC ?? 'auto';
        document.getElementById('btMtu').value = settings.bt?.mtu ?? 90;
        document.getElementById('btConn').value = settings.bt?.conn === 1 ? 'TRUE' : 'FALSE';
        document.getElementById('btAdv').value = settings.bt?.adv === 1 ? 'TRUE' : 'FALSE';
        document.getElementById('btAddr').value = settings.bt?.addr ?? '';
        document.getElementById('btCode').value = settings.bt?.code ?? '';
        document.getElementById('btPair').checked = settings.bt?.pair === 1;

        // Device settings
        document.getElementById('devAcc').checked = settings.dev?.acc === 1;
        document.getElementById('devAccM').value = settings.dev?.accM ?? 0;
        document.getElementById('devTouchType').value = settings.dev?.touchtype ?? '0';
        document.getElementById('devAccType').value = settings.dev?.acctype ?? '0';
        document.getElementById('devBoard').value = settings.dev?.board ?? '';
        document.getElementById('devFirm').value = settings.dev?.firm ?? '';

        // Time settings
        document.getElementById('timeHr24').checked = settings.time?.hr24 === 1;
        document.getElementById('timeTimezone').value = settings.time?.timezone ?? '3';

        updateRangeValue();
    }

    function updateRangeValue() {
        const faceSizeValue = document.getElementById('faceSizeValue');
        const faceBriValue = document.getElementById('faceBriValue');
        if (faceSizeValue) faceSizeValue.textContent = document.getElementById('faceSize').value;
        if (faceBriValue) faceBriValue.textContent = document.getElementById('faceBri').value;
    }

    function switchTab(tabName) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
    }

    function addRole() {
        const role = newRoleSelect.value;
        if (role && !currentRoles.includes(role)) {
            currentRoles.push(role);
            renderRoleTags();
        }
    }

    function removeRole(role) {
        currentRoles = currentRoles.filter(r => r !== role);
        renderRoleTags();
    }

    function renderRoleTags() {
        const t = translations[currentLanguage];
        roleTags.innerHTML = '';

        currentRoles.forEach(role => {
            const tag = document.createElement('div');
            tag.className = 'role-tag';
            tag.innerHTML = `
                ${role}
                <button class="remove-role" onclick="removeRole('${role}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            roleTags.appendChild(tag);
        });
    }

    function refreshData() {
        console.log("Refreshing system settings...");
        sendCommand('print(JSON.stringify(ew.def))\n');
    }

    function collectFormData() {
        // systemSettings as base
        const updatedSettings = JSON.parse(JSON.stringify(systemSettings)); // Deep copy

        // General settings
        if (document.getElementById('deviceName')) updatedSettings.name = document.getElementById('deviceName').value;
        if (currentRoles) updatedSettings.role = currentRoles;
        if (document.getElementById('noWd')) updatedSettings.noWd = document.getElementById('noWd').checked ? 1 : 0;
        if (document.getElementById('frce')) updatedSettings.frce = document.getElementById('frce').checked ? 1 : 0;

        // Face settings 
        if (!updatedSettings.face) updatedSettings.face = {};
        if (document.getElementById('faceInfo')) updatedSettings.face.info = document.getElementById('faceInfo').checked ? 1 : 0;
        if (document.getElementById('faceBuzz')) updatedSettings.face.buzz = document.getElementById('faceBuzz').checked ? 1 : 0;
        if (document.getElementById('faceScrn')) updatedSettings.face.scrn = document.getElementById('faceScrn').checked ? 1 : 0;
        if (document.getElementById('faceTxt')) updatedSettings.face.txt = document.getElementById('faceTxt').checked ? 1 : 0;
        if (document.getElementById('faceSize')) updatedSettings.face.size = parseFloat(document.getElementById('faceSize').value);
        if (document.getElementById('faceBri')) updatedSettings.face.bri = parseInt(document.getElementById('faceBri').value);
        if (document.getElementById('faceBpp')) updatedSettings.face.bpp = parseInt(document.getElementById('faceBpp').value);
        // Κράτα το face.off όπως ήταν

        // Bluetooth settings
        if (!updatedSettings.bt) updatedSettings.bt = {};
        if (document.getElementById('btPhyC')) updatedSettings.bt.phyC = document.getElementById('btPhyC').value;
        if (document.getElementById('btPhyA')) updatedSettings.bt.phyA = document.getElementById('btPhyA').value;
        if (document.getElementById('btUart')) updatedSettings.bt.uart = document.getElementById('btUart').checked ? 1 : 0;
        if (document.getElementById('btRfTX')) updatedSettings.bt.rfTX = parseInt(document.getElementById('btRfTX').value);
        if (document.getElementById('btIntA')) updatedSettings.bt.intA = parseInt(document.getElementById('btIntA').value);
        if (document.getElementById('btIntC')) updatedSettings.bt.intC = document.getElementById('btIntC').value;
        if (document.getElementById('btMtu')) updatedSettings.bt.mtu = parseInt(document.getElementById('btMtu').value);
        if (document.getElementById('btCode')) updatedSettings.bt.code = document.getElementById('btCode').value;
        if (document.getElementById('btPair')) updatedSettings.bt.pair = document.getElementById('btPair').checked ? 1 : 0;


        // Device settings
        if (!updatedSettings.dev) updatedSettings.dev = {};
        if (document.getElementById('devAcc')) updatedSettings.dev.acc = document.getElementById('devAcc').checked ? 1 : 0;
        if (document.getElementById('devAccM')) updatedSettings.dev.accM = parseInt(document.getElementById('devAccM').value);

        // Time settings
        if (!updatedSettings.time) updatedSettings.time = {};
        if (document.getElementById('timeHr24')) updatedSettings.time.hr24 = document.getElementById('timeHr24').checked ? 1 : 0;
        if (document.getElementById('timeTimezone')) updatedSettings.time.timezone = document.getElementById('timeTimezone').value;

        return updatedSettings;
    }

    async function saveSettings() {
        const t = translations[currentLanguage];


        const btCodeInput = document.getElementById('btCode');
        if (btCodeInput && btCodeInput.value.length > 0 && btCodeInput.value.length !== 6) {
            alert(t.btCodeValidation);
            btCodeInput.focus();
            return; // Σταματάει την αποθήκευση
        }


        if (!confirm(t.confirmSave)) {
            return;
        }

        try {
            const settings = collectFormData();

            // Αποστολή ρυθμίσεων στο ESPruino
            await updateSystemSettings(settings);

            alert(t.settingsSaved);
        }
        catch (error) {
            console.error('Σφάλμα αποθήκευσης:', error);
            alert(t.settingsError + ': ' + error.message);
        }
    }

    async function updateSystemSettings(settings) {
        try {
            // def settings
            let command = 'ew.def = ' + JSON.stringify(settings) + ';\n';

            const chunkSize = 100;
            for (let i = 0; i < command.length; i += chunkSize) {
                const chunk = command.substring(i, i + chunkSize);
                await sendCommand(chunk);
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            // confirm
            await sendCommand('Bluetooth.println("System settings saved");\n');
            // update
            await sendCommand('\x10ew.sys.updt();\n');


        }
        catch (error) {
            console.error('Σφάλμα ενημέρωσης συστήματος:', error);
            throw error;
        }
    }

    function exportSettings() {
        const settings = collectFormData();
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `system-settings-${settings.name || 'device'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function handleImportSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                populateSettingsForm(settings);
            }
            catch (error) {
                alert('Σφάλμα εισαγωγής: Μη έγκυρη μορφή αρχείου');
            }
        };
        reader.readAsText(file);

        event.target.value = '';
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
            }
        };

        // Update all text elements
        setTextIfExists('titleText', t.title);
        setTextIfExists('subtitleText', t.subtitle);
        setTextIfExists('tabGeneralText', t.tabGeneral);
        setTextIfExists('tabDisplayText', t.tabDisplay);
        setTextIfExists('tabBluetoothText', t.tabBluetooth);
        setTextIfExists('tabDeviceText', t.tabDevice);
        setTextIfExists('tabTimeText', t.tabTime);
        setTextIfExists('deviceSettingsText', t.deviceSettings);
        setTextIfExists('deviceNameLabel', t.deviceName);
        setTextIfExists('deviceRolesLabel', t.deviceRoles);
        setTextIfExists('systemSettingsText', t.systemSettings);
        setTextIfExists('noWdLabel', t.noWd);
        setTextIfExists('frceLabel', t.frce);
        setTextIfExists('displayFeaturesText', t.displayFeatures);
        setTextIfExists('faceInfoLabel', t.faceInfo);
        setTextIfExists('faceBuzzLabel', t.faceBuzz);
        setTextIfExists('faceScrnLabel', t.faceScrn);
        setTextIfExists('faceTxtLabel', t.faceTxt);
        setTextIfExists('displayAppearanceText', t.displayAppearance);
        setTextIfExists('faceSizeLabel', t.faceSize);
        setTextIfExists('faceBriLabel', t.faceBri);
        setTextIfExists('displayInfoText', t.displayInfo);
        setTextIfExists('faceBppLabel', t.faceBpp);
        setTextIfExists('bluetoothSettingsText', t.bluetoothSettings);
        setTextIfExists('btPhyCLabel', t.btPhyC);
        setTextIfExists('btPhyALabel', t.btPhyA);
        setTextIfExists('btRfTXLabel', t.btRfTX);
        setTextIfExists('bluetoothAdvancedText', t.bluetoothAdvanced);
        setTextIfExists('btUartLabel', t.btUart);
        setTextIfExists('btIntALabel', t.btIntA);
        setTextIfExists('btIntCLabel', t.btIntC);
        setTextIfExists('btMtuLabel', t.btMtu);
        setTextIfExists('bluetoothInfoText', t.bluetoothInfo);
        setTextIfExists('btConnLabel', t.btConn);
        setTextIfExists('btAdvLabel', t.btAdv);
        setTextIfExists('btAddrLabel', t.btAddr);
        setTextIfExists('btCodeLabel', t.btCode);
        setTextIfExists('btCodeInfoLabel', t.btCodeInfo);
        setTextIfExists('btPairLabel', t.btPair);
        setTextIfExists('sensorSettingsText', t.sensorSettings);
        setTextIfExists('devAccLabel', t.devAcc);
        setTextIfExists('devAccMLabel', t.devAccM);
        setTextIfExists('deviceInfoText', t.deviceInfo);
        setTextIfExists('devTouchTypeLabel', t.devTouchType);
        setTextIfExists('devAccTypeLabel', t.devAccType);
        setTextIfExists('devBoardLabel', t.devBoard);
        setTextIfExists('devFirmLabel', t.devFirm);
        setTextIfExists('timeSettingsText', t.timeSettings);
        setTextIfExists('timeHr24Label', t.timeHr24);
        setTextIfExists('timeTimezoneLabel', t.timeTimezone);
        setTextIfExists('syncTimeText', t.syncTime);
        setTextIfExists('syncTimeInfoLabel', t.syncTimeInfo);
        setTextIfExists('exportSettingsText', t.exportSettings);
        setTextIfExists('importSettingsText', t.importSettings);
        setTextIfExists('saveSettingsText', t.saveSettings);
        setTextIfExists('resetDeviceText', t.resetDevice);

        // Update button texts
        const addRoleBtn = document.getElementById('addRoleBtn');
        if (addRoleBtn) addRoleBtn.innerHTML = `<i class="fas fa-plus"></i> ${t.addRole}`;

        console.log("Language applied successfully!");
    }


    async function resetDevice() {
        const t = translations[currentLanguage];

        if (!confirm(t.resetConfirm)) {
            return;
        }

        try {
            const resetDeviceBtn = document.getElementById('resetDeviceBtn');
            const originalText = resetDeviceBtn.innerHTML;

            // Απενεργοποίηση κουμπιού και εμφάνιση loading
            resetDeviceBtn.disabled = true;
            resetDeviceBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t.resetting}`;

            // Αποστολή reset command
            await sendCommand('\x10ew.sys.updt(10);\n');

            // Μικρή καθυστέρηση για να δούμε το μήνυμα
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert(t.resetSuccess);

            // Επαναφορά κουμπιού
            resetDeviceBtn.disabled = false;
            resetDeviceBtn.innerHTML = originalText;

        }
        catch (error) {
            console.error('Reset error:', error);
            alert(t.resetError + ': ' + error.message);

            // Επαναφορά κουμπιού σε περίπτωση σφάλματος
            const resetDeviceBtn = document.getElementById('resetDeviceBtn');
            resetDeviceBtn.disabled = false;
            resetDeviceBtn.innerHTML = `<i class="fas fa-power-off"></i> ${t.resetDevice}`;
        }
    }

    async function syncTime() {
        const t = translations[currentLanguage];

        if (!confirm(t.syncConfirm)) {
            return;
        }

        try {
            const syncTimeBtn = document.getElementById('syncTimeBtn');
            const originalText = syncTimeBtn.innerHTML;

            // Απενεργοποίηση κουμπιού και εμφάνιση loading
            syncTimeBtn.disabled = true;
            syncTimeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t.syncing}`;

            // Λήψη τρέχουσας ώρας browser και timezone
            const now = new Date();
            const timestamp = Math.floor(now.getTime() / 1000); // Unix timestamp in seconds
            const timezoneOffset = -now.getTimezoneOffset() / 60; // Timezone offset in hours

            // Δημιουργία εντολών για να οριστεί η ώρα και timezone
            const commands = [
                `setTime(${timestamp});\n`,
                `E.setTimeZone(${timezoneOffset});\n`
            ];

            // Αποστολή όλων των εντολών
            for (const command of commands) {
                await sendCommand(command);
                await new Promise(resolve => setTimeout(resolve, 100)); // Μικρή καθυστέρηση μεταξύ εντολών
            }

            // Επιβεβαίωση
            await sendCommand('console.log("Time synced - UTC: " + getTime() + ", Local: " + (getTime()+E.getTimeZone()*3600));\n');

            alert(t.syncSuccess);

            // Επαναφορά κουμπιού
            syncTimeBtn.disabled = false;
            syncTimeBtn.innerHTML = originalText;

        }
        catch (error) {
            console.error('Time sync error:', error);
            alert(t.syncError + ': ' + error.message);

            // Επαναφορά κουμπιού σε περίπτωση σφάλματος
            const syncTimeBtn = document.getElementById('syncTimeBtn');
            syncTimeBtn.disabled = false;
            syncTimeBtn.innerHTML = `<i class="fas fa-clock"></i> ${t.syncTime}`;
        }
    }

    /*function handleUartToggle(event) {
        const t = translations[currentLanguage];
        const isChecked = event.target.checked;
        
        // Αν προσπαθεί να απενεργοποιήσει το UART (uncheck)
        if (!isChecked) {
            // Εμφάνιση custom confirmation dialog
            const warningHtml = `
                <div style="text-align: center; padding: 10px;">
                    <div style="color: #ff6b6b; font-size: 24px; margin-bottom: 10px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 style="margin: 10px 0; color: #ff6b6b;">${t.btUartDisableTitle}</h3>
                    <p style="margin: 15px 0; line-height: 1.4;">${t.btUartDisableWarning}</p>
                </div>
            `;
            
            const userConfirmed = confirm(warningHtml.replace(/<[^>]*>/g, '')); // Plain text fallback
            
            // Αν ο χρήστης ακυρώσει, επαναφορά του checkbox
            if (!userConfirmed) {
                event.target.checked = true;
                event.preventDefault();
                return false;
            }
        }
        
        return true;
    }
    */
    function handleUartToggle(event) {
        const t = translations[currentLanguage];
        const isChecked = event.target.checked;

        // Αν προσπαθεί να απενεργοποιήσει το UART (uncheck)
        if (!isChecked) {
            // Εμφάνιση προειδοποιητικού μηνύματος
            const userConfirmed = confirm(t.btUartDisableWarning);

            // Αν ο χρήστης ακυρώσει, επαναφορά του checkbox
            if (!userConfirmed) {
                event.target.checked = true; // Επαναφορά σε checked
                event.preventDefault(); // Ακύρωση του event
                return false;
            }
        }

        // Αν είναι checked ή ο χρήστης επιβεβαίωσε, συνεχίζει κανονικά
        return true;
    }

    // Make functions available globally for inline handlers
    window.removeRole = removeRole;
});
