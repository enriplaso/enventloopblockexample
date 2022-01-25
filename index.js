const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3000

app.get('/health', (req, res) => {
    res.send('OK')
})

app.get('/block-event-loop', async (req, res) => {
    let hash = crypto.createHash('sha256')
    for (let i = 0; i < 30e6; i++) {
        await hash.update("anyString")
    }
    res.send('Finished long running task')
})

app.get('/not-block-event-loop-try', async (req, res) => {
    let hash = crypto.createHash('sha256')
    for (let i = 0; i < 10e6; i++) {
        await hash.update("anyString")
        setTimeout(() => { }, 0) // Should not work here
    }
    res.send('Finished long running task')
})

app.get('/not-block-event-loop', async (req, res) => {
    let hash = crypto.createHash('sha256')
    const breath = async iteration => new Promise(resolve => setImmediate(() => { console.log("event loop i: " + iteration); resolve(); }))
    for (let i = 0; i < 10e6; i++) {
        await hash.update("anyString")
        await breath(i)
    }
    res.send('Finished long running task')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})