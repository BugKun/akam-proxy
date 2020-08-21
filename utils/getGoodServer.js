const tcpp = require('tcp-ping')

module.exports = (ipList) => {
    return Promise.all(
        ipList
        .map(item => {
            return new Promise((resolve) => {
                tcpp.ping({ address: item, attempts: 3, timeout: 3000}, function(err, data) {
                    if(err) {
                        resolve({...err, alive: false, host: item})
                    } else {
                        resolve({...data, alive: !isNaN(data.avg), host: item})
                    }
                });
            })
        })
    )
    .then(results => {
        return results
        .filter(item => item.alive)
        .sort((prev, next) => {
            return prev.avg - next.avg
        })
    })
}