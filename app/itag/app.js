// Ειδικός κώδικας για το Cat Tracker app


document.addEventListener('DOMContentLoaded', function() {
    
    // Μετάφραση κειμένων για το Cat Tracker
    const translations = {
        el: {
            title: "Cat Tracker",
            connect: "Σύνδεση",
            refresh: "Ανανέωση",
            export: "Export",
            import: "Import",
            statusConnected: "Συνδεδεμένοι μέσω eW Launcher",
            statusReading: "Ανάγνωση δεδομένων...",
            statusRefreshing: "Ανανέωση...",
            statusExportSuccess: "Τα δεδομένα εξήχθησαν επιτυχώς",
            statusImportSuccess: "Τα δεδομένα εισήχθησαν επιτυχώς",
            noCats: "Δεν υπάρχουν καταχωρημένες γάτες. Πατήστε Ανανέωση για να εμφανιστούν τα δεδομένα.",
            noData: "Δεν βρέθηκαν δεδομένα iTag. Πατήστε Ανανέωση για να φορτώσετε τα δεδομένα.",
            catsFound: "Βρέθηκαν {count} γάτες",
            editTitle: "Επεξεργασία γάτας",
            catName: "Όνομα γάτας",
            catId: "ID iTag (μη επεξεργάσιμο)",
            silentMode: "Λειτουργία σιγή",
            silentActive: "Ενεργό",
            silentInactive: "Σιγή",
            save: "Αποθήκευση",
            cancel: "Ακύρωση",
            atHome: "Στο σπίτι",
            walking: "Σε βόλτα",
            lastSeen: "Τελευταία είδην: ",
            now: "τώρα",
            minutesAgo: "{mins} λεπτά πριν",
            hoursAgo: "{hours} ώρες πριν",
            daysAgo: "{days} μέρες πριν",
            delete: "Διαγραφή",
            deleteConfirmTitle: "Διαγραφή γάτας",
            deleteConfirmText: "Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή την γάτα;",
            cancelDelete: "Ακύρωση",
            reorderMode: "Λειτουργία αναδιάταξης: Σύρτε τις γάτες για να αλλάξετε τη σειρά",
            reorderButton: "Αλλαγή σειράς",
            finishReorder: "Ολοκλήρωση αναδιάταξης",
            vizTitle : "Επισκόπηση Δραστηριότητας Γατών",
            showChart : "Εμφάνιση Γραφήματος",
            hideChart : "Απόκρυψη Γραφήματος",
            now : "τώρα"
        },
        en: {
            title: "Cat Tracker",
            connect: "Connect",
            refresh: "Refresh",
            export: "Export",
            import: "Import",
            statusConnected: "Connected via eW Launcher",
            statusReading: "Reading data...",
            statusRefreshing: "Refreshing...",
            statusExportSuccess: "Data exported successfully",
            statusImportSuccess: "Data imported successfully",
            noCats: "No registered cats. Press Refresh to load data.",
            noData: "No iTag data found. Press Refresh to load data.",
            catsFound: "Found {count} cats",
            editTitle: "Edit Cat",
            catName: "Cat name",
            catId: "iTag ID (non-editable)",
            silentMode: "Silent mode",
            silentActive: "Active",
            silentInactive: "Silent",
            save: "Save",
            cancel: "Cancel",
            atHome: "At home",
            walking: "Walking",
            lastSeen: "Last seen: ",
            now: "now",
            minutesAgo: "{mins} minutes ago",
            hoursAgo: "{hours} hours ago",
            daysAgo: "{days} days ago",
            delete: "Delete",
            deleteConfirmTitle: "Delete Cat",
            deleteConfirmText: "Are you sure you want to delete this cat?",
            cancelDelete: "Cancel",
            reorderMode: "Reorder mode: Drag cats to change order",
            reorderButton: "Change order",
            finishReorder: "Finish reordering",
            vizTitle : "Cat Activity Overview",
            showChart : "Show Chart",
            hideChart : "Hide Chart",
            now : "now"
        }
    };



    // Καθολικές μεταβλητές
    let currentLanguage = 'el';
    let catsData = [];
    let catsDataMap = {};
    let editingCatId = null;
    let deletingCatId = null;
    let dataBuffer = '';
    let dragSrcEl = null;
    let isReordering = false;
    let reorderedCats = [];
    let dataFormat = 'array';

    // Στοιχεία DOM
    const connectBtn = document.getElementById('connectBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const catList = document.getElementById('catList');
    const editModal = document.getElementById('editModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const catNameInput = document.getElementById('catName');
    const catIdInput = document.getElementById('catId');
    const catSilentInput = document.getElementById('catSilent');
    const saveCatBtn = document.getElementById('saveCatBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const reorderBtn = document.getElementById('reorderBtn');

    // Αρχικοποίηση
    init();

    function init() {
        askParentForLanguage();
        applyLanguage(currentLanguage);
        setupEventListeners();
        //refreshData();
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

        reorderBtn.addEventListener('click', toggleReorderMode);

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
        saveCatBtn.addEventListener('click', saveCatName);
        confirmDeleteBtn.addEventListener('click', deleteCat);
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);

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

    function handleParentMessage(event) {
        //console.log("  PARENT MESSAGE received:", event.data.type);

        if (event.data && event.data.type === 'LANGUAGE_CHANGE') {
            console.log("Changing language to:", event.data.language);
            if (event.data.language !== currentLanguage) {
                currentLanguage = event.data.language;
                applyLanguage(currentLanguage);
            }
        }
        else if (event.data && event.data.type === 'BLUETOOTH_RAW_DATA') {
            //console.log(" BLUETOOTH_RAW_DATA received, data length:", event.data.data.length);
            handleUartData(event.data.data);
            return;
        }
        else if (event.data && event.data.type === 'APP_LOADED') {  
            console.log(" APP_LOADED received, calling refreshData()");
        refreshData()
        }
    }

    function handleUartData(rawData) {
        //console.log("🔍 DEBUG handleUartData called with:", rawData.substring(0, 100) + "...");

        dataBuffer += rawData;
        //console.log(" DEBUG Full buffer content:", dataBuffer);

        // Προσπάθεια να βρούμε και να επεξεργαστούμε όλα τα πλήρη JSON objects στο buffer
        let jsonStart = dataBuffer.indexOf('{');

        while (jsonStart >= 0) {
            try {
                // Βρίσκουμε το τέλος του JSON object
                let depth = 0;
                let jsonEnd = -1;

                for (let i = jsonStart; i < dataBuffer.length; i++) {
                    if (dataBuffer[i] === '{') depth++;
                    else if (dataBuffer[i] === '}') depth--;

                    if (depth === 0) {
                        jsonEnd = i;
                        break;
                    }
                }

                if (jsonEnd > jsonStart) {
                    const jsonString = dataBuffer.substring(jsonStart, jsonEnd + 1);
                    //console.log("🔍 DEBUG Attempting to parse JSON:", jsonString.substring(0, 200) + "...");

                    const jsonData = JSON.parse(jsonString);
                    //console.log(" DEBUG JSON parse SUCCESS! Data type:", typeof jsonData);

                    // Επεξεργασία των δεδομένων
                    processRetrievedData(jsonData);

                    // Αφαίρεση του επεξεργασμένου JSON από το buffer
                    dataBuffer = dataBuffer.substring(jsonEnd + 1);
                    jsonStart = dataBuffer.indexOf('{');
                }
                else {
                    // Αν δεν βρέθηκε πλήρες JSON, περιμένουμε περισσότερα δεδομένα
                    break;
                }
            }
            catch (e) {
                console.log('❌ DEBUG JSON parse error:', e.message);
                // Προχωράμε στο επόμενο '{' αν υπάρχει
                const nextStart = dataBuffer.indexOf('{', jsonStart + 1);
                if (nextStart > jsonStart) {
                    jsonStart = nextStart;
                }
                else {
                    break;
                }
            }
        }

        // Κρατάμε μόνο τα τελευταία 10000 χαρακτήρες για να αποφύγουμε memory leaks
        if (dataBuffer.length > 10000) {
            dataBuffer = dataBuffer.substring(dataBuffer.length - 10000);
        }
    }

    function processRetrievedData(data) {
        console.log(" PROCESS_RETRIEVED_DATA called, data type:", typeof data);

        if (data && data.store) {
            console.log(" Data has 'store' property");

            if (Array.isArray(data.store)) {
                dataFormat = 'array';
                catsData = data.store;
            }
            else if (typeof data.store === 'object' && data.store !== null) {
                dataFormat = 'object';
                catsDataMap = data.store;

                if (data.storeOrder && Array.isArray(data.storeOrder)) {
                    catsData = data.storeOrder.map(id => data.store[id]).filter(cat => cat);
                }
                else {

                    catsData = Object.values(data.store);
                }
            }

            catsData.forEach(cat => {
                if (!cat.name || cat.name === "Unknown") {
                    cat.name = currentLanguage === 'el' ? "Αδέσποτη" : "Stray";
                }
            });

            renderCatList();
            const t = translations[currentLanguage];
            statusText.textContent = t.catsFound.replace('{count}', catsData.length);
        }
        else {
            console.log("❌ Data missing 'store' property, data:", data);

            const t = translations[currentLanguage];
            statusText.textContent = t.noData;
            console.error('Μη έγκυρα δεδομένα:', data);
        }
    }

    function renderCatList() {
        if (catsData.length === 0) {
            const t = translations[currentLanguage];
            catList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-cat"></i>
                    <p>${t.noCats}</p>
                </div>
            `;
            return;
        }

        catList.innerHTML = '';
        const displayCats = isReordering ? reorderedCats : catsData;

        displayCats.forEach(cat => {
            const now = (Date.now() / 1000 | 0);
            const diffMins = (now - cat.lastseen) / 60 | 0;

            let locationStatus = translations[currentLanguage].walking;
            let locationIcon = 'fa-walking';
            if (diffMins < 5) {
                locationStatus = translations[currentLanguage].atHome;
                locationIcon = 'fa-house';
            }

            const batteryIcon = cat.batt > 70 ? 'fa-battery-full' :
                cat.batt > 40 ? 'fa-battery-half' : 'fa-battery-quarter';

            const silentStatus = cat.silent ? translations[currentLanguage].silentInactive : translations[currentLanguage].silentActive;
            const silentIcon = cat.silent ? 'fa-volume-mute' : 'fa-volume-up';

            const t = translations[currentLanguage];
            const lastSeenText = ewCommon.formatTimeDiff(diffMins, t);

            const catCard = document.createElement('div');
            catCard.className = 'cat-card';
            catCard.setAttribute('data-cat-id', cat.id);
            catCard.draggable = isReordering;

            if (isReordering) {
                catCard.addEventListener('dragstart', handleDragStart);
                catCard.addEventListener('dragover', handleDragOver);
                catCard.addEventListener('dragenter', handleDragEnter);
                catCard.addEventListener('dragleave', handleDragLeave);
                catCard.addEventListener('dragend', handleDragEnd);
                catCard.addEventListener('drop', handleDrop);
            }

            catCard.innerHTML = `
                ${isReordering ? '<div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>' : ''}
                <div class="cat-icon">
                    <i class="fas fa-cat"></i>
                </div>
                <div class="cat-info">
                    <div class="cat-name">${cat.name}</div>
                    <div class="cat-details">
                        <div class="battery">
                            <i class="fas ${batteryIcon}"></i>
                            <span>${cat.batt}%</span>
                        </div>
                        <div class="location">
                            <i class="fas ${locationIcon}"></i>
                            <span>${locationStatus}</span>
                        </div>
                        <div class="silent">
                            <i class="fas ${silentIcon}"></i>
                            <span>${silentStatus}</span>
                        </div>
                    </div>
                    <div class="last-seen">
                        ${t.lastSeen}${lastSeenText}
                    </div>
                </div>
                <button class="edit-btn" data-id="${cat.id}">
                    <i class="fas fa-edit"></i>
                </button>
                ${!isReordering ? `
                <button class="delete-btn" data-id="${cat.id}">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            `;

            catList.appendChild(catCard);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const catId = this.getAttribute('data-id');
                openEditModal(catId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const catId = this.getAttribute('data-id');
                openDeleteModal(catId);
            });
        });
        
        // histogram
        if (document.getElementById('histogram')) {
                renderCatBars();
        }
    
        
    }

    // Drag & Drop handlers
    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.getAttribute('data-cat-id'));
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        document.querySelectorAll('.cat-card').forEach(card => {
            card.classList.remove('drag-over');
        });
    }

    function handleDrop(e) {
        e.preventDefault();

        if (dragSrcEl !== this) {
            const sourceId = dragSrcEl.getAttribute('data-cat-id');
            const targetId = this.getAttribute('data-cat-id');

            const sourceIndex = reorderedCats.findIndex(cat => cat.id === sourceId);
            const targetIndex = reorderedCats.findIndex(cat => cat.id === targetId);

            if (sourceIndex !== -1 && targetIndex !== -1) {
                const [movedCat] = reorderedCats.splice(sourceIndex, 1);
                reorderedCats.splice(targetIndex, 0, movedCat);
                renderCatList();
            }
        }

        return false;
    }

    // Κύριοι event handlers
    async function refreshData() {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusReading;
            // Απενεργοποίηση echo - ξεχωριστό command
            await sendCommand('\x10');
            await new Promise(resolve => setTimeout(resolve, 100)); // Περίμενε 100ms


            await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.itag.state.def))\n');
        }
        catch (error) {
            console.error('Σφάλμα ανανέωσης:', error);
            statusText.textContent = 'Σφάλμα ανανέωσης: ' + error.message;
        }
    }

    function exportData() {
        if (catsData.length === 0) {
            alert(translations[currentLanguage].noData);
            return;
        }

        const exportData = {
            cats: catsData,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `cat_tracker_export_${new Date().toISOString().slice(0, 10)}.json`;
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

                if (!importedData.cats || !Array.isArray(importedData.cats)) {
                    throw new Error('Μη έγκυρη μορφή αρχείου');
                }

                const t = translations[currentLanguage];
                if (!confirm(`Θέλετε να εισαγάγετε ${importedData.cats.length} γάτες; Θα προστεθούν μόνο οι νέες γάτες που δεν υπάρχουν ήδη.`)) {
                    return;
                }

                await refreshData();
                const mergedCats = mergeCatsData(catsData, importedData.cats);
                await updateEspruinoWithImportedData(mergedCats);
                statusText.textContent = `Προστέθηκαν ${mergedCats.length - catsData.length} νέες γάτες!`;

            }
            catch (error) {
                console.error('Σφάλμα εισαγωγής:', error);
                alert('Σφάλμα κατά την εισαγωγή: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    function mergeCatsData(existingCats, newCats) {
        const merged = [...existingCats];
        const existingIds = new Set(existingCats.map(cat => cat.id));

        newCats.forEach(newCat => {
            if (!existingIds.has(newCat.id)) {
                merged.push(newCat);
            }
        });

        return merged;
    }

    async function updateEspruinoWithImportedData(catsArray) {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = 'Ενημέρωση συσκευής με τα νέα δεδομένα...';

            if (dataFormat === 'array') {
                let command = 'ew.apps.itag.state.def.store = [';
                for (let i = 0; i < catsArray.length; i++) {
                    if (i > 0) command += ',';
                    command += JSON.stringify(catsArray[i]);
                }
                command += '];\n';

                const chunkSize = 100;
                for (let i = 0; i < command.length; i += chunkSize) {
                    const chunk = command.substring(i, i + chunkSize);
                    await sendCommand(chunk);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            else {
                let storeCommand = 'ew.apps.itag.state.def.store = {';
                let firstItem = true;
                for (const cat of catsArray) {
                    if (!firstItem) storeCommand += ',';
                    storeCommand += `"${cat.id}": ${JSON.stringify(cat)}`;
                    firstItem = false;
                }
                storeCommand += '};\n';

                let orderCommand = 'ew.apps.itag.state.def.storeOrder = [';
                for (let i = 0; i < catsArray.length; i++) {
                    if (i > 0) orderCommand += ',';
                    orderCommand += `"${catsArray[i].id}"`;
                }
                orderCommand += '];\n';

                await sendCommand(storeCommand);
                await new Promise(resolve => setTimeout(resolve, 100));
                await sendCommand(orderCommand);
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            await sendCommand('if (ew.apps.itag.state.def.store) { \n');
            if (dataFormat === 'array') {
                await sendCommand('\x10Bluetooth.println("Αποθηκεύτηκαν " + ew.apps.itag.state.def.store.length + " γάτες");\n');
            }
            else {
                await sendCommand('\x10Bluetooth.println("Αποθηκεύτηκαν " + Object.keys(ew.apps.itag.state.def.store).length + " γάτες");\n');
            }
            await sendCommand('} else {\n');
            await sendCommand('\x10Bluetooth.println("Σφάλμα: Το store είναι άδειο");\n');
            await sendCommand('}\n');

            await refreshData();
            statusText.textContent = 'Η συσκευή ενημερώθηκε με ' + catsArray.length + ' γάτες';
        }
        catch (error) {
            console.error('Σφάλμα ενημέρωσης συσκευής:', error);
            statusText.textContent = 'Σφάλμα ενημέρωσης συσκευής: ' + error.message;
        }
    }

    async function saveNewOrder() {
        try {
            const t = translations[currentLanguage];
            statusText.textContent = t.statusRefreshing;

            catsData = [...reorderedCats];

            if (dataFormat === 'array') {
                let command = 'ew.apps.itag.state.def.store = [';
                for (let i = 0; i < catsData.length; i++) {
                    if (i > 0) command += ',';
                    command += JSON.stringify(catsData[i]);
                }
                command += '];\n';

                const chunkSize = 100;
                for (let i = 0; i < command.length; i += chunkSize) {
                    const chunk = command.substring(i, i + chunkSize);
                    await sendCommand(chunk);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            else {
                let orderCommand = 'ew.apps.itag.state.def.storeOrder = [';
                for (let i = 0; i < catsData.length; i++) {
                    if (i > 0) orderCommand += ',';
                    orderCommand += `"${catsData[i].id}"`;
                }
                orderCommand += '];\n';

                await sendCommand(orderCommand);
            }

            statusText.textContent = 'Η νέα σειρά αποθηκεύτηκε επιτυχώς';
            isReordering = false;
            reorderedCats = [];
            updateReorderButton();

        }
        catch (error) {
            console.error('Σφάλμα αποθήκευσης σειράς:', error);
            statusText.textContent = 'Σφάλμα αποθήκευσης σειράς: ' + error.message;
        }
    }

    function toggleReorderMode() {
        if (isReordering) {
            saveNewOrder();
        }
        else {
            isReordering = true;
            reorderedCats = [...catsData];
            updateReorderButton();
        }

        renderCatList();

        const t = translations[currentLanguage];
        statusText.textContent = isReordering ?
            t.reorderMode :
            t.statusConnected;
    }

    function updateReorderButton() {
        const t = translations[currentLanguage];
        if (isReordering) {
            reorderBtn.innerHTML = `<i class="fas fa-times"></i> <span>${t.finishReorder}</span>`;
            reorderBtn.className = 'btn btn-danger';
        }
        else {
            reorderBtn.innerHTML = `<i class="fas fa-sort"></i> <span>${t.reorderButton}</span>`;
            reorderBtn.className = 'btn btn-secondary';
        }
    }

    function openEditModal(catId) {
        const cat = catsData.find(c => c.id === catId);
        if (!cat) return;

        editingCatId = catId;
        catIdInput.value = catId;
        catNameInput.value = cat.name;
        catSilentInput.value = cat.silent ? "1" : "0";

        editModal.style.display = 'flex';
    }

    function openDeleteModal(catId) {
        deletingCatId = catId;
        deleteConfirmModal.style.display = 'flex';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        editingCatId = null;
        catNameInput.value = '';
        catIdInput.value = '';
        catSilentInput.value = '0';
    }

    function closeDeleteModal() {
        deleteConfirmModal.style.display = 'none';
        deletingCatId = null;
    }

    async function saveCatName() {
        if (!editingCatId) return;

        const newName = catNameInput.value.trim();
        const newSilent = catSilentInput.value === "1";

        if (!newName) return;

        const catIndex = catsData.findIndex(c => c.id === editingCatId);
        if (catIndex !== -1) {
            catsData[catIndex].name = newName;
            catsData[catIndex].silent = newSilent;
        }

        try {
            if (dataFormat === 'array') {
                await sendCommand(`ew.apps.itag.state.def.store.find(cat => cat.id === "${editingCatId}").name = "${newName}";\n`);
                await sendCommand(`ew.apps.itag.state.def.store.find(cat => cat.id === "${editingCatId}").silent = ${newSilent};\n`);
            }
            else {
                await sendCommand(`ew.apps.itag.state.def.store["${editingCatId}"].name = "${newName}";\n`);
                await sendCommand(`ew.apps.itag.state.def.store["${editingCatId}"].silent = ${newSilent};\n`);
            }

            const t = translations[currentLanguage];
            statusText.textContent = t.save;
        }
        catch (error) {
            console.error('Σφάλμα αποστολής εντολών:', error);
            statusText.textContent = 'Σφάλμα αποστολής εντολών: ' + error.message;
        }

        renderCatList();
        closeEditModal();
    }

    async function deleteCat() {
        if (!deletingCatId) return;

        const catIndex = catsData.findIndex(c => c.id === deletingCatId);
        if (catIndex !== -1) {
            catsData.splice(catIndex, 1);
        }

        try {
            if (dataFormat === 'array') {
                await sendCommand(`ew.apps.itag.state.def.store = ew.apps.itag.state.def.store.filter(cat => cat.id !== "${deletingCatId}");\n`);
            }
            else {
                await sendCommand(`delete ew.apps.itag.state.def.store["${deletingCatId}"];\n`);
                await sendCommand(`ew.apps.itag.state.def.storeOrder = ew.apps.itag.state.def.storeOrder.filter(id => id !== "${deletingCatId}");\n`);
            }

            const t = translations[currentLanguage];
            statusText.textContent = t.delete;
        }
        catch (error) {
            console.error('Σφάλμα διαγραφής:', error);
            statusText.textContent = 'Σφάλμα διαγραφής: ' + error.message;
        }

        renderCatList();
        closeDeleteModal();
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
        setTextIfExists('reorderText', t.reorderButton);
        setTextIfExists('noCatsText', t.noCats);
        setTextIfExists('editTitleText', t.editTitle);
        setTextIfExists('catNameLabel', t.catName);
        setTextIfExists('catIdLabel', t.catId);
        setTextIfExists('silentModeLabel', t.silentMode);
        setTextIfExists('silentActiveOption', t.silentActive);
        setTextIfExists('silentInactiveOption', t.silentInactive);
        setTextIfExists('saveText', t.save);
        setTextIfExists('cancelText', t.cancel);
        setTextIfExists('deleteConfirmTitle', t.deleteConfirmTitle);
        setTextIfExists('deleteConfirmText', t.deleteConfirmText);
        setTextIfExists('deleteText', t.delete);
        setTextIfExists('cancelDeleteText', t.cancelDelete);
        setTextIfExists('vizTitleText', t.vizTitle);

       // Ενημέρωση του κουμπιού toggle
        const toggleBtn = document.getElementById('toggleVizBtn');
        if (toggleBtn) {
            const vizElement = document.getElementById('histogramViz');
            const isVisible = vizElement.style.display !== 'none';
            toggleBtn.innerHTML = isVisible ? 
                `<i class="fas fa-eye-slash"></i> <span>${t.hideChart}</span>` :
                `<i class="fas fa-eye"></i> <span>${t.showChart}</span>`;
        }

        if (statusDot && statusDot.classList.contains('connected')) {
            statusText.textContent = t.statusConnected;
        }

        updateReorderButton();

        if (catsData.length > 0) {
            renderCatList();
            statusText.textContent = t.catsFound.replace('{count}', catsData.length);
        }

        console.log("Language applied successfully!");
    }
    
    // Visualization functionality - Κάθετες μπάρες
    function initializeVisualization() {
        setupVisualizationEvents();
    }
    
    function setupVisualizationEvents() {
        document.getElementById('toggleVizBtn').addEventListener('click', function() {
            const vizElement = document.getElementById('histogramViz');
            const isVisible = vizElement.style.display !== 'none';
            vizElement.style.display = isVisible ? 'none' : 'block';
            
            const t = translations[currentLanguage];
            this.innerHTML = isVisible ? 
                `<i class="fas fa-eye"></i> <span>${t.showChart}</span>` :
                `<i class="fas fa-eye-slash"></i> <span>${t.hideChart}</span>`;
        });
    }
    
    function renderCatBars() {
        if (!catsData.length) return;
        
        const histogram = document.getElementById('histogram');
        const xAxis = document.getElementById('xAxis');
        
        histogram.innerHTML = '';
        xAxis.innerHTML = '';
        
        // Ταξινόμηση γατών από πιο πρόσφατη στην πιο παλιά
        const sortedCats = [...catsData].sort((a, b) => b.lastseen - a.lastseen);
        
        const now = Math.floor(Date.now() / 1000);
        
        // Δημιουργία κάθετης μπάρας για κάθε γάτα
        sortedCats.forEach((cat, index) => {
            const daysSinceSeen = Math.floor((now - cat.lastseen) / (24 * 60 * 60));
            
            const bar = document.createElement('div');
            bar.className = 'cat-bar-vertical';
            
            // Χρώμα βάσει ημερών
            if (daysSinceSeen === 0) {
                bar.classList.add('recent-cat');
            } else if (daysSinceSeen <= 7) {
                bar.classList.add('medium-cat');
            } else {
                bar.classList.add('old-cat');
            }
            
            bar.setAttribute('data-cat-id', cat.id);
            bar.setAttribute('data-cat-name', cat.name);
            bar.setAttribute('data-days', daysSinceSeen);
            
            // Ετικέτα με όνομα γάτας
            const label = document.createElement('div');
            label.className = 'bar-label-vertical';
            label.textContent = cat.name;
            bar.appendChild(label);
            
            // Τιμή (ημέρες)
            const value = document.createElement('div');
            value.className = 'bar-value-vertical';
            value.textContent = daysSinceSeen === 0 ? 'Σήμ' : 
                               daysSinceSeen === 1 ? '1ημ' : 
                               `${daysSinceSeen}ημ`;
            bar.appendChild(value);
            
            // Events
            bar.addEventListener('mouseenter', highlightCat)
            //bar.addEventListener('mouseenter', showCatTooltip);
            //bar.addEventListener('mouseleave', hideCatTooltip);
            bar.addEventListener('click', highlightCat);
            
            histogram.appendChild(bar);
        });
        
        // X-axis labels
        const xLabels = [
            `Πρόσφατες`,
            ``,
            ``,
            `Παλιές`
        ];
        
        xLabels.forEach(label => {
            const xLabel = document.createElement('div');
            xLabel.textContent = label;
            xAxis.appendChild(xLabel);
        });
    }

    function highlightCat(event) {
        const bar = event.currentTarget;
        const catId = bar.getAttribute('data-cat-id');
        const catName = bar.getAttribute('data-cat-name');
        const days = bar.getAttribute('data-days');
        
        // Δημιουργία popup με το όνομα της γάτας
        showCatPopup(catName, days);
    }
    
    function showCatPopup(catName, lastseen) {
        // Αφαίρεση υπάρχοντος popup αν υπάρχει
        const existingPopup = document.querySelector('.cat-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
    
        // Υπολογισμός ακριβούς χρόνου (όπως στην κάρτα)
        const now = Math.floor(Date.now() / 1000);
        const diffMins = Math.floor((now - lastseen) / 60);
        const t = translations[currentLanguage];
        const timeText = ewCommon.formatTimeDiff(diffMins, t);
    
        // Δημιουργία νέου popup
        const popup = document.createElement('div');
        popup.className = 'cat-popup';
    
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-name">${catName}</div>
                <div class="popup-time">${t.lastSeen}${timeText}</div>
            </div>
        `;
    
        document.body.appendChild(popup);
    
        // Κεντράρισμα popup στην οθόνη
        setTimeout(() => {
            popup.style.left = '50%';
            popup.style.top = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.opacity = '1';
        }, 10);
    
        // Αυτόματη αφαίρεση μετά από 2 δευτερόλεπτα
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }, 2000);
    }

    function highlightCat(event) {
        const bar = event.currentTarget;
        const catId = bar.getAttribute('data-cat-id');
        const catName = bar.getAttribute('data-cat-name');
    
        // Βρες την πλήρη πληροφορία της γάτας για το lastseen
        const cat = catsData.find(c => c.id === catId);
        if (cat) {
            showCatPopup(catName, cat.lastseen);
        }
    }
    initializeVisualization();
});
