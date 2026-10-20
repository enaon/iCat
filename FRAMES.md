# Οδηγός: Πώς φτιάχνουμε frames για τα apps

Αυτό το αρχείο εξηγεί την αρχιτεκτονική του launcher, πώς επικοινωνεί ένα app frame με τη συσκευή, και πώς φτιάχνουμε ένα νέο frame γρήγορα και σωστά.

## 1. Αρχιτεκτονική

- **`control.html` + `control.js` + `common.js`** (root) = ο **launcher**. Συνδέεται με Web Bluetooth (UART), σκανάρει τα apps και φορτώνει το καθένα σε ένα `<iframe id="appFrame">`.
- **`common.js`** ορίζει το `ewCommon` (base path, έλεγχος ύπαρξης app) και τα κοινά translations του launcher.
- Κάθε app είναι ένας φάκελος **`app/<name>/`** και χρειάζεται τουλάχιστον:
  - `app.html` — η εμφάνιση (το «frame»).
  - `app.js` — η λογική του UI.
  - (προαιρετικά) ένα device-side script που ορίζει `ew.apps.<name>` πάνω στη συσκευή (π.χ. `ewtag.js`, `lamp.js`).

Το frame τρέχει **μέσα στο iframe** και δεν έχει απευθείας πρόσβαση στο Bluetooth· μιλάει με τον launcher (γονέα) με `postMessage`, και ο launcher κάνει τα read/write στο UART.

## 2. Πρωτόκολλο postMessage

| Κατεύθυνση | `type` | Πεδίο | Τι κάνει |
|---|---|---|---|
| frame → launcher | `BLUETOOTH_COMMAND` | `command` | Στέλνει εντολή JS για εκτέλεση στη συσκευή. |
| frame → launcher | `REQUEST_LANGUAGE` | — | Ζητάει την τρέχουσα γλώσσα. |
| launcher → frame | `BLUETOOTH_RAW_DATA` | `data` | Raw UART δεδομένα από τη συσκευή. |
| launcher → frame | `APP_LOADED` | `appName` | Το frame φορτώθηκε → κάνε refresh. |
| launcher → frame | `LANGUAGE_CHANGE` | `language` | Άλλαξε η γλώσσα. |

## 3. Ρυθμίσεις (state.def) στη συσκευή

Κάθε app κρατάει τις ρυθμίσεις του στο **`ew.apps.<name>.state.def`** και αυτές αποθηκεύονται στο `ew.json` (κλειδί = όνομα app) όταν τρέξει το `ew.sys.updt()`.

```js
// ΑΝΑΓΝΩΣΗ — ζήτα το def και πάρτο πίσω σαν JSON στο BLUETOOTH_RAW_DATA
Bluetooth.println(JSON.stringify(ew.apps.<name>.state.def))

// ΓΡΑΨΙΜΟ — θέσε το def και αποθήκευσε
ew.apps.<name>.state.def = {...};
ew.sys.updt();
```

Το `ew.sys.updt()` (στο `app/handler/handler_set.js`) μαζεύει το `state.def` **κάθε** app και γράφει όλο το `ew.json`.

## 4. Skeleton — app.html

Αντέγραψε το `app/lamp/app.html` ή το `app/ewtag/app.html` και κράτα:

```html
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../common.css">
    <style> /* .checkbox toggle, .settings-group, .setting-item, inputs ... */ </style>
</head>
<body>
    <div class="container">
        <header><h1><i class="fas fa-tag"></i> <span id="statusText">App</span></h1></header>
        <div class="settings-group">
            <div class="setting-item">
                <span class="setting-label"><i class="fas fa-power-off"></i> <span id="toggleLabel">Label</span></span>
                <div id="toggle" class="checkbox"></div>
            </div>
        </div>
        <div class="actions-bar">
            <button class="btn btn-outline" id="refreshBtn"><i class="fas fa-sync-alt"></i> <span id="refreshText">Refresh</span></button>
            <button class="btn btn-outline" id="saveBtn"><i class="fas fa-save"></i> <span id="saveText">Save</span></button>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

Σημαντικά σημεία: το CSS path είναι `../../common.css` (το frame είναι 2 επίπεδα κάτω από το root). Το toggle είναι ένα `<div class="checkbox">` — η κλάση `active` σημαίνει ON.

## 5. Skeleton — app.js

Τα απαραίτητα κομμάτια (δείτε το πλήρες `app/ewtag/app.js`):

```js
document.addEventListener('DOMContentLoaded', function() {
    const translations = { el: {...}, en: {...} };
    let currentLanguage = 'el';
    let settings = null;      // το state.def που ήρθε από τη συσκευή
    let dataBuffer = '';      // buffer για τα raw UART data

    init();

    function init() {
        askParentForLanguage();   // ζήτα τη γλώσσα από τον launcher
        applyLanguage(currentLanguage);
        setupEventListeners();
    }

    function handleParentMessage(event) {
        if (event.data.type === 'LANGUAGE_CHANGE') applyLanguage(event.data.language);
        else if (event.data.type === 'BLUETOOTH_RAW_DATA') handleUartData(event.data.data);
        else if (event.data.type === 'APP_LOADED') refreshData();
    }

    async function refreshData() {
        await sendCommand('\x10');                     // καθαρισμός REPL (Ctrl-P)
        await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.<name>.state.def))\n');
    }

    async function saveSettings() {
        await sendCommand('\x10');
        await sendCommand('ew.apps.<name>.state.def = ' + JSON.stringify(settings) + ';\n');
        await sendCommand('ew.sys.updt();\n');
    }

    async function sendCommand(command) {
        const chunkSize = 100;
        for (let i = 0; i < command.length; i += chunkSize) {
            const chunk = command.substring(i, i + chunkSize);
            window.parent.postMessage({ type: 'BLUETOOTH_COMMAND', command: chunk }, '*');
            await new Promise(r => setTimeout(r, 50));
        }
    }

    function askParentForLanguage() {
        window.parent.postMessage({ type: 'REQUEST_LANGUAGE' }, '*');
    }
});
```

### Πώς «διαβάζεις» το JSON που γυρίζει η συσκευή

Τα raw data έρχονται κομματιασμένα στο `handleUartData`. Μάζεψέ τα στο `dataBuffer`, βρες το πρώτο ισορροπημένο `{...}` (μέτρημα `{` / `}`), κάνε `JSON.parse` και έλεγξε αν είναι το δικό σου def πριν γεμίσεις τη φόρμα:

```js
function handleUartData(rawData) {
    dataBuffer += rawData;
    let s = dataBuffer.indexOf('{');
    while (s >= 0) {
        // ... βρες το ταίριασμα του '}' ...
        const obj = JSON.parse(dataBuffer.substring(s, end + 1));
        if (obj.iTag !== undefined || obj.someKey !== undefined) { // δικό σου def
            settings = obj;
            populateForm(obj);
        }
        dataBuffer = dataBuffer.substring(end + 1);
        s = dataBuffer.indexOf('{');
    }
}
```

## 6. Βήματα για νέο frame

1. Φτιάξε `app/<name>/` και βάλε `app.html` + `app.js` (αντέγραψε από ένα υπάρχον app).
2. Στο `app.js` άλλαξε το `<name>` σε όλα τα `ew.apps.<name>.state.def...`.
3. Βάλε τα controls σου (toggles/inputs) στο `app.html` και τα αντίστοιχα `populateForm` / `collectFormData` στο `app.js`.
4. Βεβαιώσου ότι η συσκευή έχει ορίσει το `ew.apps.<name>` (το launcher σκανάρει τα `Object.keys(ew.apps)` και φορτώνει μόνο όσα έχουν `app.html`).
5. Δοκίμασε: φόρτωσε, πάτα Refresh (να γεμίσει η φόρμα), άλλαξε κάτι, Save.

## 7. Συμβάσεις / tips

- **Toggle** = `div.checkbox` + κλάση `active`. Κάνε immediate send στο click, και το Save κάνει το persist.
- **Πριν από κάθε εντολή** στείλε `\x10` (καθαρίζει το REPL της συσκευής).
- **`sendCommand`** κάνει chunk στα 100 chars (περιορισμός UART) — κράτα το ίδιο.
- **Translations** σε `el`/`en` (το launcher στέλνει `LANGUAGE_CHANGE`).
- **Save** = `state.def = {...};` + (αν χρειάζεται re-init π.χ. `ew.apps.ewtag.init();`) + `ew.sys.updt();`.
- Αν το def σου έχει **πεδία-κλειδιά** (π.χ. `iKey`/`gKey`), χρησιμοποίησε `input[type="text"]` και στείλε με `JSON.stringify(val)` για σωστό quoting.

## Παράδειγμα υλοποίησης

Δες το `app/ewtag/app.html` + `app/ewtag/app.js` (απλό frame με 3 toggles + 2 key fields) και το `app/lamp/app.html` + `app/lamp/app.js` (πιο πλήρες, με tabs).
