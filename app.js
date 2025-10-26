const path = require('path')
const express = require('express')
const hbs = require('hbs') 
const app = express()

// Tentukan lokasi folder public dan views
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// Set view engine ke hbs
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)


// Static folder
app.use(express.static(direktoriPublic))


// === Halaman utama ===
app.get('', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Nandini Putri'
  })
})


// === Halaman bantuan ===
app.get('/bantuan', (req, res) => {
  res.render('bantuan', {
    judul: 'Halaman Bantuan',
    teksBantuan: 'Ini adalah teks bantuan',
    nama: 'Nandini Putri'
  })
})

// === Halaman infoCuaca ===
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

const port = 4000

app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukkan lokasi yang ingin dicari'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

// === Halaman tentang ===
app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang Saya',
    nama: 'Nandini',
    layout: 'layouts/main'
  });
});



// === Halaman Berita ===
app.get('/berita', (req, res) => {
    const url = 'http://api.mediastack.com/v1/news?access_key=c896876bbfbada77838e9be1d9507b87'

    request({ url, json: true }, (error, response) => {
        if (error) {
            return res.render('berita', {
                judul: 'Berita',
                nama: 'Nandini Putri',
                berita: [],
                error: 'Tidak dapat terhubung ke layanan berita'
            })
        }

        res.render('berita', {
            judul: 'Berita',
            nama: 'Nandini Putri',
            berita: response.body.data
        })
    })
})

app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Nandini Putri',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Nandini Putri',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})

const request = require('postman-request')

// Jalankan server pada port 4000
app.listen(4000, () => {
  console.log('Server berjalan pada port 4000.')
})
