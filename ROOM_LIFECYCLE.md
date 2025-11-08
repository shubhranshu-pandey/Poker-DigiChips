# Room Lifecycle & Cleanup

## What Happens When a Room Gets Empty?

### Automatic Room Deletion

When the last player leaves a room, the room is **automatically deleted** from Redis.

### Scenarios

#### 1. Player Clicks "Exit"

- Player leaves the room explicitly
- Their data is removed from the room
- If they were the last player → room is deleted
- Other players see the updated player list in real-time

#### 2. Player Disconnects (closes browser/loses connection)

- Socket disconnect event is triggered automatically
- Backend detects the disconnection
- Player is automatically removed from the room
- If they were the last player → room is deleted
- Other players see the updated player list

#### 3. Player Refreshes Page

- Counts as disconnect + reconnect
- Player is removed from old session
- Must rejoin the room with the same Room ID
- Gets a new auto-generated Player ID

### Room Data Cleanup

**What gets deleted:**

- All player data (names, chips, bets)
- Pot amount
- Game state (dealer, current bet, etc.)
- Room configuration

**Redis Behavior:**

- Rooms have 24-hour expiry by default
- Empty rooms are deleted immediately
- No orphaned data left behind

### Room Persistence

**Rooms persist when:**

- At least 1 player is connected
- Players can leave and rejoin using the Room ID
- Room data is stored in Redis

**Rooms are deleted when:**

- All players have left
- 24 hours have passed (Redis expiry)
- Server restarts (Redis data is in-memory)

### Best Practices

**For Players:**

- Save your Room ID if you want to rejoin
- Don't refresh the page (you'll need to rejoin)
- Use the "Exit" button to leave cleanly

**For Room Hosts:**

- Share the Room ID with all players
- First player to join creates the room
- Room stays alive as long as someone is connected

### Technical Details

**Backend Tracking:**

- Socket ID → Player ID + Room ID mapping
- Automatic cleanup on disconnect
- Real-time updates to all connected players

**Redis Storage:**

- Key format: `room:{roomId}`
- TTL: 86400 seconds (24 hours)
- Deleted immediately when empty

**Socket Events:**

- `join-room` - Creates or joins room
- `leave-room` - Explicit leave
- `disconnect` - Automatic cleanup
- `room-updated` - Broadcast to all players
