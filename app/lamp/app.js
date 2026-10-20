// app.js - Light Control App (με Export/Import & Powerbank USB)
document.addEventListener('DOMContentLoaded', function() {
            // Translations
            const translations = {
                el: {
                    title: "Λάμπα",
                    refresh: "Ανανέωση",
                    save: "Αποθήκευση",
                    exportSettings: "",
                    importSettings: "",
                    statusConnected: "Λάμπα",
                    statusReading: "Ανάγνωση δεδομένων...",
                    statusSaving: "Αποθήκευση...",
                    saveSuccess: "Οι ρυθμίσεις αποθηκεύτηκαν",
                    saveError: "Σφάλμα αποθήκευσης",
                    confirmSave: "Θέλετε να αποθηκεύσετε τις αλλαγές;",
                    actionsTab: "Δράσεις",
                    settingsTab: "Ρυθμίσεις",
                    powerTitle: "Φώς",
                    toggleText: "Toggle",
                    brightnessTitle: "Φωτεινότητα",
                    pirTitle: "PIR / Αυτόματο",
                    pirToggleText: "Toggle PIR",
                    stateOn: "ON",
                    stateOff: "OFF",
                    modeTitle: "Λειτουργία Φωτός",
                    modeLabel: "Mode",
                    briTitle: "Φωτεινότητα",
                    briMaxLabel: "Μέγιστο (max)",
                    briMinLabel: "Ελάχιστο (min)",
                    briMinHint: "0.001 - 0.1",
                    briLastLabel: "Τελευταία (last)",
                    briLastHint: "0 - 1",
                    briWarmRatioLabel: "Αναλογία στο both",
                    briWarmRatioHint: "0 = μόνο cold, 1 = μόνο warm",
                    briKeepLabel: "Ισορροπία στο both",
                    briKeepHint: "Ενεργό: warm+cold=1 – Ανενεργό: μέγιστη φωτεινότητα",
                    ldrSettingsTitle: "Φωτοαντίσταση (LDR)",
                    ldrSetText: "Θέσε τρέχουσα τιμή",
                    ldrReadText: "Ανάγνωση LDR",
                    ldrLvlLabel: "Επίπεδο LDR",
                    ldrLvlHint: "0 - 1",
                    pirSettingsTitle: "Αισθητήρας PIR",
                    pirEnLabel: "Ενεργοποίηση PIR",
                    pirMaxLabel: "Μέγιστος αριθμός (max)",
                    pirMaxHint: "1 - 100",
                    pirTimeLabel: "Χρόνος PIR (time)",
                    pirTimeHint: "δευτερόλεπτα",
                    pirTypeLabel: "Τύπος",
                    pirSensLabel: "Κατώφλι ευαισθησίας",
                    pirLoopLabel: "Ταχύτητα ανάγνωσης",
                    pirSndLabel: "Ήχος",
                    optionsTitle: "Επιλογές",
                    oneBLabel: "Μόνο ενα κουμπι",
                    tmrLabel: "Χρονοδιακοπτης στο ΟΝ (αυτόματο OFF)",
                    isPBLabel: "Ενεργοποίηση powerbank",
                    solarLabel: "Ενεργοποίηση Solar mode",
                    powerbankCardTitle: "powerbank",
                    usbToggleText: "USB",
                    usbStateOn: "ON",
                    usbStateOff: "OFF"
                },
                en: {
                    title: "Lamp",
                    refresh: "Refresh",
                    save: "Save",
                    exportSettings: "",
                    importSettings: "",
                    statusConnected: "Lamp",
                    statusReading: "Reading data...",
                    statusSaving: "Saving...",
                    saveSuccess: "Settings saved",
                    saveError: "Save error",
                    confirmSave: "Save changes?",
                    actionsTab: "Actions",
                    settingsTab: "Settings",
                    powerTitle: "Control",
                    toggleText: "Toggle",
                    brightnessTitle: "Brightness",
                    pirTitle: "PIR / Auto",
                    pirToggleText: "Toggle PIR",
                    stateOn: "ON",
                    stateOff: "OFF",
                    modeTitle: "Light Mode",
                    modeLabel: "Mode",
                    briTitle: "Brightness",
                    briMaxLabel: "Maximum (max)",
                    briMinLabel: "Minimum (min)",
                    briMinHint: "0.001 - 0.1",
                    briLastLabel: "Last (last)",
                    briLastHint: "0 - 1",
                    briWarmRatioLabel: "Both Ratio",
                    briWarmRatioHint: "0 = cold only, 1 = warm only",
                    briKeepLabel: "Balance on both",
                    briKeepHint: "On: warm+cold=1 – Off: maximum brightness",
                    ldrSettingsTitle: "Photoresistor (LDR)",
                    ldrSetText: "Set Current Value",
                    ldrReadText: "Read LDR",
                    ldrLvlLabel: "LDR Level",
                    ldrLvlHint: "0 - 1",
                    pirSettingsTitle: "PIR Sensor",
                    pirEnLabel: "Enable PIR",
                    pirMaxLabel: "Max Count (max)",
                    pirMaxHint: "1 - 100",
                    pirTimeLabel: "PIR Time (time)",
                    pirTimeHint: "seconds",
                    pirTypeLabel: "Type",
                    pirSensLabel: "Sensitivity Threshold",
                    pirLoopLabel: "Polling Speed",
                    pirSndLabel: "Sound",
                    optionsTitle: "Options",
                    oneBLabel: "One Button only",
                    tmrLabel: "Enable ON Timer (auto OFF)",
                    isPBLabel: "Enable Powerbank",
                    solarLabel: "Enable Solar mode",
                    powerbankCardTitle: "powerbank",
                    usbToggleText: "USB",
                    usbStateOn: "ON",
                    usbStateOff: "OFF"
                }
            };

            // State
            let currentLanguage = 'el';
            let lightSettings = null;
            let dataBuffer = '';

            // DOM Elements
            const refreshBtn = document.getElementById('refreshBtn');
            const saveBtn = document.getElementById('saveBtn');
            const importFile = document.getElementById('importSettingsFile');
            const statusText = document.getElementById('statusText');
            const brightnessSlider = document.getElementById('brightnessSlider');
            const brightnessValue = document.getElementById('brightnessValue');
            const ldrCurrentValue = document.getElementById('ldrCurrentValue');

            // Light icon & toggle
            const lightIcon = document.getElementById('lightIcon');
            const lightToggleBtn = document.getElementById('lightToggleBtn');

            // PIR icon & toggle
            const pirIcon = document.getElementById('pirIcon');
            const pirToggleBtn = document.getElementById('pirToggleBtn');

            // Powerbank
            const isPBToggle = document.getElementById('isPBToggle');
            const powerbankCard = document.getElementById('powerbankCard');
            const usbIcon = document.getElementById('usbIcon');
            const usbToggleBtn = document.getElementById('usbToggleBtn');

            // PIR elements
            const pirTypeSelect = document.getElementById('pirType');
            const pirSensSlider = document.getElementById('pirSens');
            const pirSensValue = document.getElementById('pirSensValue');
            const pirLoopSlider = document.getElementById('pirLoop');
            const pirLoopValue = document.getElementById('pirLoopValue');
            const pirSndToggle = document.getElementById('pirSnd');

            // DOCI-only items
            const pirSensItem = document.getElementById('pirSensItem');
            const pirLoopItem = document.getElementById('pirLoopItem');
            const pirSndItem = document.getElementById('pirSndItem');

            // Options
            const oneBToggle = document.getElementById('oneBToggle');
            const tmrToggle = document.getElementById('tmrToggle');

            // Sliders that need auto-send on release
            const briLastSlider = document.getElementById('briLast');
            const briWarmRatioSlider = document.getElementById('briWarmRatio');
            const ldrLvlSlider = document.getElementById('ldrLvl');

            // Initialize
            init();

            function init() {
                askParentForLanguage();
                applyLanguage(currentLanguage);
                setupEventListeners();
                setupConnectionStatus();
            }

            function setupEventListeners() {
                // Tabs
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const tab = btn.getAttribute('data-tab');
                        switchTab(tab);
                    });
                });

                // Main buttons
                refreshBtn.addEventListener('click', refreshData);
                saveBtn.addEventListener('click', saveSettings);
                importFile.addEventListener('change', handleImportSettings);

                // Actions
                lightToggleBtn.addEventListener('click', lightToggle);
                lightIcon.addEventListener('click', lightToggle);
                brightnessSlider.addEventListener('change', fadeTo);
                pirToggleBtn.addEventListener('click', pirToggle);
                pirIcon.addEventListener('click', pirToggle);
                document.getElementById('ldrSetBtn').addEventListener('click', ldrSet);
                document.getElementById('ldrReadBtn').addEventListener('click', ldrRead);
                usbToggleBtn.addEventListener('click', toggleUSB);
                usbIcon.addEventListener('click', toggleUSB);

                // Settings checkboxes (immediate send)
                document.getElementById('briKeep').addEventListener('click', function() { this.classList.toggle('active'); });
                document.getElementById('ldrEn').addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings && lightSettings.ldr) lightSettings.ldr.en = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.ldr.en = ${newVal};\n`);
                });
                document.getElementById('pirEn').addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings && lightSettings.pir) lightSettings.pir.en = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.en = ${newVal};\n`);
                });

                // PIR snd checkbox (immediate)
                pirSndToggle.addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings && lightSettings.pir) lightSettings.pir.snd = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.snd = ${newVal};\n`);
                });

                // oneB checkbox (immediate)
                oneBToggle.addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings) lightSettings.oneB = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.oneB = ${newVal};\n`);
                });

                // tmr checkbox (immediate)
                tmrToggle.addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings) lightSettings.tmr = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.tmr = ${newVal};\n`);
                });

                // isPB toggle
                isPBToggle.addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings) lightSettings.isPB = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.isPB = ${newVal};\n`);
                    updatePowerbankCardVisibility(newVal);
                });

                // slr toggle
                solarToggle.addEventListener('click', async function() {
                    this.classList.toggle('active');
                    const newVal = this.classList.contains('active') ? 1 : 0;
                    if (lightSettings) lightSettings.slr = newVal;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.slr = ${newVal};\n`);
                    updatePowerbankCardVisibility(newVal);
                });                

                // PIR Type change → show/hide DOCI fields
                pirTypeSelect.addEventListener('change', () => {
                    toggleDociFields(pirTypeSelect.value === 'DOCI');
                });

                // Slider display updates (input event)
                briLastSlider.addEventListener('input', (e) => {
                    document.getElementById('briLastValue').textContent = (e.target.value / 100).toFixed(2);
                });
                briWarmRatioSlider.addEventListener('input', (e) => {
                    document.getElementById('briWarmRatioValue').textContent = (e.target.value / 100).toFixed(2);
                });
                ldrLvlSlider.addEventListener('input', (e) => {
                    document.getElementById('ldrLvlValue').textContent = (e.target.value / 100).toFixed(2);
                });
                brightnessSlider.addEventListener('input', (e) => {
                    brightnessValue.textContent = e.target.value + '%';
                });
                // Sens slider (500-5000 ms)
                pirSensSlider.addEventListener('input', (e) => {
                    pirSensValue.textContent = e.target.value ;
                });
                // Loop slider (32-996 ms)
                pirLoopSlider.addEventListener('input', (e) => {
                    pirLoopValue.textContent = e.target.value + ' ms';
                });

                // === AUTO-SEND SLIDERS ON RELEASE (change event) ===
                briLastSlider.addEventListener('change', async(e) => {
                    const val = parseInt(e.target.value) / 100;
                    if (lightSettings && lightSettings.bri) lightSettings.bri.last = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.bri.last = ${val};\n`);
                });

                briWarmRatioSlider.addEventListener('change', async(e) => {
                    const sliderProp = parseInt(e.target.value) / 100;
                    const keep = document.getElementById('briKeep').classList.contains('active') ? 1 : 0;
                    let warm, cold;
                    if (keep === 1) {
                        warm = sliderProp;
                        cold = 1 - warm;
                    }
                    else {
                        warm = sliderProp;
                        cold = 1 - sliderProp;
                        const max = Math.max(warm, cold);
                        if (max > 0) { warm /= max;
                            cold /= max; }
                    }
                    if (lightSettings && lightSettings.bri) {
                        if (!lightSettings.bri.ratio) lightSettings.bri.ratio = {};
                        lightSettings.bri.ratio.warm = warm;
                        lightSettings.bri.ratio.cold = cold;
                        lightSettings.bri.ratio.keep = keep;
                    }
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.bri.ratio = ${JSON.stringify({warm, cold, keep})};\n`);
                });

                ldrLvlSlider.addEventListener('change', async(e) => {
                    const val = parseInt(e.target.value) / 100;
                    if (lightSettings && lightSettings.ldr) lightSettings.ldr.lvl = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.ldr.lvl = ${val};\n`);
                });

                pirSensSlider.addEventListener('change', async(e) => {
                    const val = parseInt(e.target.value);
                    if (lightSettings && lightSettings.pir) lightSettings.pir.sens = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.sens = ${val};\n`);
                });

                pirLoopSlider.addEventListener('change', async(e) => {
                    const val = parseInt(e.target.value);
                    if (lightSettings && lightSettings.pir) lightSettings.pir.loop = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.loop = ${val};\n`);
                });

                // Number inputs auto-send on change
                document.getElementById('briMax').addEventListener('change', async(e) => {
                    const val = parseFloat(e.target.value);
                    if (lightSettings && lightSettings.bri) lightSettings.bri.max = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.bri.max = ${val};\n`);
                });

                document.getElementById('briMin').addEventListener('change', async(e) => {
                    const val = parseFloat(e.target.value);
                    if (lightSettings && lightSettings.bri) lightSettings.bri.min = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.bri.min = ${val};\n`);
                });

                document.getElementById('pirMax').addEventListener('change', async(e) => {
                    const val = parseInt(e.target.value);
                    if (lightSettings && lightSettings.pir) lightSettings.pir.max = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.max = ${val};\n`);
                });

                document.getElementById('pirTime').addEventListener('change', async(e) => {
                    const val = parseInt(e.target.value);
                    if (lightSettings && lightSettings.pir) lightSettings.pir.time = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.time = ${val};\n`);
                });

                // Mode select auto-send
                document.getElementById('modeSelect').addEventListener('change', async(e) => {
                    const val = e.target.value;
                    if (lightSettings) lightSettings.mode = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.mode = "${val}";\n`);
                });

                // PIR Type select auto-send
                pirTypeSelect.addEventListener('change', async(e) => {
                    const val = e.target.value;
                    if (lightSettings && lightSettings.pir) lightSettings.pir.type = val;
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand(`ew.apps.lamp.state.def.pir.type = "${val}";\n`);
                });

                window.addEventListener('message', handleParentMessage);
            }

            function toggleDociFields(show) {
                const method = show ? 'add' : 'remove';
                pirSensItem.classList[method]('visible');
                pirLoopItem.classList[method]('visible');
                //pirSndItem.classList[method]('visible');
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
                        let depth = 0,
                            jsonEnd = -1;
                        for (let i = jsonStart; i < dataBuffer.length; i++) {
                            if (dataBuffer[i] === '{') depth++;
                            else if (dataBuffer[i] === '}') depth--;
                            if (depth === 0) { jsonEnd = i; break; }
                        }
                        if (jsonEnd > jsonStart) {
                            const jsonString = dataBuffer.substring(jsonStart, jsonEnd + 1);
                            const jsonData = JSON.parse(jsonString);
                            if (jsonData.def || jsonData.bri || jsonData.mode) {
                                lightSettings = jsonData.def || jsonData;
                                populateForm(lightSettings);
                                updateActionStates(lightSettings);
                                if (lightSettings && lightSettings.isPB !== undefined) {
                                    updatePowerbankCardVisibility(lightSettings.isPB);
                                }
                                statusText.textContent = translations[currentLanguage].statusConnected;
                            }
                            else if (jsonData.l !== undefined) {
                                ldrCurrentValue.textContent = jsonData.l.toFixed(4);
                                statusText.textContent = translations[currentLanguage].statusConnected;
                            }
                            else if (jsonData.o !== undefined || jsonData.isOn !== undefined || jsonData.usb !== undefined) {
                                updateActionStates({ isOn: jsonData.o !== undefined ? jsonData.o : jsonData.isOn, pir: { en: jsonData.p } });
                                if (jsonData.usb !== undefined) {
                                    updateUsbState(jsonData.usb);
                                }
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

            function populateForm(settings) {
                if (!settings) return;
                document.getElementById('modeSelect').value = settings.mode || 'both';
                if (settings.bri) {
                    document.getElementById('briMax').value = settings.bri.max !== undefined ? settings.bri.max : 1;
                    document.getElementById('briMin').value = settings.bri.min || 0.006;
                    document.getElementById('briLast').value = (settings.bri.last || 0.5) * 100;
                    document.getElementById('briLastValue').textContent = (settings.bri.last || 0.5).toFixed(2);
                    if (settings.bri.lvl !== undefined) {
                        const lvlPercent = Math.round(settings.bri.lvl * 100);
                        brightnessSlider.value = lvlPercent;
                        brightnessValue.textContent = lvlPercent + '%';
                    }
                    if (settings.bri.ratio) {
                        const ratio = settings.bri.ratio;
                        const keep = ratio.keep !== undefined ? ratio.keep : 0;
                        let sliderValue = keep === 1 ? (ratio.warm || 0.5) * 100 : (ratio.warm / (ratio.warm + ratio.cold) || 0.5) * 100;
                        document.getElementById('briWarmRatio').value = sliderValue;
                        document.getElementById('briWarmRatioValue').textContent = (sliderValue / 100).toFixed(2);
                        document.getElementById('briKeep').className = keep ? 'checkbox active' : 'checkbox';
                    }
                }
                else {
                    document.getElementById('briWarmRatio').value = 50;
                    document.getElementById('briWarmRatioValue').textContent = '0.50';
                    document.getElementById('briKeep').className = 'checkbox active';
                }
                if (settings.ldr) {
                    document.getElementById('ldrEn').className = settings.ldr.en ? 'checkbox active' : 'checkbox';
                    document.getElementById('ldrLvl').value = (settings.ldr.lvl || 0.5) * 100;
                    document.getElementById('ldrLvlValue').textContent = (settings.ldr.lvl || 0.5).toFixed(2);
                }
                else document.getElementById('ldrEn').className = 'checkbox';
                if (settings.pir) {
                    document.getElementById('pirEn').className = settings.pir.en ? 'checkbox active' : 'checkbox';
                    document.getElementById('pirMax').value = settings.pir.max || 10;
                    document.getElementById('pirTime').value = settings.pir.time || 30;
                    // Type
                    const type = settings.pir.type || 'HL';
                    pirTypeSelect.value = type;
                    toggleDociFields(type === 'DOCI');
                    // Sens (500-5000)
                    const sensVal = settings.pir.sens !== undefined ? settings.pir.sens : 2000;
                    pirSensSlider.value = sensVal;
                    pirSensValue.textContent = sensVal ;
                    // Loop (32-996)
                    const loopVal = settings.pir.loop !== undefined ? settings.pir.loop : 500;
                    pirLoopSlider.value = loopVal;
                    pirLoopValue.textContent = loopVal + ' ms';
                    // Sound
                    pirSndToggle.className = settings.pir.snd ? 'checkbox active' : 'checkbox';
                }
                else {
                    document.getElementById('pirEn').className = 'checkbox';
                    pirTypeSelect.value = 'HL';
                    toggleDociFields(false);
                    pirSensSlider.value = 2000;
                    pirSensValue.textContent = '2000';
                    pirLoopSlider.value = 500;
                    pirLoopValue.textContent = '500 ms';
                    pirSndToggle.className = 'checkbox';
                }

                // Options
                oneBToggle.className = settings.oneB ? 'checkbox active' : 'checkbox';
                tmrToggle.className = settings.tmr ? 'checkbox active' : 'checkbox';
                isPBToggle.className = settings.isPB ? 'checkbox active' : 'checkbox';
                solarToggle.className = settings.slr ? 'checkbox active' : 'checkbox';

            }

            function updateActionStates(data) {
                const isOn = (data.isOn !== undefined)?data.isOn:(lightSettings?.bri?.lvl > 0);

                    // Update light icon
                    if (isOn) {
                        lightIcon.classList.remove('off');
                        lightIcon.classList.add('lamp-on');
                        lightToggleBtn.classList.add('btn-on');
                        lightToggleBtn.classList.remove('btn-off');
                    }
                    else {
                        lightIcon.classList.add('off');
                        lightIcon.classList.remove('lamp-on');
                        lightToggleBtn.classList.add('btn-off');
                        lightToggleBtn.classList.remove('btn-on');
                    }

                    // Update PIR icon
                    const pirEn = (data.pir && data.pir.en !== undefined) ? data.pir.en : (lightSettings?.pir?.en || 0);
                    if (pirEn) {
                        pirIcon.classList.remove('off');
                    }
                    else {
                        pirIcon.classList.add('off');
                    }
                }

                function updateUsbState(usbOn) {
                    const isUsbOn = (usbOn === true || usbOn === 1);
                    if (isUsbOn) {
                        usbIcon.classList.remove('off');
                        usbToggleBtn.classList.add('btn-on');
                        usbToggleBtn.classList.remove('btn-off');
                    }
                    else {
                        usbIcon.classList.add('off');
                        usbToggleBtn.classList.add('btn-off');
                        usbToggleBtn.classList.remove('btn-on');
                    }
                }

                function updatePowerbankCardVisibility(isPBEnabled) {
                    powerbankCard.style.display = isPBEnabled ? 'flex' : 'none';
                }

                function collectFormData() {
                    if (!lightSettings) return {};
                    const updated = JSON.parse(JSON.stringify(lightSettings));
                    if (!updated.bri) updated.bri = { min: 0.006, last: 0.5, lvl: 0, ratio: { warm: 0.5, cold: 0.5, keep: 0 } };
                    if (!updated.ldr) updated.ldr = { en: 1, lvl: 0.5 };
                    if (!updated.pir) updated.pir = { en: 0, max: 10, time: 30, bt: 0 };

                    updated.mode = document.getElementById('modeSelect').value;
                    updated.bri.max = parseFloat(document.getElementById('briMax').value);
                    updated.bri.min = parseFloat(document.getElementById('briMin').value);
                    updated.bri.last = parseInt(document.getElementById('briLast').value) / 100;

                    const keep = document.getElementById('briKeep').classList.contains('active') ? 1 : 0;
                    const sliderProp = parseInt(document.getElementById('briWarmRatio').value) / 100;
                    let warm, cold;
                    if (keep === 1) {
                        warm = sliderProp;
                        cold = 1 - warm;
                    }
                    else {
                        warm = sliderProp;
                        cold = 1 - sliderProp;
                        const max = Math.max(warm, cold);
                        if (max > 0) { warm /= max;
                            cold /= max; }
                    }
                    updated.bri.ratio = { warm, cold, keep };
                    updated.ldr.en = document.getElementById('ldrEn').classList.contains('active') ? 1 : 0;
                    updated.ldr.lvl = parseInt(document.getElementById('ldrLvl').value) / 100;
                    updated.pir.en = document.getElementById('pirEn').classList.contains('active') ? 1 : 0;
                    updated.pir.max = parseInt(document.getElementById('pirMax').value);
                    updated.pir.time = parseInt(document.getElementById('pirTime').value);

                    // PIR type
                    updated.pir.type = pirTypeSelect.value;
                    // Sens (500-5000)
                    updated.pir.sens = parseInt(pirSensSlider.value);
                    // Loop (32-996)
                    updated.pir.loop = parseInt(pirLoopSlider.value);
                    // Sound
                    updated.pir.snd = pirSndToggle.classList.contains('active') ? 1 : 0;

                    // Options
                    updated.oneB = oneBToggle.classList.contains('active') ? 1 : 0;
                    updated.tmr = tmrToggle.classList.contains('active') ? 1 : 0;
                    updated.isPB = isPBToggle.classList.contains('active') ? 1 : 0;

                    return updated;
                }

                // ---- Actions ----
                async function lightToggle() {
                    statusText.textContent = 'Toggling light...';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand('ew.apps.lamp.tgl()\n');
                    setTimeout(refreshData, 300);
                }

                async function fadeTo() {
                    const value = parseInt(brightnessSlider.value) / 100;
                    statusText.textContent = 'Fading to ' + (value * 100) + '%...';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand('ew.apps.lamp.fadeTo(' + value + ',()=>{if (0<ew.apps.lamp.state.def.bri.lvl) ew.apps.lamp.state.def.bri.last=ew.apps.lamp.state.def.bri.lvl; })\n');
                    setTimeout(refreshData, 500);
                }
                async function ldrSet() {
                    statusText.textContent = 'Setting LDR threshold...';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand('ew.apps.lamp.ldr("set")\n');
                    setTimeout(refreshData, 300);
                }
                async function ldrRead() {
                    statusText.textContent = 'Reading LDR...';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 100));
                    await sendCommand('Bluetooth.println(JSON.stringify({l:ew.apps.lamp.ldr("get")}))\n');
                    setTimeout(refreshData, 300);
                }
                async function pirToggle() {
                    statusText.textContent = 'Toggling PIR...';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand('ew.apps.lamp.auto()\n');
                    setTimeout(refreshData, 300);
                }
                async function toggleUSB() {
                    statusText.textContent = 'Toggling USB...';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 50));
                    await sendCommand('ew.apps.lamp.pwrT()\n');
                    setTimeout(async() => {
                        await sendCommand('\x10');
                        await new Promise(r => setTimeout(r, 50));
                        await sendCommand('Bluetooth.println(JSON.stringify({usb:ew.apps.lamp.state.pwrb}))\n');
                        statusText.textContent = translations[currentLanguage].statusConnected;
                    }, 200);
                }

                // ---- Data & Save / Export / Import ----
                async function refreshData() {
                    const t = translations[currentLanguage];
                    statusText.textContent = t.statusReading;
                    dataBuffer = '';
                    await sendCommand('\x10');
                    await new Promise(r => setTimeout(r, 100));
                    await sendCommand('Bluetooth.println(JSON.stringify(ew.apps.lamp.state.def))\n');
                    await new Promise(r => setTimeout(r, 200));
                    await sendCommand('Bluetooth.println(JSON.stringify({o:ew.apps.lamp.state.isOn, p:ew.apps.lamp.state.def.pir.en, usb:ew.apps.lamp.state.pwrb}))\n');
                    setTimeout(() => { if (statusText.textContent === t.statusReading) statusText.textContent = t.statusConnected; }, 3000);
                }

                async function saveSettings() {
                    const t = translations[currentLanguage];
                    if (!confirm(t.confirmSave)) return;
                    try {
                        statusText.textContent = t.statusSaving;
                        const settings = collectFormData();
                        await sendCommand('\x10');
                        await new Promise(r => setTimeout(r, 100));
                        await sendCommand('ew.apps.lamp.state.def = ' + JSON.stringify(settings) + ';\n');
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

                function handleImportSettings(event) {
                    const file = event.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const settings = JSON.parse(e.target.result);
                            lightSettings = settings;
                            populateForm(settings);
                            updateActionStates(settings);
                            if (settings && settings.isPB !== undefined) {
                                updatePowerbankCardVisibility(settings.isPB);
                            }
                            statusText.textContent = translations[currentLanguage].statusConnected;
                        }
                        catch (error) {
                            alert('Σφάλμα εισαγωγής: Μη έγκυρο αρχείο JSON');
                        }
                    };
                    reader.readAsText(file);
                    event.target.value = '';
                }

                async function sendCommand(command) {
                    const chunkSize = 100;
                    for (let i = 0; i < command.length; i += chunkSize) {
                        const chunk = command.substring(i, i + chunkSize);
                        window.parent.postMessage({ type: 'BLUETOOTH_COMMAND', command: chunk }, '*');
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

                function askParentForLanguage() {
                    window.parent.postMessage({ type: 'REQUEST_LANGUAGE' }, '*');
                }

                function applyLanguage(lang) {
                    currentLanguage = lang;
                    const t = translations[lang];
                    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
                    setText('statusText', t.statusConnected);
                    setText('actionsTabText', t.actionsTab);
                    setText('settingsTabText', t.settingsTab);
                    setText('powerTitle', t.powerTitle);
                    setText('toggleText', t.toggleText);
                    setText('brightnessTitle', t.brightnessTitle);
                    setText('pirTitle', t.pirTitle);
                    setText('pirToggleText', t.pirToggleText);
                    setText('modeTitle', t.modeTitle);
                    setText('modeLabel', t.modeLabel);
                    setText('briTitle', t.briTitle);
                    setText('briMaxLabel', t.briMaxLabel);
                    setText('briMinLabel', t.briMinLabel);
                    setText('briMinHint', t.briMinHint);
                    setText('briLastLabel', t.briLastLabel);
                    setText('briLastHint', t.briLastHint);
                    setText('briWarmRatioLabel', t.briWarmRatioLabel);
                    setText('briWarmRatioHint', t.briWarmRatioHint);
                    setText('briKeepLabel', t.briKeepLabel);
                    setText('briKeepHint', t.briKeepHint);
                    setText('ldrSettingsTitle', t.ldrSettingsTitle);
                    setText('ldrSetText', t.ldrSetText);
                    setText('ldrReadText', t.ldrReadText);
                    setText('ldrLvlLabel', t.ldrLvlLabel);
                    setText('ldrLvlHint', t.ldrLvlHint);
                    setText('pirSettingsTitle', t.pirSettingsTitle);
                    setText('pirEnLabel', t.pirEnLabel);
                    setText('pirMaxLabel', t.pirMaxLabel);
                    setText('pirMaxHint', t.pirMaxHint);
                    setText('pirTimeLabel', t.pirTimeLabel);
                    setText('pirTimeHint', t.pirTimeHint);
                    setText('pirTypeLabel', t.pirTypeLabel);
                    setText('pirSensLabel', t.pirSensLabel);
                    setText('pirLoopLabel', t.pirLoopLabel);
                    setText('pirSndLabel', t.pirSndLabel);
                    setText('optionsTitle', t.optionsTitle);
                    setText('oneBLabel', t.oneBLabel);
                    setText('tmrLabel', t.tmrLabel);
                    setText('isPBLabel', t.isPBLabel);
                    setText('solarLabel', t.solarLabel);
                    setText('powerbankTitle', t.powerbankCardTitle);
                    setText('usbToggleText', t.usbToggleText);
                    setText('refreshText', t.refresh);
                    setText('saveText', t.save);
                    setText('exportSettingsText', t.exportSettings);
                    setText('importSettingsText', t.importSettings);
                }
            });
