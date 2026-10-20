ew.comm.init = function() {
  
  let service = function() {
    return {
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
              mitm: ew.def.bt.pair ? true : false,
              encrypted: ew.def.bt.pair ? true : false
            },
            write: {
              mitm: ew.def.bt.pair ? true : false,
              encrypted: ew.def.bt.pair ? true : false
            },
          },
          readable: true,
          notify: true,
          description: "eW"
        }
      }
    }

  };

  let secureMode = ew.def.bt.pair ? { passkey: ew.def.bt.code, mitm: 1, display: 1 } : {};
  NRF.setSecurity(secureMode);
  NRF.setScanResponse();
  NRF.setServices(ew.apps.ewtag?(ew.apps.ewtag.state.def.eTag?service():undefined):service(), { uart: (ew.def.bt.uart) ? true : false });

  ew.comm.updt();
}

ew.comm.updt = function() {

  let options = function() {
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

    return {
      name: (Array.isArray(ew.def.role) ? role[ew.def.role[0]][1] : role[ew.def.role][1]) + "-" + ew.def.name,
      showName: true,
      manufacturer: 0x0590,
      manufacturerData: [
        roleByte,
        (ew.def.bt.conn ? 1 : 0) | (ew.def.bt.uart ? 2 : 0) | ((phy.indexOf(ew.def.bt.phyA)) << 2) | ((txPower.indexOf(ew.def.bt.rfTX)) << 5), //bt info
        ew.sys.batt(1),
        ew.sys.batt() * 100 / 2 | 0,
        board.indexOf(process.env.BOARD) | ((ew.def.frce ? 1 : 0) << 4) //board type
      ],
      connectable: (ew.def.bt.conn ? true : false),
      scannable: (ew.def.bt.phyA === "1mbps" ? true : false),
      //whenConnected: true,
      phy: ew.def.bt.phyA,
      interval: ew.def.bt.intA
    };

  }

  try {
    NRF.setScanResponse();

    if (ew.def.bt.adv) {

      if (ew.apps.ewtag) {
        if (ew.apps.ewtag.state.addr) NRF.setAddress(ew.apps.ewtag.state.addr)
        //else NRF.setAddress(NRF.getAddress());
        else NRF.setAddress(`${NRF.getAddress()} random`);

        var packets = [];

        if (ew.apps.ewtag.state.def.eTag)
          packets.push({});

        if (ew.apps.ewtag.state.def.gTag)
          packets.push(ew.apps.ewtag.state.gPay);

        if (ew.apps.ewtag.state.def.iTag){
          ew.apps.ewtag.updt();
          packets.push(ew.apps.ewtag.state.iPay);
        }
        if (packets == []) return;

        NRF.setAdvertising(packets, options());

      }
      else
        NRF.setAdvertising({}, options());

      NRF.wake();
      if (ew.apps.ewtag && ew.apps.ewtag.state.def.iTag) NRF.setScanResponse([]);
      NRF.setTxPower(ew.def.bt.rfTX);
      
    }else NRF.sleep()
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
  binaryHeaderLength: 8,
  binaryMagic: 0x7E,
  binaryIDRanges: {
    watch: [0, 9],
    light: [10, 59],
    litterBox: [60, 79],
    blind: [80, 99],
    tag: [100, 119],
    pb: [120, 129],
    pir: [130, 139],
    other: [200, 255]
  },
  routing: {
    parent: null,
    children: [],
    peers: {},
    table: {},
    maxChildren: 2,

    addChild(peerId) {
      if (this.children.indexOf(peerId) !== -1) return true;
      if (this.children.length >= this.maxChildren) return false;
      this.children.push(peerId);
      return true;
    },

    removeChild(peerId) {
      this.children = this.children.filter(id => id !== peerId);
      this.clearRoutesByNextHop(peerId);
    },

    setParent(peerId) {
      this.parent = peerId;
    },

    clearParent() {
      this.parent = null;
    },

    getPeer(peerId) {
      return this.peers[peerId];
    },

    registerPeer(peerId, meta) {
      if (typeof peerId !== 'number' || peerId < 0 || peerId > 255) return;
      if (!this.peers[peerId]) {
        this.peers[peerId] = { role: null, name: null, ranges: [], lastSeen: Date.now() };
        if (this.parent === null) this.parent = peerId;
        else if (this.children.indexOf(peerId) === -1) this.addChild(peerId);
      }
      Object.assign(this.peers[peerId], meta, { lastSeen: Date.now() });
    },

    unregisterPeer(peerId) {
      if (typeof peerId !== 'number' || peerId < 0 || peerId > 255) return;
      delete this.peers[peerId];
      if (this.parent === peerId) this.parent = null;
      this.children = this.children.filter(id => id !== peerId);
      this.clearRoutesByNextHop(peerId);
    },

    refreshPeerRoutes(peerId, ranges, nextHopId, meta) {
      if (!Array.isArray(ranges) || ranges.length === 0) return;
      this.registerPeer(peerId, Object.assign({}, meta, { ranges: ranges }));
      this.clearRoutesByNextHop(nextHopId);
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (!Array.isArray(range) || range.length < 2) continue;
        this.addRouteRange(range[0], range[1], nextHopId);
      }
    },

    addRoute(targetId, nextHopId) {
      if (typeof targetId !== 'number' || targetId < 0 || targetId > 255) return;
      this.table[targetId] = nextHopId;
    },

    addRouteRange(start, end, nextHopId) {
      start = Math.max(0, start);
      end = Math.min(255, end);
      for (let t = start; t <= end; t++) {
        this.table[t] = nextHopId;
      }
    },

    removeRoute(targetId) {
      delete this.table[targetId];
    },

    removeRouteRange(start, end, nextHopId) {
      start = Math.max(0, start);
      end = Math.min(255, end);
      for (let t = start; t <= end; t++) {
        if (nextHopId === undefined || this.table[t] === nextHopId) {
          delete this.table[t];
        }
      }
    },

    removeRouteRanges(ranges, nextHopId) {
      if (!Array.isArray(ranges)) return;
      ranges.forEach(range => {
        if (Array.isArray(range) && range.length >= 2) {
          this.removeRouteRange(range[0], range[1], nextHopId);
        }
      });
    },

    clearRoutesByNextHop(nextHopId) {
      for (const targetId in this.table) {
        if (this.table[targetId] === nextHopId) {
          delete this.table[targetId];
        }
      }
    },

    getRouteRangesByNextHop(nextHopId) {
      const targets = [];
      for (const targetId in this.table) {
        if (this.table[targetId] === nextHopId) {
          targets.push(Number(targetId));
        }
      }
      targets.sort((a, b) => a - b);
      const ranges = [];
      let rangeStart = null;
      let rangeEnd = null;
      targets.forEach(t => {
        if (rangeStart === null) {
          rangeStart = t;
          rangeEnd = t;
          return;
        }
        if (t === rangeEnd + 1) {
          rangeEnd = t;
          return;
        }
        ranges.push([rangeStart, rangeEnd]);
        rangeStart = t;
        rangeEnd = t;
      });
      if (rangeStart !== null) ranges.push([rangeStart, rangeEnd]);
      return ranges;
    },

    getNextHop(targetId) {
      if (typeof targetId !== 'number' || targetId < 0 || targetId > 255) return undefined;
      return this.table[targetId];
    }
  },

  seenRouteMessages: {},
  routeMessageTimeout: 60000,

  hasSeenRouteMessage(msgId) {
    return !!this.seenRouteMessages[msgId];
  },

  markRouteMessageSeen(msgId) {
    if (!msgId) return;
    this.seenRouteMessages[msgId] = Date.now();
  },

  cleanupRouteMessages() {
    const now = Date.now();
    for (const id in this.seenRouteMessages) {
      if (now - this.seenRouteMessages[id] > this.routeMessageTimeout) {
        delete this.seenRouteMessages[id];
      }
    }
  },

  getRouteRanges(includeLocal) {
    const numbers = Object.keys(this.routing.table).map(Number).filter(n => n >= 0 && n <= 255);
    const localId = this.getBinaryID();
    if (includeLocal && numbers.indexOf(localId) === -1) {
      numbers.push(localId);
    }
    numbers.sort((a, b) => a - b);
    const ranges = [];
    let rangeStart = null;
    let rangeEnd = null;

    numbers.forEach(n => {
      if (rangeStart === null) {
        rangeStart = n;
        rangeEnd = n;
        return;
      }
      if (n === rangeEnd + 1) {
        rangeEnd = n;
        return;
      }
      ranges.push([rangeStart, rangeEnd]);
      rangeStart = n;
      rangeEnd = n;
    });

    if (rangeStart !== null) ranges.push([rangeStart, rangeEnd]);
    return ranges;
  },

  getBinaryID() {
    const role = Array.isArray(ew.def.role) ? ew.def.role[0] : ew.def.role;
    const name = String(ew.def.name || '');
    const digits = name.replace(/\D/g, '');
    const num = digits.length ? parseInt(digits, 10) : NaN;
    const id = isNaN(num) ? 0 : num;

    switch (role) {
      case 'watch':
        return Math.min(this.binaryIDRanges.watch[1], Math.max(this.binaryIDRanges.watch[0], id));
      case 'light':
        return Math.min(this.binaryIDRanges.light[1], Math.max(this.binaryIDRanges.light[0], id + this.binaryIDRanges.light[0]));
      case 'litterBox':
        return Math.min(this.binaryIDRanges.litterBox[1], Math.max(this.binaryIDRanges.litterBox[0], id + this.binaryIDRanges.litterBox[0]));
      case 'blind':
        return Math.min(this.binaryIDRanges.blind[1], Math.max(this.binaryIDRanges.blind[0], id + this.binaryIDRanges.blind[0]));
      case 'tag':
        return Math.min(this.binaryIDRanges.tag[1], Math.max(this.binaryIDRanges.tag[0], id + this.binaryIDRanges.tag[0]));
      case 'pb':
        return Math.min(this.binaryIDRanges.pb[1], Math.max(this.binaryIDRanges.pb[0], id + this.binaryIDRanges.pb[0]));
      case 'pir':
        return Math.min(this.binaryIDRanges.pir[1], Math.max(this.binaryIDRanges.pir[0], id + this.binaryIDRanges.pir[0]));
      default:
        return this.binaryIDRanges.other[0];
    }
  },

  toUint8Array(str) {
    return E.toUint8Array(str);
  },

  concatUint8Arrays(arrays) {
    let totalLength = 0;
    for (let i = 0; i < arrays.length; i++) {
      totalLength += arrays[i].length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (let i = 0; i < arrays.length; i++) {
      result.set(arrays[i], offset);
      offset += arrays[i].length;
    }
    return result;
  },

  parseBinaryChunk(packet) {
    const data = packet instanceof Uint8Array ? packet : new Uint8Array(packet.buffer || packet);
    if (data.length < this.binaryHeaderLength || data[7] !== this.binaryMagic) {
      throw new Error("Not a binary chunk");
    }
    return {
      targetId: data[0],
      sourceId: data[1],
      id: data[2],
      tc: data[3],
      i: data[4],
      type: data[5],
      reserved: data[6],
      d: data.subarray(this.binaryHeaderLength)
    };
  },

  assembleBinaryChunks(packet) {
    let chunk;
    try {
      chunk = this.parseBinaryChunk(packet);
    }
    catch (e) {
      if (this.dbg) console.log("comms: common invalid binary chunk", e);
      return null;
    }

    const messageId = `${chunk.targetId}:${chunk.sourceId}:${chunk.id}`;

    if (!this.chunkBuffer[messageId]) {
      this.chunkBuffer[messageId] = {
        chunks: [],
        total: chunk.tc,
        received: 0,
        timestamp: Date.now()
      };
      if (this.dbg) console.log("comms: common Created binary buffer for", messageId);
    }

    const buffer = this.chunkBuffer[messageId];

    if (buffer.chunks[chunk.i] === undefined) {
      buffer.chunks[chunk.i] = chunk.d;
      buffer.received++;
      if (this.dbg) console.log("comms: common Binary chunk", chunk.i, "received for", messageId, "- total:", buffer.received + "/" + buffer.total);
    }

    if (buffer.received === buffer.total) {
      if (this.dbg) console.log("comms: common All binary chunks received for", messageId);

      const fullData = this.concatUint8Arrays(buffer.chunks);
      delete this.chunkBuffer[messageId];
      return E.toString(fullData);
    }

    return null;
  },

  // Assemble chunks into complete message
  assembleChunk(chunk) {
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
    this.cleanupRouteMessages();
  },

  createBinaryChunks(dataStr, targetId, sourceId, messageId, type) {
    targetId = targetId || 0;
    sourceId = sourceId || 0;
    messageId = Number(messageId) & 0xFF;
    type = type || 0;

    const payload = this.toUint8Array(dataStr);
    const payloadSize = Math.max(1, this.mtu - this.binaryHeaderLength - 1);
    const totalChunks = Math.ceil(payload.length / payloadSize);

    if (totalChunks > 255) {
      throw new Error("Binary chunk count exceeds 255");
    }

    const chunks = [];
    if (this.dbg) console.log("comms: common Creating binary", totalChunks, "chunks for", messageId, "byte length:", payload.length, "payload size:", payloadSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * payloadSize;
      const end = Math.min(start + payloadSize, payload.length);
      const packet = new Uint8Array(this.binaryHeaderLength + (end - start));
      packet[0] = targetId;
      packet[1] = sourceId;
      packet[2] = messageId;
      packet[3] = totalChunks;
      packet[4] = i;
      packet[5] = type;
      packet[6] = 0;
      packet[7] = this.binaryMagic;
      packet.set(payload.subarray(start, end), this.binaryHeaderLength);
      chunks.push(packet);
    }

    return chunks;
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
  connections: {},
  peerConnectionKeys: {},
  rssi: 0,
  responses: {},
  timeout: 30000,
  isFullyConnected: false,

  getConnection(peerId) {
    if (peerId === undefined || peerId === null) return null;
    if (this.connections[peerId]) return this.connections[peerId];
    const key = this.peerConnectionKeys[peerId];
    return key ? this.connections[key] : null;
  },

  registerPeerConnection(peerId, routeKey) {
    if (typeof peerId !== 'number' || isNaN(peerId)) return;
    this.peerConnectionKeys[peerId] = routeKey;
    if (this.connections[routeKey]) {
      this.connections[routeKey].peerId = peerId;
    }
  },

  sendRawTo(peerId, data) {
    const connEntry = this.getConnection(peerId);
    if (!connEntry || !connEntry.char) {
      return Promise.reject("No connection for peer " + peerId);
    }
    return connEntry.char.writeValue(data);
  },

  sendRawChunks(chunks, peerId, index) {
    if (index >= chunks.length) return Promise.resolve();
    const connEntry = this.getConnection(peerId);
    if (!connEntry || !connEntry.char) {
      return Promise.reject("No connection for peer " + peerId);
    }
    return connEntry.char.writeValue(chunks[index]).then(() => {
      if (this.dbg) console.log("comms: master sent route chunk", index + 1, "/", chunks.length, "to", peerId);
      return this.sendRawChunks(chunks, peerId, index + 1);
    });
  },

  createRouteMessage(payload) {
    return JSON.stringify(payload);
  },

  sendRouteMessage(peerId, payload) {
    const dataStr = this.createRouteMessage(payload);
    const sourceId = ew.comm.common.getBinaryID();
    const numericPeerId = Number(peerId);
    const targetId = (!isNaN(numericPeerId) ? numericPeerId : 0);
    const chunks = ew.comm.common.createBinaryChunks(dataStr, targetId, sourceId, this.nextBinaryId(), 1);
    return this.sendRawChunks(chunks, peerId, 0);
  },

  getSenderId(routeKey) {
    if (typeof routeKey === 'number' && !isNaN(routeKey)) return routeKey;
    if (routeKey && this.peerConnectionKeys[routeKey] !== undefined) {
      return this.peerConnectionKeys[routeKey];
    }
    return null;
  },

  processIncomingRouteMessage(message, routeKey) {
    if (!message || typeof message !== 'object') return false;
    if (message.type === "PEER_REGISTER") {
      this.handlePeerRegister(message, routeKey);
      return true;
    }
    if (message.type === "ROUTE_ANNOUNCE") {
      this.handleRouteAnnounce(message, routeKey);
      return true;
    }
    if (message.type === "ROUTE_WITHDRAW") {
      this.handleRouteWithdraw(message, routeKey);
      return true;
    }
    if (message.type === "PEER_REGISTER_ACK") {
      if (this.dbg) console.log("comms: master peer register acknowledged from", this.getSenderId(routeKey));
      return true;
    }
    return false;
  },

  handlePeerRegister(m, routeKey) {
    const peerId = Number(m.peerId);
    if (isNaN(peerId)) return;
    const sourceId = this.getSenderId(routeKey) || peerId;
    ew.comm.common.routing.registerPeer(peerId, { role: m.role, name: m.name, ranges: Array.isArray(m.ranges) ? m.ranges : [] });
    ew.comm.common.routing.refreshPeerRoutes(peerId, Array.isArray(m.ranges) ? m.ranges : [], sourceId, { role: m.role, name: m.name });

    if (this.dbg) console.log("comms: master registered peer", peerId, m.role, m.name, "from", sourceId);

    const routeRanges = ew.comm.common.getRouteRanges(true);
    Object.keys(this.connections).forEach(routeKey => {
      const numericPeerId = Number(routeKey);
      if (!isNaN(numericPeerId) && numericPeerId === sourceId) return;
      this.sendRouteAnnounce(routeKey, ew.comm.common.getBinaryID(), routeRanges).catch(e => {
        if (this.dbg) console.log("comms: master announce failed:", e);
      });
    });
  },

  handleRouteAnnounce(m, routeKey) {
    if (!m.announceId || !Array.isArray(m.ranges) || (m.ttl !== undefined && m.ttl <= 0)) return;
    if (ew.comm.common.hasSeenRouteMessage(m.announceId)) return;
    ew.comm.common.markRouteMessageSeen(m.announceId);

    const sourceId = this.getSenderId(routeKey) || Number(m.originId);
    if (isNaN(sourceId)) return;

    ew.comm.common.routing.refreshPeerRoutes(sourceId, m.ranges, sourceId);
    if (this.dbg) console.log("comms: master route announce from", sourceId, m.ranges);
    this.propagateRouteMessage(m, sourceId);
  },

  handleRouteWithdraw(m, routeKey) {
    if (!m.announceId || !Array.isArray(m.ranges) || (m.ttl !== undefined && m.ttl <= 0)) return;
    if (ew.comm.common.hasSeenRouteMessage(m.announceId)) return;
    ew.comm.common.markRouteMessageSeen(m.announceId);

    const sourceId = this.getSenderId(routeKey) || Number(m.originId);
    if (isNaN(sourceId)) return;

    if (m.ranges.length) {
      ew.comm.common.routing.removeRouteRanges(m.ranges, sourceId);
    }
    else {
      ew.comm.common.routing.clearRoutesByNextHop(sourceId);
    }
    if (this.dbg) console.log("comms: master route withdraw from", sourceId, m.ranges);
    this.propagateRouteMessage(m, sourceId);
  },

  propagateRouteMessage(m, excludeSourceId) {
    if (!m.ttl) m.ttl = 10; // Initialize TTL if not provided
    if (m.ttl !== undefined) {
      m.ttl -= 1;
      if (m.ttl <= 0) return;
    }

    const forward = Object.assign({}, m);
    Object.keys(this.connections).forEach(routeKey => {
      const numericPeerId = Number(routeKey);
      if (numericPeerId === excludeSourceId) return;
      const connEntry = this.connections[routeKey];
      if (!connEntry || !connEntry.char) return;
      this.sendRouteMessage(routeKey, forward).catch(e => {
        if (this.dbg) console.log("comms: master propagate route to", routeKey, "failed:", e);
      });
    });
  },

  sendPeerRegister(peerId, peerInfo) {
    const payload = {
      type: "PEER_REGISTER",
      peerId: peerInfo.peerId,
      role: peerInfo.role,
      name: peerInfo.name,
      ranges: peerInfo.ranges || []
    };
    return this.sendRouteMessage(peerId, payload);
  },

  sendRouteAnnounce(peerId, originId, ranges) {
    const payload = {
      type: "ROUTE_ANNOUNCE",
      originId: originId,
      announceId: originId + ":" + Date.now() + ":" + Math.round(Math.random() * 1000),
      ranges: ranges || [],
      ttl: 10 // Max hops to prevent flooding in large networks
    };
    return this.sendRouteMessage(peerId, payload);
  },

  sendRouteWithdraw(peerId, originId, ranges) {
    const payload = {
      type: "ROUTE_WITHDRAW",
      originId: originId,
      announceId: originId + ":withdraw:" + Date.now() + ":" + Math.round(Math.random() * 1000),
      ranges: ranges || [],
      ttl: 10 // Max hops to prevent flooding
    };
    return this.sendRouteMessage(peerId, payload);
  },

  // Use common functions
  get mtu() { return ew.comm.common.mtu; },
  get dbg() { return ew.comm.common.dbg; },
  set dbg(value) { ew.comm.common.dbg = value; },
  _binaryIdCounter: 0,
  nextBinaryId() { return (this._binaryIdCounter = (this._binaryIdCounter + 1) & 0xFF) || 1; },

  // Connect to peripheral
  connect(deviceId, phy, mtu, rssiHandler, peerId) {
    const routeKey = (typeof peerId !== 'undefined' && peerId !== null) ? peerId : deviceId;
    const existing = this.connections[routeKey];
    if (existing && existing.connection && existing.connection.connected) {
      if (this.dbg) console.log("comms: master already connected to route", routeKey);
      return Promise.resolve(existing.connection);
    }

    if (mtu) ew.comm.common.mtu = mtu;
    phy = phy || "1mbps";
    this.isFullyConnected = false;

    return new Promise((resolve, reject) => {
      NRF.connect(deviceId, { minInterval: 7.5, maxInterval: 7.5, phy: phy }).then(c => {
        this.connection = c;
        c.device.on('gattserverdisconnected', (reason) => this.disconnected(reason));
        if (rssiHandler) c.setRSSIHandler((rssi) => { this.rssi = rssi; });
        this.connections[routeKey] = { connection: c, char: null };
        if (typeof peerId === 'number' && !isNaN(peerId)) {
          this.registerPeerConnection(peerId, routeKey);
        }
        return c.getPrimaryService("0xffe0");
      }).then(s => s.getCharacteristic("0xffe1")).then(ch => {
        this.char = ch;
        this.connections[routeKey].char = ch;
        ch.on('characteristicvaluechanged', e => {
          const buf = e.target.value.buffer || e.target.value;
          this.handleResponseChunk(buf, routeKey);
        });
        return ch.startNotifications();
      }).then(() => {
        if (typeof peerId === 'number' && !isNaN(peerId)) {
          const selfId = ew.comm.common.getBinaryID();
          const routeRanges = ew.comm.common.getRouteRanges(true);
          this.sendPeerRegister(peerId, {
            peerId: selfId,
            role: Array.isArray(ew.def.role) ? ew.def.role[0] : ew.def.role,
            name: ew.def.name || "",
            ranges: routeRanges
          }).catch(e => { if (this.dbg) console.log("comms: master peer register failed:", e); });
          this.sendRouteAnnounce(peerId, selfId, routeRanges).catch(e => { if (this.dbg) console.log("comms: master announce failed:", e); });
        }
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
  disconnect(peerId) {
    return new Promise((resolve) => {
      if (peerId) {
        const connEntry = this.connections[peerId];
        if (connEntry && connEntry.connection) {
          try {
            const removedRanges = ew.comm.common.routing.getRouteRangesByNextHop(peerId);
            const routeWithdraws = removedRanges.length ? Object.keys(this.connections).filter(k => k !== String(peerId)).map(targetKey => {
              const targetId = Number(targetKey);
              return this.sendRouteWithdraw(targetId, ew.comm.common.getBinaryID(), removedRanges).catch(() => {});
            }) : [];
            connEntry.connection.setRSSIHandler();
            connEntry.connection.disconnect();
            if (this.connection === connEntry.connection) {
              this.connection = null;
              this.char = null;
              this.isFullyConnected = false;
            }
            Promise.all(routeWithdraws).finally(() => {
              delete this.connections[peerId];
              ew.comm.common.routing.clearRoutesByNextHop(peerId);
              this.queue = [];
              this.isSending = false;
              this.responses = {};
              if (this.dbg) console.log("comms: master disconnected peer", peerId);
              resolve({ s: "ok", m: "DISCONNECTED" });
            });
            return;
          }
          catch (error) {
            if (this.dbg) console.log("comms: master disconnect failed", error);
            resolve({ s: "err", m: "FAILED" });
            return;
          }
        }
        resolve({ s: "ok", m: "NO_PEER" });
        return;
      }

      if (this.connection) {
        try {
          this.connection.setRSSIHandler();
          this.connection.disconnect();
          this.char = null;
          this.isFullyConnected = false;
          this.queue = [];
          this.isSending = false;
          this.responses = {};
          this.connections = {};
          ew.comm.common.routing.table = {};
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
    const binaryMsgId = this.nextBinaryId();
    const targetId = Number(item.command.targetId) || 0;
    const sourceId = Number(item.command.sourceId) || 0;
    const chunks = ew.comm.common.createBinaryChunks(dataStr, targetId, sourceId, binaryMsgId, 0);
    this.sendChunksSequentially(chunks, 0, item);
  },

  sendChunksSequentially(chunks, index, item) {
    if (index >= chunks.length) return;

    const chunk = chunks[index];

    this.char.writeValue(chunk).then(() => {
      if (this.dbg) console.log("comms: master sent binary chunk", index + 1, "/", chunks.length);
      if (item.command.noResponse && index + 1 === chunks.length) {
        if (this.tid.timeout) {
          clearTimeout(this.tid.timeout);
          this.tid.timeout = 0;
        }
        this.queue.shift();
        item.resolve({ s: "ok" });
        this.isSending = false;
        this.processQueue();
        return;
      }
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

  handleResponseChunk(data, routeKey) {
    try {
      if (typeof data !== 'string') {
        const bytes = data instanceof Uint8Array ? data : new Uint8Array(data.buffer || data);
        if (bytes.length > 7 && bytes[7] === ew.comm.common.binaryMagic) {
          const fullData = ew.comm.common.assembleBinaryChunks(bytes);
          if (fullData) this.handleResponse(fullData, routeKey);
          ew.comm.common.cleanupChunkBuffers();
          return;
        }
        data = E.toString(bytes);
      }

      const parsed = JSON.parse(data);
      if (parsed.t === "c") {
        const fullData = ew.comm.common.assembleChunk(parsed);
        if (fullData) this.handleResponse(fullData, routeKey);
        ew.comm.common.cleanupChunkBuffers();
      }
      else {
        this.handleResponse(data, routeKey);
      }
    }
    catch (e) {
      if (this.dbg) console.log("comms: master response parse error:", e);
    }
  },

  handleResponse(data, routeKey) {
    try {
      const response = JSON.parse(data);
      if (this.processIncomingRouteMessage(response, routeKey)) return;
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
      const batchId = ew.comm.common.generateId();
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
      if (typeof d !== 'string') {
        const bytes = d instanceof Uint8Array ? d : new Uint8Array(d.buffer || d);
        if (bytes.length > 7 && bytes[7] === ew.comm.common.binaryMagic) {
          this.handleBinaryChunk(bytes);
          return;
        }
        d = E.toString(bytes);
      }

      if (this.dbg) console.log("comms: peripheral RX:", d.substring(0, 100));

      // Direct processing for non-chunk messages
      if (!d.includes('"t":"c"')) {
        const m = JSON.parse(d);
        this.processMessage(m);
        return;
      }

      // Process chunk
      const chunk = JSON.parse(d);
      this.handleChunk(chunk);

    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral RX error:", e);
      this.TX({ s: "err", m: "parse_err", e: e.toString() });
    }
  },

  handleBinaryChunk(bytes) {
    if (this.dbg) console.log("comms: peripheral processing binary chunk", bytes.length);
    let chunkInfo;
    try {
      chunkInfo = ew.comm.common.parseBinaryChunk(bytes);
    }
    catch (e) {
      if (this.dbg) console.log("comms: peripheral binary parse error:", e);
      return;
    }

    const myId = ew.comm.common.getBinaryID();
    if (chunkInfo.targetId !== myId) {
      if (typeof chunkInfo.targetId !== 'number' || chunkInfo.targetId < 0 || chunkInfo.targetId > 255) {
        if (this.dbg) console.log("comms: peripheral invalid targetId", chunkInfo.targetId);
        return;
      }
      const nextHop = ew.comm.common.routing.getNextHop(chunkInfo.targetId);
      if (nextHop !== undefined) {
        if (this.dbg) console.log("comms: peripheral forwarding binary chunk to", nextHop);
        this.forwardBinaryChunk(bytes, nextHop);
      }
      else if (this.dbg) console.log("comms: peripheral no route for", chunkInfo.targetId);
      return;
    }

    const fullData = ew.comm.common.assembleBinaryChunks(bytes);

    if (fullData) {
      if (this.dbg) console.log("comms: peripheral binary chunk assembly complete");
      if (this.dbg) console.log("comms: peripheral FULL ASSEMBLED DATA:", fullData);
      try {
        const m = JSON.parse(fullData);
        this.processMessage(m, chunkInfo.sourceId);
      }
      catch (e) {
        if (this.dbg) console.log("comms: peripheral binary chunk parse error:", e);
        this.TX({ s: "err", m: "chunk_parse_err" });
      }
    }

    ew.comm.common.cleanupChunkBuffers();
  },

  forwardBinaryChunk(bytes, nextHopId) {
    const raw = bytes;
    ew.comm.mstr.sendRawTo(nextHopId, raw).catch(e => {
      if (this.dbg) console.log("comms: peripheral forward failed:", e);
    });
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

  processMessage(m, senderId) {
    if (this.dbg) console.log("comms: peripheral processing message:", m.id || m.type);

    const sendResponse = (data, originalMsg) => {
      const response = Object.assign({}, data);
      if (originalMsg && originalMsg.id) response.id = originalMsg.id;
      if (originalMsg && originalMsg.g) response.p = originalMsg.g;
      this.TX(response);
    };

    if (m.type === "PEER_REGISTER") {
      this.handlePeerRegister(m, senderId);
      sendResponse({ s: "ok" }, m);
    }
    else if (m.type === "ROUTE_ANNOUNCE") {
      this.handleRouteAnnounce(m, senderId);
      sendResponse({ s: "ok" }, m);
    }
    else if (m.type === "ROUTE_WITHDRAW") {
      this.handleRouteWithdraw(m, senderId);
      sendResponse({ s: "ok" }, m);
    }
    else if (m.type === "PEER_REGISTER_ACK") {
      if (this.dbg) console.log("comms: peripheral peer register acknowledged from", senderId);
      sendResponse({ s: "ok" }, m);
    }
    else if (m.eW || m.G) {
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

  handlePeerRegister(m, senderId) {
    const peerId = Number(m.peerId);
    if (isNaN(peerId)) return;
    ew.comm.common.routing.registerPeer(peerId, { role: m.role, name: m.name, ranges: Array.isArray(m.ranges) ? m.ranges : [] });
    const routeSource = (senderId !== undefined && senderId !== null) ? senderId : peerId;
    ew.comm.common.routing.refreshPeerRoutes(peerId, Array.isArray(m.ranges) ? m.ranges : [], routeSource, { role: m.role, name: m.name });

    if (this.dbg) console.log("comms: peripheral registered peer", peerId, m.role, m.name);

    const routeRanges = ew.comm.common.getRouteRanges(true);
    this.TX({ type: "ROUTE_ANNOUNCE", originId: ew.comm.common.getBinaryID(), announceId: ew.comm.common.getBinaryID() + ":" + Date.now(), ranges: routeRanges, ttl: 10 });
  },

  handleRouteAnnounce(m, senderId) {
    if (!m.announceId || !Array.isArray(m.ranges) || (m.ttl !== undefined && m.ttl <= 0)) return;
    if (ew.comm.common.hasSeenRouteMessage(m.announceId)) return;
    ew.comm.common.markRouteMessageSeen(m.announceId);

    const fromId = (senderId !== undefined && senderId !== null) ? senderId : Number(m.originId);
    if (isNaN(fromId)) return;

    ew.comm.common.routing.refreshPeerRoutes(fromId, m.ranges, fromId);
    if (this.dbg) console.log("comms: peripheral route announce from", fromId, m.ranges);
    this.propagateRouteMessage(m, fromId);
  },

  handleRouteWithdraw(m, senderId) {
    if (!m.announceId || !Array.isArray(m.ranges) || (m.ttl !== undefined && m.ttl <= 0)) return;
    if (ew.comm.common.hasSeenRouteMessage(m.announceId)) return;
    ew.comm.common.markRouteMessageSeen(m.announceId);

    const fromId = (senderId !== undefined && senderId !== null) ? senderId : Number(m.originId);
    if (isNaN(fromId)) return;

    if (m.ranges.length) {
      ew.comm.common.routing.removeRouteRanges(m.ranges, fromId);
    }
    else {
      ew.comm.common.routing.clearRoutesByNextHop(fromId);
    }
    if (this.dbg) console.log("comms: peripheral route withdraw from", fromId, m.ranges);
    this.propagateRouteMessage(m, fromId);
  },

  propagateRouteMessage(m, excludeSourceId) {
    if (!m.ttl) m.ttl = 10; // Initialize TTL if not provided
    if (m.ttl !== undefined) {
      m.ttl -= 1;
      if (m.ttl <= 0) return; // Stop propagation if TTL expired
    }
    const forward = Object.assign({}, m);

    if (ew.comm.mstr && ew.comm.mstr.connections) {
      Object.keys(ew.comm.mstr.connections).forEach(routeKey => {
        const connEntry = ew.comm.mstr.connections[routeKey];
        const numericPeerId = Number(routeKey);
        if (numericPeerId === excludeSourceId || !connEntry || !connEntry.char) return;
        ew.comm.mstr.sendRouteMessage(numericPeerId, forward).catch(e => {
          if (this.dbg) console.log("comms: peripheral propagate route to", numericPeerId, "failed:", e);
        });
      });
    }

    if (excludeSourceId !== null) {
      this.TX(forward);
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
    const numericId = parseInt(messageId, 36) || 0;
    const chunks = ew.comm.common.createBinaryChunks(dataStr, 0, 0, numericId, 0);
    this.sendChunksSequentially(chunks, 0);
  },

  sendChunksSequentially(chunks, index) {
    if (index >= chunks.length) return;

    const chunk = chunks[index];

    try {
      NRF.updateServices({
        0xFFE0: {
          0xFFE1: { value: chunk, notify: true }
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

ew.comm.btC = (addr) => {
  ew.is.bt = 1;
  //ew.notify.alert("info", { "src": "BT", "title": "BT", "body": "CLIENT IN" }, 1);
  //E.setConsole(Bluetooth, { force: true });
  ew.comm.emit('BLE_con', addr);

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
  if (ew.apps.ewtag && ew.apps.ewtag.state.def.iTag) NRF.setScanResponse([]);
  ew.comm.emit('BLE_dis');
};


// --- init setup ----
NRF.setTxPower(ew.def.bt.rfTX);
NRF.on('disconnect', ew.comm.btD);
NRF.on('connect', ew.comm.btC);
setTimeout(() => { ew.comm.init(); }, 2000);
ew.sys.on('hour', ew.comm.updt);


//ew.sys.on('hour', function() {console.log (Date())});


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
