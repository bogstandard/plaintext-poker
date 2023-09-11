# plaintext-poker
Plain text texas hold 'em poker for copypasting into group chats.

Dealer's go to [plaintext-poker](http://bogstandard.github.io/plaintext-poker) to begin. 
You'll be asked how many players to deal for & then provided a set of links to each players
hands, a link to perform the flop and so on.

## Seedy Business
This uses a seeded `Math.random` to ensure that all players of the same game stay on the same deck 
without needing a back-end or database.

## Why?
Sometimes you migh (if you're crazy enough) want to play poker via text based chat, this provides a means 
of providing a dealer and players with secret hands from a shared deck in a copypastable format.
