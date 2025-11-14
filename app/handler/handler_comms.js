ew.comm.updt = function() {

  let updateAdv = function() {
    const role = { "watch": [0, "eW"], "litterBox": [1, "eL"], "tag": [2, "eC"], "pb": [3, "eR"], "light": [4, "eT"], "blind": [5, "eB"], "pir": [6, "eP"] };
    const phy = ["1mbps", "2mbps", "coded", "coded,1mbps", "1mbps,coded"];
    const board = ["MAGIC3", "ROCK", "BANGLEJS2", "DSD6", "NANO", "P8", "P22"];
    const txPower = [-8, -4, 0, 4, 8];

    var roleByte = 0;
    if (Array.isArray(ew.def.role)) {
      for (var i = 0; i < ew.def.role.length; i++) {
        var r = ew.def.role[i];
        if (role[r][0] !== undefined) {
          roleByte |= (1 << role[r][0]);
        }
      }
    }
    else {
      roleByte = (1 << role[ew.def.role][0]);
    }

    // ---- to be removed ----
    if (ew.def.frce === undefined) ew.def.frce = 0;

    return {
      name: (Array.isArray(ew.def.role) ? role[ew.def.role[0]][1] : role[ew.def.role][1]) + "-" + ew.def.name,
      showName: true,
      manufacturer: 0x0590,
      manufacturerData: [
        roleByte,
        //(role[ew.def.role][0]) | ((board.indexOf(process.env.BOARD)) << 4), //role
        (ew.def.bt.conn ? 1 : 0) | (ew.def.bt.uart ? 2 : 0) | ((phy.indexOf(ew.def.bt.phyA)) << 2) | ((txPower.indexOf(ew.def.bt.rfTX)) << 5), //bt info
        ew.sys.batt(1),
        ew.sys.batt() * 100 / 2 | 0,
        board.indexOf(process.env.BOARD) | ((ew.def.frce ? 1 : 0) << 4) //board type
      ],
      connectable: (ew.def.bt.conn ? true : false),
      scannable: (ew.def.bt.phyA === "1mbps" ? true : false),
      phy: ew.def.bt.phyA,
      interval: ew.def.bt.intA
    };

  }
  let secureMode=ew.def.bt.pair?{passkey:ew.def.bt.code, mitm:1, display:1}:{};

  try {
    
    NRF.setAddress(`${NRF.getAddress()} random`);
    NRF.setSecurity(secureMode);

    if (ew.def.bt.conn)
      NRF.setServices({
        0xffe0: {
          0xffe1: {
            value: [0x01],
            maxLen: 128,
            writable: true,
            onWrite: function(evt) {
              //evt.target.value.buffer
              ew.comm.prfr.RX(evt.data);
              //ew.comm.emit("BTRX", evt.data);
            },
            security: {
              read: {
                mitm: ew.def.bt.pair1?true:false,
                encrypted: ew.def.bt.pair1?true:false
              },
              write: {
                mitm: ew.def.bt.pair1?true:false,
                encrypted: ew.def.bt.pair1?true:false
              },
            },
            readable: true,
            notify: true,
            description: "eW"
          }
        }
      }, { uart: (ew.def.bt.uart) ? true : false });


    if (ew.def.bt.adv) {

      NRF.setAdvertising({}, updateAdv());

      if (ew.is.btsl == 1) {
        NRF.wake();
        ew.is.btsl = 0;
        //if (!ew.def.face.info) ew.notify.alert("info", { "src": "BT", "title": "BT", "body": "WAKE" }, 1);
      }
      NRF.setConnectionInterval(ew.def.bt.intC);
      NRF.setTxPower(ew.def.bt.rfTX);
    }
    else {
      //if (ew.is.bt) NRF.disconnect();
      NRF.sleep();
      ew.is.btsl = 1;
      //NRF.setAdvertising({}, { name: "eW-" + ew.def.name, connectable: false, scannable: false });

      //if (!ew.def.face.info) ew.notify.alert("info", { "src": "BT", "title": "BT", "body": "SLEEP" }, 1);

    }

  }
  catch (e) {
    if (ew.dbg) console.log("comms: Bt update error: ", e);
    ew.sys.fileWrite("error", "er", e);
    //ew.notify.alert("info", { "src": "BT", "title": "BT", "body": "ERROR" }, 1);
  }
};

// ---- COMMON MODULE ----

ew.comm.common = {
  mtu: (ew.def && ew.def.bt && ew.def.bt.mtu) ? ew.def.bt.mtu : 100,
  chunkTimeout: 10000,
  dbg: false,
  chunkBuffer: {},

  // Initialize chunk buffer
  initChunkBuffer() {
    if (!this.chunkBuffer) this.chunkBuffer = {};
  },

  // Assemble chunks into complete message
  assembleChunk(chunk) {
    this.initChunkBuffer();
    const messageId = chunk.id;

    if (!this.chunkBuffer[messageId]) {
      this.chunkBuffer[messageId] = {
        chunks: {},
        total: chunk.tc,
        received: 0,
        timestamp: Date.now()
      };
      if (this.dbg) console.log("comms: common Created buffer for", messageId);
    }

    const buffer = this.chunkBuffer[messageId];

    // Store chunk if not already received
    if (buffer.chunks[chunk.i] === undefined) {
      buffer.chunks[chunk.i] = chunk.d;
      buffer.received++;
      if (this.dbg) console.log("comms: common Chunk", chunk.i, "received for", messageId, "- total:", buffer.received + "/" + buffer.total);
    }

    // Check if all chunks received
    if (buffer.received === buffer.total) {
      if (this.dbg) console.log("comms: common All chunks received for", messageId);

      // Assemble in correct order
      let fullData = '';
      for (let i = 0; i < buffer.total; i++) {
        if (buffer.chunks[i] !== undefined) {
          fullData += buffer.chunks[i];
        }
        else {
          if (this.dbg) console.log("comms: common Missing chunk", i, "for", messageId);
          return null;
        }
      }

      delete this.chunkBuffer[messageId];
      return fullData;
    }

    return null;
  },

  // Clean up old chunk buffers
  cleanupChunkBuffers() {
    if (!this.chunkBuffer) return;

    const now = Date.now();
    for (let id in this.chunkBuffer) {
      if (now - this.chunkBuffer[id].timestamp > this.chunkTimeout) {
        if (this.dbg) console.log("comms: common Cleaning up buffer:", id);
        delete this.chunkBuffer[id];
      }
    }
  },

  // Create chunks from data
  createChunks(dataStr, messageId, headerBuffer) {
    headerBuffer = headerBuffer || 30;

    const payloadSize = this.mtu - headerBuffer;
    const totalChunks = Math.ceil(dataStr.length / payloadSize);
    const chunks = [];

    if (this.dbg) console.log("comms: common Creating", totalChunks, "chunks for", messageId, "data length:", dataStr.length, "payload size:", payloadSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * payloadSize;
      const end = Math.min(start + payloadSize, dataStr.length);
      const chunkData = dataStr.substring(start, end);

      if (this.dbg) console.log("comms: common Chunk", i, "chars:", start, "-", end, "length:", chunkData.length);

      chunks.push({
        t: "c",
        id: messageId,
        tc: totalChunks,
        i: i,
        d: chunkData
      });
    }

    return chunks;
  },

  // Safe object serialization
  safe(obj) {
    if (obj === undefined) return "undefined";
    if (obj === null) return "null";

    if (typeof obj === 'function') {
      return { type: "function", name: obj.name || "anonymous" };
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.safe(item));
    }

    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        try {
          result[key] = this.safe(obj[key]);
        }
        catch (e) {
          result[key] = { error: "cannot_serialize" };
        }
      }
    }
    return result;
  },

  // Generate unique ID
  generateId() {
    // Απλά incremental - "1", "2", "3"...
    let counter = (ew.comm._idCounter = (ew.comm._idCounter || 0) + 1) & 0xFF;
    return counter.toString(36); // 1-2 chars
  }
};

// ---- MASTER MODULE ----
ew.comm.mstr = {
  queue: [],
  tid: { timeout: 0 },
  isSending: false,
  connection: null,
  char: null,
  rssi: 0,
  responses: {},
  timeout: 30000,
  isFullyConnected: false,

  // Use common functions
  get mtu() { return ew.comm.common.mtu; },
  get dbg() { return ew.comm.common.dbg; },
  set dbg(value) { ew.comm.common.dbg = value; },

  // Connect to peripheral
  connect(deviceId, phy, mtu, rssiHandler) {
    if (this.connection && this.connection.connected) {
      if (this.dbg) console.log("comms: master already connected");
      return Promise.resolve(this.connection);
    }

    if (mtu) ew.comm.common.mtu = mtu;
    phy = phy || "1mbps";
    this.isFullyConnected = false;

    return new Promise((resolve, reject) => {
      NRF.connect(deviceId, { minInterval: 7.5, maxInterval: 7.5, phy: phy }).then(c => {
        this.connection = c;
        c.device.on('gattserverdisconnected', (reason) => this.disconnected(reason));
        if (rssiHandler) c.setRSSIHandler((rssi) => { this.rssi = rssi; });
        return c.getPrimaryService("0xffe0");
      }).then(s => s.getCharacteristic("0xffe1")).then(ch => {
        this.char = ch;
        ch.on('characteristicvaluechanged', e => {
          this.handleResponseChunk(E.toString(e.target.value.buffer));
        });
        return ch.startNotifications();
      }).then(() => {
        this.isFullyConnected = true;
        if (this.dbg) console.log("comms: master fully connected");
        resolve(this.connection);
      }).catch(e => {
        if (this.dbg) console.log("comms: master connection failed:", e);
        this.isFullyConnected = false;
        reject(e);
        this.disconnected(e);
      });
    });
  },
  // Disconnect
  disconnect() {
    return new Promise((resolve) => {
      if (this.connection) {
        try {
          this.connection.setRSSIHandler();
          this.connection.disconnect();
          this.char = null;
          this.isFullyConnected = false;
          this.queue = [];
          this.isSending = false;
          this.responses = {};
          if (this.dbg) console.log("comms: master disconnected");
          resolve({ s: "ok", m: "DISCONNECTED" });
        }
        catch (error) {
          if (this.dbg) console.log("comms: master disconnect failed");
          resolve({ s: "err", m: "FAILED" });
        }
      }
      else {
        resolve({ s: "ok", m: "DISCONNECTED" });
      }
    });
  },

  disconnected(reason) {
    if (this.dbg) console.log("comms: master disconnected, reason:", reason);
    this.char = null;
    this.rssi = 0;
    this.isFullyConnected = false;
    this.queue = [];
    this.isSending = false;
    this.responses = {};
    this.mtu = (ew.def && ew.def.bt && ew.def.bt.mtu) ? ew.def.bt.mtu : 100;
    if (ew.UI) ew.UI.btn.ntfy(1, 1.5, 0, "_bar", 6, "DISCONNECTED", (reason + "").toUpperCase(), 15, 13);
  },

  // Send command
  send(command) {
    return new Promise((resolve, reject) => {
      if (!this.isFullyConnected || !this.connection || !this.char) {
        reject("Not connected");
        return;
      }

      if (!command.id) {
        command.id = ew.comm.common.generateId();
      }

      this.queue.push({
        command: command,
        resolve: resolve,
        reject: reject,
        timestamp: Date.now()
      });

      if (!this.isSending) {
        this.processQueue();
      }
    });
  },

  // Process queue
  processQueue() {
    if (this.queue.length === 0 || !this.isFullyConnected || this.isSending) {
      this.isSending = false;
      if (this.tid.timeout) {
        clearTimeout(this.tid.timeout);
        this.tid.timeout = 0;
      }
      return;
    }

    this.isSending = true;
    if (this.tid.timeout) {
      clearTimeout(this.tid.timeout);
      this.tid.timeout = 0;
    }

    const item = this.queue[0];

    // Response timeout
    this.tid.timeout = setTimeout(() => {
      if (this.isSending && this.queue.length > 0 && this.queue[0] === item) {
        if (this.dbg) console.log("comms: master timeout for:", item.command.id);
        this.queue.shift();
        item.reject("Response Timeout");
        this.isSending = false;
        this.processQueue();
      }
    }, 5000);

    // Queue timeout
    if (Date.now() - item.timestamp > this.timeout) {
      this.queue.shift();
      item.reject("Queue Timeout");
      this.isSending = false;
      this.processQueue();
      return;
    }

    const dataStr = JSON.stringify(item.command);

    // Check if chunking needed
    if (dataStr.length <= this.mtu - 30) {
      this.char.writeValue(dataStr).then(() => {
        if (this.dbg) console.log("comms: master sent:", item.command.id);
        if (item.command.noResponse) {
          clearTimeout(this.tid.timeout);
          this.queue.shift();
          item.resolve({ s: "ok" });
          this.isSending = false;
          this.processQueue();
        }
      }).catch(e => this.handleSendError(e, item));
    }
    else {
      this.sendChunkedData(dataStr, item);
    }
  },

  sendChunkedData(dataStr, item) {
    const chunks = ew.comm.common.createChunks(dataStr, item.command.id, 30);
    this.sendChunksSequentially(chunks, 0, item);
  },

  sendChunksSequentially(chunks, index, item) {
    if (index >= chunks.length) return;

    const chunk = chunks[index];
    const chunkStr = JSON.stringify(chunk);

    this.char.writeValue(chunkStr).then(() => {
      if (this.dbg) console.log("comms: master sent chunk", chunk.i + 1, "/", chunk.tc);
      setTimeout(() => this.sendChunksSequentially(chunks, index + 1, item), 50);
    }).catch(e => this.handleSendError(e, item));
  },

  handleSendError(e, item) {
    if (this.tid.timeout) clearTimeout(this.tid.timeout);
    if (this.dbg) console.log("comms: master send error:", e);
    this.queue.shift();
    item.reject(e);
    this.isSending = false;
    this.processQueue();
  },

  handleResponseChunk(data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.t === "c") {
        const fullData = ew.comm.common.assembleChunk(parsed);
        if (fullData) this.handleResponse(fullData);
        ew.comm.common.cleanupChunkBuffers();
      }
      else {
        this.handleResponse(data);
      }
    }
    catch (e) {
      if (this.dbg) console.log("comms: master response parse error:", e);
    }
  },

  handleResponse(data) {
    try {
      const response = JSON.parse(data);
      if (this.dbg) console.log("comms: master received:", response.id);

      if (this.tid.timeout) {
        clearTimeout(this.tid.timeout);
        this.tid.timeout = 0;
      }

      if (response.id) {
        this.responses[response.id] = { got: response, time: Date.now() };
        const index = this.queue.findIndex(item => item.command.id === response.id);

        if (index !== -1) {
          const item = this.queue[index];
          this.queue.splice(index, 1);
          response.s === "ok" ? item.resolve(response) : item.reject(response);
        }
      }

      this.isSending = false;
      this.processQueue();
      this.cleanupResponses();

    }
    catch (e) {
      if (this.dbg) console.log("comms: master response parse error:", e);
      if (this.tid.timeout) clearTimeout(this.tid.timeout);
      this.isSending = false;
    }
  },

  cleanupResponses() {
    const now = Date.now();
    for (let id in this.responses) {
      if (now - this.responses[id].time > 60000) {
        delete this.responses[id];
      }
    }
  },

  // Batch commands
  batch(commands) {
    return new Promise((resolve) => {
      const batchId = ew.comm.common.generateId('batch');
      const results = [];
      let completed = 0;

      const checkCompletion = () => {
        if (completed === commands.length) {
          resolve({ id: batchId, results: results });
        }
      };

      commands.forEach((cmd, index) => {
        this.send(cmd).then(result => {
          results[index] = { s: "ok", m: result };
          completed++;
          checkCompletion();
        }).catch(error => {
          results[index] = { s: "err", m: error };
          completed++;
          checkCompletion();
        });
      });
    });
  },

  // Helper functions
  get(path, filter, id) {
    return this.send({ g: path, f: filter, id: id });
  },

  set(path, value, id) {
    return this.send({ s: path, v: value, id: id });
  },

  eW(action, params, id) {
    return this.send({ eW: action, p: params, id: id });
  },

  G(action, params, id) {
    return this.send({ G: action, p: params, id: id });
  },

  // Status check
  getStatus() {
    return {
      connected: this.isFullyConnected,
      queueLength: this.queue.length,
      isSending: this.isSending,
      storedResponses: Object.keys(this.responses).length
    };
  }
};

// ----PERIPHERAL MODULE ----
ew.comm.prfr = {
  // Use common settings
  get mtu() { return ew.comm.common.mtu; },
  get dbg() { return ew.comm.common.dbg; },
  set dbg(value) { ew.comm.common.dbg = value; },

  // Handle incoming data
  RX(d) {
    try {
      const s = typeof d === 'string' ? d : E.toString(d);

      if (this.dbg) console.log("comms: peripheral RX:", s.substring(0, 100));

      // Direct processing for non-chunk messages
      if (!s.includes('"t":"c"')) {
        const m = JSON.parse(s);
        this.processMessage(m);
        return;
      }

      // Process chunk
      const chunk = JSON.parse(s);
      this.handleChunk(chunk);

    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral RX error:", e);
      this.TX({ s: "err", m: "parse_err", e: e.toString() });
    }
  },

  handleChunk(chunk) {
    if (this.dbg) console.log("comms: peripheral processing chunk", chunk.i + 1, "/", chunk.tc);
    if (this.dbg) console.log("comms: peripheral CHUNK CONTENT - i:", chunk.i, "data:", JSON.stringify(chunk.d));

    const fullData = ew.comm.common.assembleChunk(chunk);

    if (fullData) {
      if (this.dbg) console.log("comms: peripheral chunk assembly complete");
      if (this.dbg) console.log("comms: peripheral FULL ASSEMBLED DATA:", fullData);
      try {
        const m = JSON.parse(fullData);
        this.processMessage(m);
      }
      catch (e) {
        if (this.dbg) console.log("comms: peripheral chunk parse error:", e);
        this.TX({ s: "err", m: "chunk_parse_err", id: chunk.id });
      }
    }

    ew.comm.common.cleanupChunkBuffers();
  },

  processMessage(m) {
    if (this.dbg) console.log("comms: peripheral processing message:", m.id);

    const sendResponse = (data, originalMsg) => {
      const response = Object.assign({}, data);
      if (originalMsg && originalMsg.id) response.id = originalMsg.id;
      if (originalMsg && originalMsg.g) response.p = originalMsg.g;
      this.TX(response);
    };

    if (m.eW || m.G) {
      this.handleEWGMessage(m, sendResponse);
    }
    else if (m.batch && Array.isArray(m.batch)) {
      this.handleBatchMessage(m, sendResponse);
    }
    else if (m.g) {
      this.handleGetMessage(m, sendResponse);
    }
    else if (m.s && m.v !== undefined) {
      this.handleSetMessage(m, sendResponse);
    }
    else {
      sendResponse({ s: "err", m: "bad_format" }, m);
    }
  },

  handleEWGMessage(m, sendResponse) {
    try {
      const p = m.eW ? m.eW.split('.') : m.G.split('.');
      let c = m.eW ? ew : global;

      for (let i = 0; i < p.length; i++) {
        if (c && c[p[i]] !== undefined) {
          c = c[p[i]];
        }
        else {
          sendResponse({ s: "err", m: "not_found", p: p[i] }, m);
          return;
        }
      }

      if (typeof c === 'function') {
        // Handle different parameter types
        let params = m.p;

        if (params !== undefined) {
          if (Array.isArray(params)) {
            // Array of parameters
            if (params.length === 1) {
              const r = c.call(null, params[0]);
              sendResponse({ s: "ok", r: r }, m);
            }
            else {
              const r = c.apply(null, params);
              sendResponse({ s: "ok", r: r }, m);
            }
          }
          else {
            // Single parameter (not in array)
            const r = c.call(null, params);
            sendResponse({ s: "ok", r: r }, m);
          }
        }
        else {
          // No parameters
          const r = c();
          sendResponse({ s: "ok", r: r }, m);
        }
      }
      else {
        sendResponse({ s: "err", m: "not_func" }, m);
      }
    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral exec error:", e);
      sendResponse({ s: "err", m: "exec_err", e: e.toString() }, m);
    }
  },

  handleBatchMessage(m, sendResponse) {
    const batchResults = [];
    for (let i = 0; i < m.batch.length; i++) {
      const req = m.batch[i];
      try {
        const result = this.getV(req.g, req.f || req.filter);
        batchResults.push({ s: "ok", d: result, id: req.id, path: req.g });
      }
      catch (e) {
        batchResults.push({ s: "err", e: e.toString(), id: req.id, path: req.g });
      }
    }
    sendResponse({ s: "ok", batch: batchResults }, m);
  },

  handleGetMessage(m, sendResponse) {
    try {
      const result = this.getV(m.g, m.f);
      sendResponse({ s: "ok", v: result }, m);
    }
    catch (e) {
      sendResponse({ s: "err", m: "get_err", e: e.toString() }, m);
    }
  },

  handleSetMessage(m, sendResponse) {
    try {
      const r = this.setV(m.s, m.v);
      sendResponse(r, m);
    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral set error:", e);
      sendResponse({ s: "err", m: "set_err", e: e.toString() }, m);
    }
  },

  // Send response
  TX(response) {
    try {
      const dataStr = JSON.stringify(response);



      if (dataStr.length <= this.mtu - 40) {
        NRF.updateServices({
          0xFFE0: {
            0xFFE1: { value: dataStr, notify: true }
          }
        });
        if (this.dbg) console.log("comms: peripheral TX:", response.id);
      }
      else {
        if (this.dbg) console.log("comms: peripheral response too large, chunking");
        this.sendChunkedResponse(dataStr, response.id);
      }
    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral TX error:", e);
    }
  },

  sendChunkedResponse(dataStr, messageId) {
    const chunks = ew.comm.common.createChunks(dataStr, messageId, 40);
    this.sendChunksSequentially(chunks, 0);
  },

  sendChunksSequentially(chunks, index) {
    if (index >= chunks.length) return;

    const chunk = chunks[index];
    const chunkStr = JSON.stringify(chunk);

    try {
      NRF.updateServices({
        0xFFE0: {
          0xFFE1: { value: chunkStr, notify: true }
        }
      });

      setTimeout(() => this.sendChunksSequentially(chunks, index + 1), 50);
    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral chunk send error:", e);
    }
  },

  // Get value from path
  getV(path, filter) {
    let target;
    let propPath;

    if (path.startsWith("ew.")) {
      target = ew.def;
      propPath = path.substring(3);
    }
    else {
      const parts = path.split('.');
      const appName = parts[0];

      if (ew.apps[appName] && ew.apps[appName].state) {
        target = ew.apps[appName].state;
        propPath = parts.slice(1).join('.');
      }
      else {
        throw new Error("App not found: " + appName);
      }
    }

    const p = propPath.split('.');
    let current = target;

    for (let i = 0; i < p.length; i++) {
      if (current && current[p[i]] !== undefined) {
        current = current[p[i]];
      }
      else {
        throw new Error("Path not found: " + p[i]);
      }
    }

    if (filter === "keys") {
      return typeof current === 'object' && current !== null ? Object.keys(current) : current;
    }
    else {
      return ew.comm.common.safe(current);
    }
  },

  // Set value at path
  setV(path, value) {
    let target;
    let propPath;

    if (path.startsWith("ew.")) {
      target = ew.def;
      propPath = path.substring(3);
    }
    else {
      const parts = path.split('.');
      const appName = parts[0];

      if (ew.apps[appName] && ew.apps[appName].state) {
        target = ew.apps[appName].state;
        propPath = parts.slice(1).join('.');
      }
      else {
        throw new Error("App not found: " + appName);
      }
    }

    const p = propPath.split('.');
    let current = target;

    for (let i = 0; i < p.length - 1; i++) {
      if (current && current[p[i]] !== undefined) {
        current = current[p[i]];
      }
      else {
        throw new Error("Path not found: " + p[i]);
      }
    }

    const lastProp = p[p.length - 1];
    if (current[lastProp] === undefined) {
      throw new Error("Property not found: " + lastProp);
    }

    const oldValue = current[lastProp];
    current[lastProp] = value;

    return { s: "ok", v: value };
  }
};


ew.comm.on('BTRX', ew.comm.prfr.RX);

ew.comm.btC = () => {
  ew.is.bt = 1;
  //ew.notify.alert("info", { "src": "BT", "title": "BT", "body": "CLIENT IN" }, 1);
  //E.setConsole(Bluetooth, { force: true });
  ew.comm.emit('BLE_con');
};
//
ew.comm.btD = () => {
  //if (ew.is.bt == 1 && ew.def.face.info) ew.notify.alert("info", { "src": "BT", "title": "BT", "body": "CLIENT OUT" }, 1);
  //E.setConsole(null, { force: true });
  ew.is.bt = 0;
  if (!ew.def.bt.uart) {
    //NRF.sleep();
    ew.is.btsl = 1;
  }
  ew.comm.emit('BLE_dis');

};


// --- init setup ----
NRF.setTxPower(ew.def.bt.rfTX);
NRF.on('disconnect', ew.comm.btD);
NRF.on('connect', ew.comm.btC);
ew.comm.updt();
ew.sys.on('hour', ew.comm.updt);





/*
// Remote File Transfer Object - Με σωστό debugging
ew.comm.remoteFile = (function() {
  var initialized = false;
  
  function handleNormalData(data) {
    var msg = data.trim();
    if (msg.startsWith("REQUEST_FILE:")) {
      var filename = msg.split(":")[1];
      try {
        var fileData = require("Storage").read(filename);
        if (fileData) {
          Bluetooth.println("FILE:" + filename + ":" + JSON.stringify(fileData));
        } else {
          Bluetooth.println("ERROR:File not found:" + filename);
        }
      } catch (e) {
        Bluetooth.println("ERROR:Read error:" + filename);
      }
    }
  }
  
  function initServer() {
    if (!initialized) {
      Bluetooth.on('data', handleNormalData);
      initialized = true;
    }
  }
  
  return {
    get: function(targetDevice, filename, callback) {
      console.log("1. Starting transfer to", targetDevice);
      
      NRF.connect(targetDevice).then(function(device) {
        console.log("2. Connected successfully");
        
        Bluetooth.println("REQUEST_FILE:" + filename);
        console.log("3. Request sent:", filename);
        
        var responseHandler = function(data) {
          var msg = data.trim();
          console.log("4. Received:", msg);
          
          if (msg.startsWith("FILE:" + filename)) {
            try {
              var fileData = msg.substr(5 + filename.length + 1);
              require("Storage").write(filename, JSON.parse(fileData));
              console.log("5. File saved successfully");
              if (callback) callback(null, "Success!");
            } catch (e) {
              console.log("5. ERROR Parsing:", e);
              if (callback) callback("Parse error", null);
            }
            Bluetooth.removeListener('data', responseHandler);
            NRF.disconnect();
          }
          else if (msg.startsWith("ERROR:")) {
            console.log("5. SERVER ERROR:", msg);
            Bluetooth.removeListener('data', responseHandler);
            if (callback) callback(msg, null);
            NRF.disconnect();
          }
        };
        
        Bluetooth.on('data', responseHandler);
        console.log("4. Listening for response...");
        
        setTimeout(function() {
          Bluetooth.removeListener('data', responseHandler);
          console.log("5. TIMEOUT - No response received");
          if (callback) callback("Timeout", null);
          NRF.disconnect();
        }, 10000);
        
      }).catch(function(err) {
        console.log("2. CONNECTION ERROR:", err);
        if (callback) callback("Connection failed", null);
      });
    },
    
    send: function() {
      initServer();
      console.log("File server ready");
    },
    
    disable: function() {
      if (initialized) {
        Bluetooth.removeListener('data', handleNormalData);
        initialized = false;
      }
    }
  };
})();

// Ενεργοποίηση server
ew.comm.remoteFile.send();

//ble_uart module
Modules.addCached("bleuart", function() {
  exports.connect = function(r) {
    var k, l, m, n, f, h = {
      write: function(a) { return new Promise(function b(g, e) { a.length ? (n.writeValue(a.substr(0, 20)).then(function() { b(g, e); }).catch(e), a = a.substr(20)) : g(); }); },
      disconnect: function() { return k.disconnect(); },
      eval: function(a) {
        return new Promise(function(c, g) {
          function e() {
            var d = b.indexOf("\n");
            if (0 <= d) {
              clearTimeout(p);
              f = p = void 0;
              var q = b.substr(0, d);
              try { c(JSON.parse(q)); }
              catch (t) { g(q); } b.length > d + 1 && h.emit("data", b.substr(d + 1));
            }
          }
          var b = "";
          var p = setTimeout(e,
            5E3);
          f = function(d) {
            b += d;
            0 <= b.indexOf("\n") && e();
          };
          h.write("\x03\x10Bluetooth.write(JSON.stringify(" + a + ")+'\\n')\n").then(function() {});
        });
      }
    };
    return r.gatt.connect().then(function(a) { k = a; return k.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e"); }).then(function(a) { l = a; return l.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e"); }).then(function(a) { n = a; return l.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e"); }).then(function(a) {
      m = a;
      m.on("characteristicvaluechanged", function(c) {
        c =
          E.toString(c.target.value.buffer);
        f ? f(c) : h.emit("data", c);
      });
      return m.startNotifications();
    }).then(function() { return h; });
  };
});

 */
