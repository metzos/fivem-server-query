# FiveM Server Query

A class-based Node.js client for querying FiveM server data. Includes built-in caching and health checks.

## Usage

```javascript
import { FiveMServer } from 'fivem-server-query';

// Initialize the server once
const server = new FiveMServer("127.0.0.1", 30120); // Type YOUR server's IP & PORT

// Check server status
if (await server.isOnline()) {
    const count = await server.getPlayerCount();
    const max = await server.getMaxPlayers();
    console.log(`Server Status: ${count}/${max} players online.`);
}

// Search for a specific player
const player = await server.getPlayerById(12);
console.log(player ? `Player 12 is: ${player.name}` : "Player not found");
```


## All Methods

* isOnline(): Returns true if the server responds.

* getPlayers(): Returns the full array of player objects.

* getPlayerCount(): Returns the number of players online.

* getPlayerById(id): Returns a specific player object.

* getServerInfo(): Returns resources, version, and server variables.

* getMaxPlayers(): Returns the server slots.

* hasResource(name): Returns true if a specific resource is started.
