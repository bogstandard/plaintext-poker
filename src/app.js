// Deps
const Deck = require('card-deck')
const seedrandom = require('seedrandom')

const run = () => {

    const rdmSeed = (Math.random() + 1).toString(36).substring(7)

    // hotwire console log to document.write (forgive me)
    console = {}
    console.log = (x) => {
        document.write(`<pre>${x}</pre>`)
    }

    // useful formatting methods
    const linkify = (x, s = seed) => `<a href="./?${s}:${x}">${x}</a>`
    const gatekeep = (warning, x) => `<details><summary>${warning}</summary>${x}</details>`
    const homeLink = `<a href="./">here</a>`

    // home page, print and return early!
    if (window.location.search.indexOf('?')) {
        console.log(`Welcome to plaintext texas hold em, want to deal a game? Here's your links:`)
        
        let i = 1
        while(i++ < 7)
            console.log(linkify(`tx-begin-for-${i}`, rdmSeed))


        return
    }

    const [seed, request] = window.location.search.slice(1).split(':')

    // intentionally override Math.random
    // see https://www.npmjs.com/package/seedrandom
    Math.seedrandom = seedrandom
    Math.seedrandom(seed)

    // Deck Building
    // Adapted from codeKonami/poker-hand/blob/master/test/complete.js
    const totalCards = 52
    const possibleCards = {
        cardOrder: [
            'A',
            'K',
            'Q',
            'J',
            'T',
            '9',
            '8',
            '7',
            '6',
            '5',
            '4',
            '3',
            '2',
        ],
        suits: ['S', 'H', 'D', 'C'],
    }
    const cards = [...Array(totalCards)].map((_, i) => {
        return (
            possibleCards.cardOrder[i % possibleCards.cardOrder.length] +
            possibleCards.suits[i % possibleCards.suits.length]
        );
    })
    const deck = new Deck(cards)
    deck.shuffle()

    let amountToDiscard = 0
    let amountToDraw = 0


    // texas hold em requests:
    // tx-begin-{totalPlayers}
    // tx-hand-{player}-of-{totalPlayers}
    // tx-flop-for-{totalPlayers}
    // tx-turn-for-{totalPlayers}
    // tx-river-for-{totalPlayers}

    const chunks = request.split('-')

    const drawn = []
    let out = []

    // begin texas hold em handling
    if (request.startsWith('tx-begin-for')) {
        let totalPlayers = ~~chunks[3]
        let p = totalPlayers
        while (p--)
            out.push(linkify(`tx-hand-${p + 1}-of-${totalPlayers}`))

        out = out.reverse()

        out.unshift('Welcome to plaintext texas hold em, Dealer, below are the links to the players hands.', '\n')
        // hand links here..
        out.push('\n', `Dealer: perform the flop using this link: ${linkify(`tx-flop-for-${totalPlayers}`)}`)
    }

    if (request.startsWith('tx-hand')) {
        const player = ~~chunks[2]

        // discard ; burn card + any previous players hands
        amountToDiscard = 1 + ((player - 1) * 2)
        amountToDraw = 2

        deck.drawFromBottom(amountToDiscard)
        drawn.push(...deck.drawFromBottom(amountToDraw))

        out.push(gatekeep(`These cards are meant for player ${player}, tap to confirm that's you.`, `Your dealt cards: ${drawn.join(' ')}`))
    }

    if (request.startsWith('tx-flop-for') || request.startsWith('tx-turn-for') || request.startsWith('tx-river-for')) {
        const totalPlayers = ~~chunks[3]

        // discard ; burn card + players deals + flop burn
        amountToDiscard = 1 + (totalPlayers * 2) + 1
        amountToDraw = 3

        deck.drawFromBottom(amountToDiscard)
        drawn.push(...deck.drawFromBottom(amountToDraw))

        if (request.startsWith('tx-flop-for')) {
            out.push(`Flop cards: ${drawn.join(' ')}`)
            out.push('\n', `Dealer: perform the turn using this link: ${linkify(`tx-turn-for-${totalPlayers}`)}`)
        }
    }

    if (request.startsWith('tx-turn-for') || request.startsWith('tx-river-for')) {
        const totalPlayers = ~~chunks[3]

        // discard ; burn card + players deals + flop burn + flop+ turn burn
        amountToDiscard = 1 + (totalPlayers * 2) + 1 + 3 + 1
        amountToDraw = 1

        deck.drawFromBottom(amountToDiscard)
        drawn.push(deck.drawFromBottom(amountToDraw))

        if (request.startsWith('tx-turn-for')) {
            out.push(`Turn cards: ${drawn.join(' ')}`)
            out.push('\n', `Dealer: perform the river using this link: ${linkify(`tx-river-for-${totalPlayers}`)}`)
        }
    }

    if (request.startsWith('tx-river-for')) {
        const totalPlayers = ~~chunks[3]

        // discard ; burn card + players deals + flop burn + flop + turn burn + turn + river burn
        amountToDiscard = 1 + (totalPlayers * 2) + 1 + 3 + 1 + 1 + 1
        amountToDraw = 1

        deck.drawFromBottom(amountToDiscard)
        drawn.push(deck.drawFromBottom(amountToDraw))

        if (request.startsWith('tx-river-for')) {
            out.push(`River cards: ${drawn.join(' ')}`)
            out.push('\n', `Dealer: start a new hand using this link: ${linkify(`tx-begin-for-${totalPlayers}`, rdmSeed)}`)
            out.push('\n', `Or play with a different number of players: ${homeLink}`)
        }
    }

    out = out.join('\n')
    console.log(out)

}

run()