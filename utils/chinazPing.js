const request = require('superagent')
const cheerio = require('cheerio')
const json5 = require('json5')
const { retry } = require('async')


function chinazPing (host, options) {
    return new Promise((resolve, reject) => {
        request.get('https://ping.chinaz.com/' + host)
        .then(res => {
            const $ = cheerio.load(res.text)
            const enkey = $('#enkey').val()
            const serverList = $('#speedlist .listw')

            console.log(`chinaz servers count: ${serverList.length}`)

            const taskList = []

            serverList.each((i, elem) => {
                const guid = $(elem).attr('id')
                const task = new Promise((childResolve) => {
                    retry(
                        { times: options.retryTime, interval: options.waittingInterval },
                        (retry_callback) => {
                            request.post('https://ping.chinaz.com/iframe.ashx?t=ping')
                                .type('form')
                                .send({
                                    guid,
                                    host: host,
                                    ishost: 0,
                                    isipv6: 0,
                                    checktype: 0,
                                    encode: enkey,
                                })
                                .then(res => {
                                    const resReg = res.text.match(/^\((.*)\)$/)
                                    const data = (resReg)? json5.parse(resReg[1]) : {}
                                    retry_callback((data.state != 1)? 'pending' : null, data)
                                })
                                .catch(err => {
                                    retry_callback(err)
                                })
                        }
                    )
                    .then(childResolve)
                    .catch(childResolve)
                })
                taskList.push(task)
            })

            Promise.all(taskList)
            .then(resluts => {
                resolve(
                    resluts
                    .filter(item => item.state == 1)
                    .map(item => item.result.ip)
                )
            })
        })
        .catch(reject)
    })
}

module.exports = chinazPing