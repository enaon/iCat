// ha-bluetooth-shim.js — Ακριβές αντίγραφο του πρωτοκόλλου espruino-panel.js + Device Picker
(function () {
    'use strict';

    const realBluetooth = (typeof navigator !== 'undefined') ? navigator.bluetooth : undefined;
    const UART_TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    const UART_RX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

    let currentTxChar = null;
    let currentDevice = null;
    let pendingPortsResolve = null;
    let pendingConnectResolve = null;
    let pendingConnectReject = null;
    let lastPorts = null;
    let haMode = null;

    // --- Μηνύματα από τον γονέα ---
    window.addEventListener('message', function (event) {
        const msg = event.data;
        if (!msg || typeof msg !== 'object') return;
        if (msg.for !== 'ide') return;

        switch (msg.type) {
            case 'initialised':
                haMode = true;
                console.log('[HA-BT-Shim] Ο γονέας απάντησε: initialised');
                break;

            case 'setMaxWriteLength':
                console.log('[HA-BT-Shim] setMaxWriteLength:', msg.data);
                break;

            case 'ports':
                lastPorts = msg.data || [];
                if (pendingPortsResolve) {
                    pendingPortsResolve(lastPorts);
                    pendingPortsResolve = null;
                }
                break;

            case 'connected':
                if (currentDevice) currentDevice.gatt.connected = true;
                if (pendingConnectResolve) {
                    pendingConnectResolve();
                    pendingConnectResolve = null;
                    pendingConnectReject = null;
                }
                break;

            case 'disconnected':
                if (currentDevice) {
                    currentDevice.gatt.connected = false;
                    currentDevice.dispatchEvent(new Event('gattserverdisconnected'));
                }
                break;

            case 'written':
                break;

            case 'receive':
                if (currentTxChar && msg.data != null) {
                    const str = (typeof msg.data === 'string') ? msg.data : String(msg.data);
                    const buf = new TextEncoder().encode(str);
                    const view = new DataView(buf.buffer);
                    const evt = new Event('characteristicvaluechanged');
                    Object.defineProperty(evt, 'target', { value: { value: view } });
                    currentTxChar.dispatchEvent(evt);
                }
                break;
        }
    });

    function probeHA() {
        return new Promise(resolve => {
            if (window.parent === window) { resolve(false); return; }
            let resolved = false;
            const handler = (event) => {
                const msg = event.data;
                if (msg && msg.for === 'ide' && msg.type === 'initialised') {
                    if (resolved) return;
                    resolved = true;
                    window.removeEventListener('message', handler);
                    resolve(true);
                }
            };
            window.addEventListener('message', handler);
            try { window.parent.postMessage({ from: 'ide', type: 'init' }, '*'); } catch (e) {}
            setTimeout(() => {
                if (resolved) return;
                resolved = true;
                window.removeEventListener('message', handler);
                resolve(false);
            }, 800);
        });
    }

    function getPorts() {
        return new Promise(resolve => {
            if (lastPorts && lastPorts.length) { resolve(lastPorts); return; }
            pendingPortsResolve = resolve;
            window.parent.postMessage({ from: 'ide', type: 'getPorts' }, '*');
            setTimeout(() => {
                if (pendingPortsResolve === resolve) {
                    pendingPortsResolve = null;
                    resolve(lastPorts || []);
                }
            }, 3000);
        });
    }

    function connectToPort(path) {
        return new Promise((resolve, reject) => {
            pendingConnectResolve = resolve;
            pendingConnectReject = reject;
            window.parent.postMessage({ from: 'ide', type: 'connect', data: path }, '*');
            setTimeout(() => {
                if (pendingConnectResolve === resolve) {
                    pendingConnectResolve = null;
                    pendingConnectReject = null;
                    reject(new Error('Timeout σύνδεσης μέσω HA'));
                }
            }, 15000);
        });
    }

    // --- Fake Web Bluetooth ---
    class FakeCharacteristic extends EventTarget {
        constructor(uuid) { super(); this.uuid = uuid; this.value = null; }
        async startNotifications() { return this; }
        async stopNotifications() { return this; }
        async writeValueWithResponse(data) {
            const str = (data instanceof Uint8Array) ? new TextDecoder().decode(data) : String(data);
            window.parent.postMessage({ from: 'ide', type: 'write', data: str }, '*');
        }
        async writeValue(data) { return this.writeValueWithResponse(data); }
        async readValue() { return new DataView(new ArrayBuffer(0)); }
    }
    class FakeService {
        constructor(uuid) { this.uuid = uuid; }
        async getCharacteristic(uuid) {
            const ch = new FakeCharacteristic(uuid);
            if (uuid === UART_TX_UUID) currentTxChar = ch;
            return ch;
        }
    }
    class FakeGATTServer {
        constructor(device) { this.device = device; this.connected = false; }
        async connect() { this.connected = true; return this; }
        disconnect() {
            if (this.connected) {
                this.connected = false;
                window.parent.postMessage({ from: 'ide', type: 'disconnect' }, '*');
                setTimeout(() => {
                    this.device.dispatchEvent(new Event('gattserverdisconnected'));
                }, 50);
            }
        }
        async getPrimaryService(uuid) { return new FakeService(uuid); }
        async getPrimaryServices() { return []; }
    }
    class FakeDevice extends EventTarget {
        constructor(name, address) {
            super();
            this.name = name;
            this.id = address;
            this.gatt = new FakeGATTServer(this);
        }
    }

    // --- Device Picker UI ---
        // --- Device Picker UI (ταιριαστό με το dark theme του site) ---
    function showDevicePicker(ports) {
        return new Promise((resolve, reject) => {
            // Inject ένα <style> μία φορά για scrollbar + hover effects
            if (!document.getElementById('__hbt_style')) {
                const st = document.createElement('style');
                st.id = '__hbt_style';
                st.textContent = `
                    .__hbt_overlay {
                        position: fixed; inset: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 2147483646;
                        display: flex; align-items: center; justify-content: center;
                        font-family: 'Roboto', sans-serif;
                        animation: __hbt_fade .15s ease;
                    }
                    @keyframes __hbt_fade { from { opacity: 0 } to { opacity: 1 } }

                    .__hbt_modal {
                        background: var(--color-surface, #1E1E1E);
                        color: var(--color-on-surface, #FFFFFF);
                        border-radius: 12px;
                        width: min(420px, 92vw);
                        max-height: 80vh;
                        display: flex; flex-direction: column;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                        overflow: hidden;
                        animation: __hbt_pop .18s ease;
                    }
                    @keyframes __hbt_pop {
                        from { transform: scale(.96); opacity: 0 }
                        to   { transform: scale(1);   opacity: 1 }
                    }

                    .__hbt_header {
                        padding: 14px 16px;
                        font-size: 15px; font-weight: 500;
                        display: flex; justify-content: space-between; align-items: center;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        flex-shrink: 0;
                    }
                    .__hbt_header i {
                        color: var(--color-primary, #BB86FC);
                        margin-right: 8px;
                    }
                    .__hbt_close {
                        background: none; border: none;
                        color: #888; font-size: 22px; line-height: 1;
                        cursor: pointer; padding: 0 4px;
                        transition: color .2s ease;
                    }
                    .__hbt_close:hover { color: #fff; }

                    .__hbt_search {
                        padding: 10px 16px 12px;
                        flex-shrink: 0;
                    }
                    .__hbt_search input {
                        width: 100%;
                        padding: 10px 14px;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 8px;
                        color: var(--color-on-surface, #FFFFFF);
                        font-family: inherit; font-size: 13px;
                        outline: none;
                        transition: border-color .2s ease, background .2s ease;
                    }
                    .__hbt_search input:focus {
                        border-color: var(--color-primary, #BB86FC);
                        background: rgba(255,255,255,0.08);
                    }
                    .__hbt_search input::placeholder { color: rgba(255,255,255,0.4); }

                    .__hbt_list {
                        overflow-y: auto;
                        padding: 0 8px 8px;
                        flex: 1;
                    }
                    .__hbt_list::-webkit-scrollbar { width: 6px; }
                    .__hbt_list::-webkit-scrollbar-track { background: transparent; }
                    .__hbt_list::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.15);
                        border-radius: 3px;
                    }
                    .__hbt_list::-webkit-scrollbar-thumb:hover {
                        background: rgba(255,255,255,0.25);
                    }

                    .__hbt_item {
                        padding: 12px 16px;
                        background-color: rgba(255, 255, 255, 0.05);
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background-color .2s ease;
                        margin-bottom: 6px;
                        display: flex; flex-direction: column;
                    }
                    .__hbt_item:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }
                    .__hbt_item.__hbt_active {
                        background-color: var(--color-primary-variant, #3700B3);
                    }
                    .__hbt_item .__hbt_name {
                        font-size: 14px; font-weight: 500;
                        color: var(--color-on-surface, #FFFFFF);
                    }
                    .__hbt_item .__hbt_addr {
                        font-size: 11px;
                        color: rgba(255,255,255,0.5);
                        margin-top: 2px;
                        font-family: 'Roboto Mono', monospace;
                        letter-spacing: .3px;
                    }
                    .__hbt_empty {
                        padding: 24px 20px;
                        text-align: center;
                        color: rgba(255,255,255,0.5);
                        font-size: 13px;
                    }
                `;
                document.head.appendChild(st);
            }

            const overlay = document.createElement('div');
            overlay.className = '__hbt_overlay';

            const modal = document.createElement('div');
            modal.className = '__hbt_modal';

            const header = document.createElement('div');
            header.className = '__hbt_header';
            header.innerHTML = `
                <span><i class="fas fa-bluetooth-b"></i>Επιλογή συσκευής</span>
                <button class="__hbt_close" aria-label="Close">&times;</button>
            `;

            const searchWrap = document.createElement('div');
            searchWrap.className = '__hbt_search';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Αναζήτηση...';
            searchWrap.appendChild(searchInput);

            const list = document.createElement('div');
            list.className = '__hbt_list';

            function renderList(filter) {
                list.innerHTML = '';
                const f = (filter || '').trim().toLowerCase();
                const filtered = ports.filter(p => {
                    if (!f) return true;
                    const name = (p.description || '').split(' (')[0].toLowerCase();
                    const addr = (p.path || '').toLowerCase();
                    return name.includes(f) || addr.includes(f);
                });

                if (!filtered.length) {
                    const empty = document.createElement('div');
                    empty.className = '__hbt_empty';
                    empty.textContent = 'Δεν βρέθηκαν συσκευές';
                    list.appendChild(empty);
                    return;
                }

                filtered.forEach((p) => {
                    const item = document.createElement('div');
                    item.className = '__hbt_item';
                    const name = (p.description || 'Espruino').split(' (')[0];
                    item.innerHTML = `
                        <div class="__hbt_name">${escapeHtml(name)}</div>
                        <div class="__hbt_addr">${escapeHtml(p.path || '')}</div>
                    `;
                    item.addEventListener('click', () => {
                        cleanup();
                        resolve(p);
                    });
                    list.appendChild(item);
                });
            }

            renderList('');

            searchInput.addEventListener('input', (e) => renderList(e.target.value));

            modal.appendChild(header);
            modal.appendChild(searchWrap);
            modal.appendChild(list);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Autofocus στο search
            setTimeout(() => searchInput.focus(), 50);

            function cleanup() {
                try { document.body.removeChild(overlay); } catch (e) {}
            }

            function cancel() {
                cleanup();
                const err = new Error('User cancelled');
                err.name = 'NotFoundError';
                reject(err);
            }

            header.querySelector('.__hbt_close').addEventListener('click', cancel);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cancel();
            });
            // ESC για κλείσιμο
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escHandler);
                    cancel();
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        })[c]);
    }

    // --- requestDevice σε HA mode ---
    async function requestDeviceHA(options) {
        const ports = await getPorts();
        console.log('[HA-BT-Shim] Διαθέσιμα ports:', ports);
        if (!ports || ports.length === 0) {
            throw new Error('Δεν βρέθηκαν συσκευές μέσω Home Assistant');
        }

        // Φιλτράρουμε με βάση τα filters του control.js
        let candidates = ports;
        if (options && options.filters) {
            const prefixes = [];
            options.filters.forEach(f => { if (f.namePrefix) prefixes.push(f.namePrefix); });
            if (prefixes.length) {
                candidates = ports.filter(p => {
                    const name = (p.description || '').split(' (')[0];
                    return prefixes.some(px => name.startsWith(px));
                });
            }
        }
        if (!candidates.length) candidates = ports; // fallback

        console.log('[HA-BT-Shim] Υποψήφιες συσκευές:', candidates.length);

        // Δείξε picker (ακόμα κι αν είναι μία μόνο — για επιβεβαίωση)
        const picked = await showDevicePicker(candidates);

        const path = picked.path;
        const name = (picked.description || 'Espruino').split(' (')[0];
        console.log('[HA-BT-Shim] Επιλέχθηκε:', { path, name });

        const device = new FakeDevice(name, path);
        currentDevice = device;
        await connectToPort(path);
        return device;
    }

    // --- Εγκατάσταση shim ---
    const shimmed = realBluetooth ? Object.create(realBluetooth) : {};
    shimmed.requestDevice = async function (options) {
        if (haMode === null) haMode = await probeHA();
        console.log('[HA-BT-Shim] mode:', haMode ? 'HA bridge' : 'native Web Bluetooth');
        if (haMode) return requestDeviceHA(options);
        if (realBluetooth && typeof realBluetooth.requestDevice === 'function') {
            return realBluetooth.requestDevice.call(realBluetooth, options);
        }
        throw new Error('Το Web Bluetooth δεν είναι διαθέσιμο σε αυτό το περιβάλλον');
    };
    if (!shimmed.getAvailability) shimmed.getAvailability = async () => true;
    if (!shimmed.getDevices) shimmed.getDevices = async () => [];

    try {
        Object.defineProperty(navigator, 'bluetooth', {
            value: shimmed,
            configurable: true,
            writable: false
        });
        console.log('[HA-BT-Shim] Εγκαταστάθηκε. realBluetooth:', !!realBluetooth);
    } catch (e) {
        console.warn('[HA-BT-Shim] Αποτυχία εγκατάστασης:', e);
    }
})();