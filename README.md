##PoolTool

PoolTool is an online game for anybody.

The concept of the game is that users pay ingame (or potentially out of game) currency to purchase virtual tools. Users can then find 'pools' nearby which are represented on the map as a circle, these pools have health, types, reward amounts, and expirations. If the user is physically within the pool, they can use tools of types that match the pool to mine out it's recources, and get currency back as a reward. A connection through socket.io is opened up between the client and the server (which is specific to the pool), and interacts with a hash table that contains the game's state. Using web sockets and a hash table ensures that gameplay is as close to realtime as possible, this means that users can see other users nearby who are also mining the pool.
--

There are two sides to the app, a user side, and an admin side. Admins have the power to create pools around the world with the click of a button. Users and admins both have a view of a map that contains all pools. Users can login / authenticate through Google.
--

React is used on the front end, and a number of technologies are used on the backend (see package.json). The most notable of which are:
- PostGis: A Postgres extension that helps with all geolocation tasks.
- Socket.io: A popular web socket library for javascript.
- Knex.js: A javascript helper for Postgres.
