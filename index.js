import fetch from "node-fetch";

export class FiveMServer {
  /**
   * @param {string} ip - The server IP address
   * @param {string|number} port - The server port (default 30120)
   * @param {object} options - Optional settings (timeout, cacheTTL)
   */
  constructor(ip, port = 30120, options = {}) {
    this.baseUrl = `http://${ip}:${port}`;
    this.timeout = options.timeout || 5000;
    this.cache = new Map();
    this.cacheTTL = options.cacheTTL || 60000;
  }

  async _request(endpoint) {
    const now = Date.now();
    
    // Return cached data if available and fresh
    if (this.cache.has(endpoint)) {
      const entry = this.cache.get(endpoint);
      if (now - entry.timestamp < this.cacheTTL) return entry.data;
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeout);
      
      const res = await fetch(`${this.baseUrl}/${endpoint}.json`, { signal: controller.signal });
      clearTimeout(id);

      if (!res.ok) return null;

      const data = await res.json();
      this.cache.set(endpoint, { data, timestamp: now });
      return data;
    } catch (err) {
      return null;
    }
  }



  /** Checks if the server is currently reachable */
  async isOnline() {
    const data = await this._request('dynamic');
    return data !== null;
  }

  /** Returns an array of all online player objects */
  async getPlayers() {
    return await this._request('players') || [];
  }

  /** Returns just the count of online players */
  async getPlayerCount() {
    const players = await this.getPlayers();
    return players.length;
  }

  /** Finds a specific player by their Server ID */
  async getPlayerById(id) {
    const players = await this.getPlayers();
    return players.find(p => p.id === parseInt(id)) || null;
  }

  /** Returns all server metadata (vars, resources, version) */
  async getServerInfo() {
    return await this._request('info');
  }

  /** Returns the max player capacity */
  async getMaxPlayers() {
    const data = await this._request('dynamic');
    return data ? data.sv_maxclients : null;
  }

  /** Checks if a specific resource is running on the server */
  async hasResource(resourceName) {
    const info = await this.getServerInfo();
    return info?.resources?.includes(resourceName) || false;
  }
}