// Κοινές μεταφράσεις για τον launcher
const launcherTranslations = {
    el: {
        title: "eW",
        connect: "Σύνδεση",
        disconnect: "Αποσύνδεση",
        statusDisconnected: "Δεν έχετε συνδεθεί με Espruino",
        statusConnecting: "Αναζήτηση συσκευών Bluetooth...",
        statusConnected: "Συνδεδεμένοι",
        statusScanning: "Σάρωση...",
        statusAppsFound: "Βρέθηκαν {count} apps",
        statusLoading: "Φόρτωση: {app}",
        statusRunning: "Τρέχει: {app}",
        selectApp: "Επιλογή App",
        noWebBT: "No WebBT",
        deviceNotSelected: "Δεν επιλέχθηκε",
        connectionError: "Σφάλμα σύνδεσης",
        scanError: "Σφάλμα σάρωσης",
        connectToLoadApps: "Συνδεθείτε για να φορτώσετε apps",
        noAppsFound: "Δεν βρέθηκαν εφαρμογές",
        noWebApps: "0 web apps",
        appsTitle: "Εφαρμογές",
        disconnectConfirm: "Αποσυνδεθήκατε από τη συσκευή"
    },
    en: {
        title: "eW",
        connect: "Connect",
        disconnect: "Disconnect",
        statusDisconnected: "Not connected to Espruino",
        statusConnecting: "Searching for Bluetooth devices...",
        statusConnected: "Connected",
        statusScanning: "Scanning...",
        statusAppsFound: "Found {count} apps",
        statusLoading: "Loading: {app}",
        statusRunning: "Running: {app}",
        selectApp: "Select App",
        noWebBT: "No WebBT",
        deviceNotSelected: "Not selected",
        connectionError: "Connection error",
        scanError: "Scan error",
        connectToLoadApps: "Connect to load apps",
        noAppsFound: "No apps found",
        noWebApps: "0 web apps",
        appsTitle: "Applications",
        disconnectConfirm: "Disconnected from device"
    }
};

// Κοινές συναρτήσεις
class EWLauncherCommon {
    constructor() {
        this.isGitHubPages = window.location.hostname.includes('github.io');
        this.isFileProtocol = window.location.protocol === 'file:';
        this.basePath = this.isGitHubPages ? '/iCat' : '';
    }

    // Προσδιορισμός base URL
    getBasePath() {
        return this.basePath;
    }

    // Έλεγχος ύπαρξης αρχείου σε file:// protocol
    checkAppExistenceFileProtocol(appName) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `app/${appName}/index.html`, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    resolve(xhr.status === 0 || xhr.status === 200);
                }
            };
            xhr.onerror = function() {
                resolve(false);
            };
            try {
                xhr.send();
            } catch (e) {
                resolve(false);
            }
        });
    }

    // Έλεγχος ύπαρξης app
    async checkAppExistence(appName) {
        try {
            let exists = false;

            if (this.isFileProtocol) {
                exists = await this.checkAppExistenceFileProtocol(appName);
            } else {
                const response = await fetch(`${this.basePath}/app/${appName}/index.html`);
                exists = response.ok;
            }

            return exists;
        } catch (e) {
            console.log(`App ${appName} not found:`, e);
            return false;
        }
    }

    // Ενημέρωση ύψους iframe
    updateAppFrameHeight(appFrame) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const mainElement = document.querySelector('main');
        const availableHeight = window.innerHeight - headerHeight;

        if (mainElement) {
            mainElement.style.height = availableHeight + 'px';
        }
        if (appFrame) {
            appFrame.style.height = '100%';
        }

        console.log('Updated iframe height:', availableHeight);
    }

    // Μετατροπή χρόνου
    formatTimeDiff(mins, translations) {
        if (mins < 1) return translations.now;
        if (mins < 60) return translations.minutesAgo.replace('{mins}', mins);
        const hours = Math.floor(mins / 60);
        if (hours < 24) return translations.hoursAgo.replace('{hours}', hours);
        const days = Math.floor(hours / 24);
        return translations.daysAgo.replace('{days}', days);
    }
}

// Αρχικοποίηση κοινών λειτουργιών
const ewCommon = new EWLauncherCommon();