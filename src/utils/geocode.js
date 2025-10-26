const request = require('postman-request')

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoibmFuZGluaTE2NSIsImEiOiJjbWgzaGF2dWcxdGl3MmtxMmo0OHVoM2FpIn0.U1xozx-8_O6xqr5WCQhw3g`

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Tidak dapat terhubung ke layanan lokasi!', undefined)
        } else if (!body.features || body.features.length === 0) {
            callback('Tidak dapat menemukan lokasi', undefined)
        } else {
            const data = body.features[0]
            callback(undefined, {
                latitude: data.center[1],
                longitude: data.center[0],
                location: data.place_name
            })
        }
    })
}

module.exports = geocode
