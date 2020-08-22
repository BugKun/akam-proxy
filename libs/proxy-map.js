

module.exports = (mapper, options) => {
    const { hostname, port } = options
    const result = options

    if(hostname == mapper.originalHost) {
        result.hostname = mapper.host
    }

    if(hostname !== result.hostname) {
        console.log(`proxy request: ${hostname}:${port} => ${result.hostname}:${result.port}`)
    }

    return result
}