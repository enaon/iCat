// Κύριο JS για τον control
document.addEventListener('DOMContentLoaded', function() {
    // Στοιχεία DOM
    const connectBtn = document.getElementById('connectBtn');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const appList = document.getElementById('appList');
    const appFrame = document.getElementById('appFrame');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const frameSelector = document.getElementById('frameSelector');
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const statusDotHeader = document.getElementById('statusDotHeader');
    const statusTextHeader = document.getElementById('statusTextHeader');

    // Μεταβλητές κατάστασης
    let isConnected = false;
    let currentDevice = null;
    let uartService = null;
    let uartRxCharacteristic = null;
    let uartTxCharacteristic = null;
    let dataBuffer = '';
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'el';
    let commandQueue = [];
    let isProcessingQueue = false;
    let isFirstLoad = true;
    let currentApp = null;

    // UUIDs για UART
    const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const UART_RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    const UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    // Αρχικοποίηση
    init();

    function init() {
        updateLanguage();
        setupEventListeners();
        checkWebBluetoothSupport();
        setupResizeHandler();
        checkScreenSize();
    }

    function setupEventListeners() {
        // Γλώσσα
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.language-selector')) {
                languageDropdown.classList.remove('show');
            }
        });

        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                if (lang !== currentLanguage) {
                    currentLanguage = lang;
                    updateLanguage();
                    languageDropdown.classList.remove('show');
                    localStorage.setItem('preferredLanguage', lang);
                }
            });
        });
       /* document.getElementById('settingsBtn').addEventListener('click', function() {
            // Στο control.js, στο click του settings button:
            document.getElementById('settingsBtn').addEventListener('click', function() {
              loadApp('handler');
            });


            //showFrame('app/handler/index.html');

            // Ενημέρωση του current app indicator
            //document.getElementById('statusTextHeader').textContent = 'System Settings';
        });
        */

        // Σύνδεση Bluetooth
        connectBtn.addEventListener('click', function() {
            if (isConnected) {
                disconnectDevice();
            }
            else {
                connectToDevice();
            }
        });

        // Sidebar
        menuToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', hideSidebar);
        frameSelector.addEventListener('click', toggleSidebar);

        // Messages από apps
        window.addEventListener('message', handleAppMessage);

        // Swipe gestures
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        document.addEventListener('touchend', handleTouchEnd, false);
    }

    function handleAppMessage(event) {
        if (event.data.type === 'BLUETOOTH_COMMAND') {
            console.log("Launcher received command from app:", event.data.command);
            addToCommandQueue(event.data.command);
        }
        else if (event.data && event.data.type === 'REQUEST_LANGUAGE') {
            console.log("Received language request from iframe");
            sendLanguageToIframe();
        }
    }

    function checkWebBluetoothSupport() {
        if (!navigator.bluetooth) {
            statusText.textContent = 'Το Web Bluetooth δεν υποστηρίζεται από αυτό το browser';
            statusTextHeader.textContent = 'No WebBT';
            connectBtn.disabled = true;
        }
    }

    function setupResizeHandler() {
        window.addEventListener('resize', () => ewCommon.updateAppFrameHeight(appFrame));
        window.addEventListener('load', () => ewCommon.updateAppFrameHeight(appFrame));
    }

    function checkScreenSize() {
        if (isFirstLoad) {
            sidebar.classList.remove('hidden');
            overlay.classList.remove('visible');
            if (!isConnected) {
                const t = launcherTranslations[currentLanguage];
                appList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plug"></i>
                    <p>${t.connectToLoadApps}</p>
                </div>
            `;
            }
            isFirstLoad = false;
        }
    }

    // Συναρτήσεις Bluetooth
    async function connectToDevice() {
        try {
            const t = launcherTranslations[currentLanguage];
            statusText.textContent = t.statusConnecting;
            statusTextHeader.textContent = t.statusConnecting;

            currentDevice = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'eW' }],
                optionalServices: [UART_SERVICE_UUID]
            });

            if (!currentDevice) {
                statusText.textContent = t.deviceNotSelected;
                statusTextHeader.textContent = t.deviceNotSelected;
                return;
            }

            statusText.textContent = t.statusConnecting;
            statusTextHeader.textContent = t.statusConnecting;
            const server = await currentDevice.gatt.connect();

            uartService = await server.getPrimaryService(UART_SERVICE_UUID);
            uartRxCharacteristic = await uartService.getCharacteristic(UART_RX_CHARACTERISTIC_UUID);
            uartTxCharacteristic = await uartService.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);

            await uartTxCharacteristic.startNotifications();
            uartTxCharacteristic.addEventListener('characteristicvaluechanged', handleUartData);

            isConnected = true;
            statusDot.classList.add('connected');
            statusDotHeader.classList.add('connected');
            statusText.textContent = t.statusConnected;
            statusTextHeader.textContent = t.statusConnected;
            connectBtn.innerHTML = `<i class="fas fa-bluetooth-b"></i> ${t.disconnect}`;

            currentDevice.addEventListener('gattserverdisconnected', onDisconnected);

            await new Promise(resolve => setTimeout(resolve, 1000));
            await scanForApps();

        }
        catch (error) {
            const t = launcherTranslations[currentLanguage];
            console.error('Σφάλμα σύνδεσης:', error);
            statusText.textContent = t.connectionError + ': ' + error.message;
            statusTextHeader.textContent = t.connectionError;
        }
    }

    function disconnectDevice() {
        if (currentDevice && currentDevice.gatt.connected) {
            currentDevice.gatt.disconnect();
        }
        onDisconnected();
    }

    function onDisconnected() {
        console.log("onDisconnected called");
        const t = launcherTranslations[currentLanguage];

        isConnected = false;
        statusDot.classList.remove('connected');
        statusDotHeader.classList.remove('connected');
        statusText.textContent = t.disconnectConfirm;
        statusTextHeader.textContent = t.disconnectConfirm;
        connectBtn.innerHTML = `<i class="fas fa-bluetooth-b"></i> ${t.connect}`;

        appFrame.onload = null;
        appFrame.src = 'about:blank';

        appList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plug"></i>
                <p>${t.connectToLoadApps}</p>
            </div>
        `;

        showSidebar();

        currentDevice = null;
        uartService = null;
        uartRxCharacteristic = null;
        uartTxCharacteristic = null;
        dataBuffer = '';

        commandQueue = [];
        isProcessingQueue = false;
        currentApp = null;
    }

    async function scanForApps() {
        if (!isConnected) return;

        try {
            const t = launcherTranslations[currentLanguage];
            statusText.innerHTML = `${t.statusScanning} <span class="loading-spinner"></span>`;
            statusTextHeader.textContent = t.statusScanning;

            dataBuffer = '';

            appList.innerHTML = `
                <div class="app-item" style="opacity: 0.5;"><div class="skeleton" style="width: 80%; height: 1.2em;"></div></div>
                <div class="app-item" style="opacity: 0.5;"><div class="skeleton" style="width: 60%; height: 1.2em;"></div></div>
                <div class="app-item" style="opacity: 0.5;"><div class="skeleton" style="width: 70%; height: 1.2em;"></div></div>
            `;

            await sendCommand('\x10Bluetooth.println("@@APPS_LIST_START@@" + JSON.stringify(Object.keys(ew.apps)) + "@@APPS_LIST_END@@");\n');
            await new Promise(resolve => setTimeout(resolve, 500));

        }
        catch (error) {
            const t = launcherTranslations[currentLanguage];
            console.error('Σφάλμα σάρωσης:', error);
            statusText.textContent = t.scanError + ': ' + error.message;
            statusTextHeader.textContent = t.scanError;
        }
    }

    // Ουρά εντολών
    function addToCommandQueue(command) {
        commandQueue.push(command);
        if (!isProcessingQueue) {
            processCommandQueue();
        }
    }

    async function processCommandQueue() {
        if (commandQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }

        isProcessingQueue = true;
        const command = commandQueue[0];

        try {
            await sendCommandDirect(command);
            commandQueue.shift();
        }
        catch (error) {
            console.error("Σφάλμα αποστολής εντολής, προσπαθώ ξανά:", error);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (commandQueue.length > 0) {
            setTimeout(processCommandQueue, 50);
        }
        else {
            isProcessingQueue = false;
        }
    }

    async function sendCommandDirect(command) {
        if (!uartRxCharacteristic) {
            console.error("Δεν υπάρχει σύνδεση UART");
            throw new Error("No UART connection");
        }

        try {
            console.log("Αποστολή εντολής:", command);
            const encoder = new TextEncoder();
            const data = encoder.encode(command);

            const CHUNK_SIZE = 100;
            for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                const chunk = data.slice(i, i + CHUNK_SIZE);
                await uartRxCharacteristic.writeValue(chunk);
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        catch (error) {
            console.error("Σφάλμα αποστολής εντολής:", error);
            throw error;
        }
    }

    async function sendCommand(command) {
        return sendCommandDirect(command);
    }

    function handleUartData(event) {
        try {
            const value = event.target.value;
            const decoder = new TextDecoder();
            const rawData = decoder.decode(value);

            console.log("📨 Launcher received RAW:", JSON.stringify(rawData));
            dataBuffer += rawData;

            const startTag = "@@APPS_LIST_START@@";
            const endTag = "@@APPS_LIST_END@@";

            function findValidStart(buf) {
                let idx = buf.indexOf(startTag);
                while (idx !== -1) {
                    let pos = idx + startTag.length;
                    while (pos < buf.length && /\s/.test(buf[pos])) pos++;
                    if (pos < buf.length && (buf[pos] === '[' || buf[pos] === '{')) return idx;
                    idx = buf.indexOf(startTag, idx + 1);
                }
                return -1;
            }

            let start = findValidStart(dataBuffer);
            let end = (start !== -1) ? dataBuffer.indexOf(endTag, start + startTag.length) : -1;

            while (start !== -1 && end !== -1) {
                const jsonStart = start + startTag.length;
                const jsonString = dataBuffer.substring(jsonStart, end).trim();

                console.log("📝 Candidate JSON chunk:", jsonString);

                try {
                    const jsonData = JSON.parse(jsonString);
                    console.log("✅ Parsed apps list:", jsonData);

                    if (Array.isArray(jsonData)) {
                        processAppsObject(jsonData);
                    }
                    else {
                        console.warn("⚠️ Parsed JSON is not an array:", jsonData);
                    }
                }
                catch (e) {
                    console.error("❌ JSON parse error for candidate chunk:", e);
                }

                dataBuffer = dataBuffer.slice(end + endTag.length);
                start = findValidStart(dataBuffer);
                end = (start !== -1) ? dataBuffer.indexOf(endTag, start + startTag.length) : -1;
            }

            if (dataBuffer.length > 8 * 1024) {
                console.warn("⚠️ dataBuffer too large, trimming to last 2KB");
                dataBuffer = dataBuffer.slice(-2048);
            }

            if (appFrame && appFrame.contentWindow) {
                try {
                    appFrame.contentWindow.postMessage({
                        type: 'BLUETOOTH_RAW_DATA',
                        data: rawData
                    }, '*');
                    console.log("📤 Forwarded data to iframe");
                }
                catch (e) {
                    console.log("❌ Could not post message to iframe:", e);
                }
            }

        }
        catch (error) {
            console.error("💥 Error in handleUartData:", error);
        }
    }

    function processAppsObject(appsObject) {
        let appNames = [];
        if (Array.isArray(appsObject) && appsObject.every(item => typeof item === 'string')) {
            appNames = appsObject;
        }
        else if (typeof appsObject === 'object' && appsObject !== null) {
            appNames = Object.keys(appsObject);
        }
        else {
            console.error("Μη αναμενόμενο format apps:", appsObject);
            return;
        }

        const t = launcherTranslations[currentLanguage];
        statusText.textContent = t.statusAppsFound.replace('{count}', appNames.length);
        statusTextHeader.textContent = t.statusAppsFound.replace('{count}', appNames.length);

        if (appNames.length === 0) {
            appList.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${t.noAppsFound}</p></div>`;
            statusTextHeader.textContent = t.noWebApps;
            return;
        }

        checkAppsExistence(appNames);
    }

    async function checkAppsExistence(appNames) {
        //const availableApps = [];
        const availableApps = [
            'handler'
        ];

        for (const appName of appNames) {
            try {
                const exists = await ewCommon.checkAppExistence(appName);
                if (exists) {
                    availableApps.push(appName);
                }
            }
            catch (e) {
                console.log(`App ${appName} not found:`, e);
            }
        }

        displayAvailableApps(availableApps);
    }

    function displayAvailableApps(apps) {
        const t = launcherTranslations[currentLanguage];

        if (apps.length === 0) {
            appList.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i><p>${t.noAppsFound}</p></div>`;
            statusText.textContent = t.noAppsFound;
            statusTextHeader.textContent = t.noWebApps;
            return;
        }

        statusText.textContent = t.statusAppsFound.replace('{count}', apps.length);
        statusTextHeader.textContent = t.statusAppsFound.replace('{count}', apps.length);
        appList.innerHTML = '';

        apps.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            appItem.textContent = app;
            appItem.addEventListener('click', () => {
                loadApp(app);
                hideSidebar();
            });
            appList.appendChild(appItem);
        });

        let defaultAppName = null;
        if (apps.includes('timer')) {
            defaultAppName = 'timer';
        }
        else {
            defaultAppName = apps[0];
        }

        if (defaultAppName) {
            loadApp(defaultAppName);
        }
    }

    function loadApp(appName) {
        const t = launcherTranslations[currentLanguage];
        currentApp = appName;

        document.querySelectorAll('.app-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent === appName) {
                item.classList.add('active');
            }
        });

        let appPath;
        if (ewCommon.isFileProtocol) {
            appPath = `app/${appName}/index.html`;
        }
        else {
            appPath = `${ewCommon.basePath}/app/${appName}/index.html`;
        }

        appFrame.src = appPath;
        statusText.textContent = t.statusLoading.replace('{app}', appName);
        statusTextHeader.textContent = t.statusLoading.replace('{app}', appName);

        dataBuffer = '';

        appFrame.onload = function() {
            statusText.textContent = t.statusRunning.replace('{app}', appName);
            statusTextHeader.textContent = t.statusRunning.replace('{app}', appName);

            // ΜΗΝ ΣΤΕΙΛΕΙΣ ΑΥΤΟΜΑΤΑ ΤΟ COMMAND
            // ΑΦΗΣΕ ΤΟ APP ΝΑ ΤΟ ΖΗΤΗΣΕΙ ΜΟΝΟ ΤΟΥ

            try {
                appFrame.contentWindow.postMessage({
                    type: 'APP_LOADED',
                    appName: appName
                }, '*');
            }
            catch (e) {
                console.log("Could not post message to iframe:", e);
            }

            setTimeout(() => ewCommon.updateAppFrameHeight(appFrame), 100);
        };
    }

    // Sidebar functions
    function toggleSidebar() {
        if (sidebar.classList.contains('hidden')) {
            showSidebar();
        }
        else {
            hideSidebar();
        }
    }

    function showSidebar() {
        sidebar.classList.remove('hidden');
        overlay.classList.add('visible');
    }

    function hideSidebar() {
        sidebar.classList.add('hidden');
        overlay.classList.remove('visible');
    }

    // Swipe functions
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(evt) {
        const firstTouch = evt.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
        if (!touchStartX || !touchStartY) return;

        const touchX = evt.touches[0].clientX;
        const touchY = evt.touches[0].clientY;

        const diffX = touchX - touchStartX;
        const diffY = touchY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50 && touchStartX < 50) {
            showSidebar();
        }
    }

    function handleTouchEnd() {
        touchStartX = 0;
        touchStartY = 0;
    }

    // Language functions
    function updateLanguage() {
        const t = launcherTranslations[currentLanguage];
        document.querySelector('.header-title').textContent = t.title;
        document.getElementById('connectBtn').innerHTML = `<i class="fas fa-bluetooth-b"></i> ${isConnected ? t.disconnect : t.connect}`;
        document.getElementById('frameSelector').innerHTML = `<i class="fas fa-th-large"></i> ${t.selectApp}`;

        if (!isConnected) {
            document.getElementById('statusText').textContent = t.statusDisconnected;
            document.getElementById('statusTextHeader').textContent = t.statusDisconnected;
        }

        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.querySelector('p').textContent = t.noAppsFound;
        }

        sendLanguageToIframe();
    }

    function sendLanguageToIframe() {
        if (appFrame && appFrame.contentWindow) {
            try {
                appFrame.contentWindow.postMessage({
                    type: 'LANGUAGE_CHANGE',
                    language: currentLanguage
                }, '*');
                console.log("Sent language to iframe:", currentLanguage);
            }
            catch (e) {
                console.log("Could not send language change to iframe:", e);
            }
        }
    }
});
