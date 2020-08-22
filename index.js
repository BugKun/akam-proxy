const proxy = require('./libs/proxy')
const fs = require('fs')
const json5 = require('json5')
const chinazPing = require('./utils/chinazPing')
const getGoodServer = require('./utils/getGoodServer')
const config = json5.parse(fs.readFileSync('./config.json5', 'utf-8'))

const ipListText = fs.readFileSync('ip_list.txt', 'utf-8')
const ipList = ipListText.split(/\r\n|\r|\n/)

let best = {host: ipList[0], avg: Number.MAX_SAFE_INTEGER, originalHost: config.host}

function refreshBest(ipList) {
    console.log('Pinging ipList')
    getGoodServer(ipList)
    .then(goodList => {
        if(goodList.length) {
            best.host = goodList[0].host
            best.avg = goodList[0].avg
            console.log(`The best server is ${best.host} which delay is ${best.avg}ms`)
        } else {
            console.log(`Could not find any available server`)
        }
    })
}

function refreshIpList() {
    chinazPing(config.host, {times: config.refreshIpList.retry.time, interval: config.refreshIpList.retry.interval})
    .then(res => {
        const sumIpList = Array.from(
            new Set(
                [...ipList, ...res]
                // remove ipv6 addresses and empty addresses
                .filter(item => !!item && !/\:/.test(item))
            )
        )
        console.log(`available servers count: ${sumIpList.length}`)
        if(config.saveChinazResult) {
            fs.writeFile('./ip_list.txt', sumIpList.join('\n'), 'utf-8', (error) => {
                if(!error) {
                    console.log(`save chinaz results successfully`)
                }
            })
        }
        refreshBest(sumIpList)
    })
    .catch(err => {
        console.log('get chinaz results error:', err)
        refreshBest(sumIpList)
    })
}

refreshIpList()
setInterval(refreshBest, config.refreshInterval * 1000)
setInterval(refreshIpList, config.refreshIpList.interval * 1000)

proxy(best, config.port)