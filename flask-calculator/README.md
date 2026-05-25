# 🌿 ForestCalc — Kalkulator Web Canggih

![ForestCalc Banner](https://img.shields.io/badge/Flask-3.0-forestgreen?style=for-the-badge&logo=flask)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **Kalkulator Web Canggih** dengan tema *Forest Dew* yang elegan — mendukung Operasi Aritmatika, Operator Logika, dan Transformasi Bilangan lengkap dengan penjelasan langkah demi langkah.

---

## ✨ Fitur Utama

### 🔢 Operasi Aritmatika
| Operasi | Simbol | Keterangan |
|---------|--------|-----------|
| Penjumlahan | `+` | a + b |
| Pengurangan | `−` | a - b |
| Perkalian | `×` | a × b |
| Pembagian | `÷` | a / b |
| Perpangkatan | `xⁿ` | a^b |
| Akar Kuadrat | `√x` | √a |
| Modulus | `mod` | sisa bagi a mod b |
| Floor Division | `//` | pembagian bulat ke bawah |

### ⚡ Operator Logika (Bitwise)
| Operator | Keterangan |
|----------|-----------|
| AND | Bitwise AND (&) |
| OR | Bitwise OR (|) |
| NOT | Bitwise NOT (~) |
| XOR | Exclusive OR (^) |
| NAND | NOT(A AND B) |
| NOR | NOT(A OR B) |

### 🔄 Transformasi Bilangan
- **Konversi Basis**: Decimal ↔ Binary ↔ Octal ↔ Hexadecimal
- **Konversi Suhu**: Celsius ↔ Fahrenheit ↔ Kelvin ↔ Réaumur
- **Konversi Mata Uang**: IDR, USD, EUR, SGD, JPY, GBP, AUD, MYR *(rate statis)*
- **Faktorial**: n! hingga n=20
- **Deret Fibonacci**: F(n) hingga n=30

### 🎨 UI/UX
- **Tema Forest Dew** — palet hijau organik terinspirasi embun pagi
- **Dark / Light Mode** dengan simpan preferensi
- **Responsif** — ramah desktop, tablet, dan mobile
- **Hasil Detail**: rumus + langkah-langkah + riwayat
- **Animasi halus**: partikel embun, daun melayang, transisi smooth

---

## 🏗️ Struktur Proyek

```
flask-calculator/
├── app.py                  # Flask backend + semua logika perhitungan
├── requirements.txt        # Dependensi Python
├── README.md
├── templates/
│   └── index.html          # Template Jinja2 utama
└── static/
    ├── css/
    │   └── style.css       # Tema Forest Dew (light + dark)
    └── js/
        └── app.js          # Interaksi UI & fetch API
```

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- Python 3.10+
- pip

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/username/forestcalc.git
cd forestcalc

# 2. (Opsional) Buat virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 3. Install dependensi
pip install -r requirements.txt

# 4. Jalankan server
python app.py

# 5. Buka browser
# http://localhost:5000
```

---

## 🌐 Deployment ke Domain `.my.id`

### Opsi 1: VPS + Nginx + Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Jalankan dengan Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

**Konfigurasi Nginx** (`/etc/nginx/sites-available/forestcalc`):
```nginx
server {
    listen 80;
    server_name kalkulator-namaanda.my.id;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /path/to/flask-calculator/static;
        expires 30d;
    }
}
```

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/forestcalc /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Install SSL (HTTPS) gratis
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d kalkulator-namaanda.my.id
```

### Opsi 2: Railway / Render (Gratis)

**Procfile:**
```
web: gunicorn app:app
```

Deploy ke Railway:
```bash
railway init
railway up
```

Lalu arahkan domain `.my.id` ke URL Railway via DNS CNAME record.

### Opsi 3: PythonAnywhere (Gratis)

1. Upload semua file ke PythonAnywhere
2. Set WSGI file:
```python
import sys
sys.path.insert(0, '/home/username/flask-calculator')
from app import app as application
```
3. Konfigurasi domain custom di panel

---

## 🔌 API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/` | Halaman utama |
| POST | `/api/arithmetic` | Operasi aritmatika |
| POST | `/api/logic` | Operator logika |
| POST | `/api/transform` | Transformasi bilangan |
| GET | `/api/history` | Ambil riwayat |
| POST | `/api/history/clear` | Hapus riwayat |

### Contoh Request

```bash
# Aritmatika
curl -X POST http://localhost:5000/api/arithmetic \
  -H "Content-Type: application/json" \
  -d '{"operation":"power","a":2,"b":10}'

# Logika
curl -X POST http://localhost:5000/api/logic \
  -H "Content-Type: application/json" \
  -d '{"operation":"xor","a":12,"b":7}'

# Fibonacci
curl -X POST http://localhost:5000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"category":"fibonacci","value":15}'
```

### Contoh Response

```json
{
  "result": 1024,
  "formula": "2.0^10.0 = 1024.0",
  "steps": [
    "Perpangkatan: 2.0 dipangkatkan 10.0",
    "2.0^10.0",
    "Hasil: 1024"
  ]
}
```

---

## 🎨 Desain — Forest Dew Theme

Palet warna terinspirasi hutan tropis dan embun pagi:

| Token | Light | Dark |
|-------|-------|------|
| Background | `#f0f7f0` | `#0d1f12` |
| Card | `#ffffff` | `#182b1e` |
| Accent Primary | `#2d7a4f` | `#4cbb7c` |
| Accent Secondary | `#56b87a` | `#6fd494` |
| Text Primary | `#1a3320` | `#d4f0de` |

**Tipografi:**
- Display: `Playfair Display` (serif elegan)
- Monospace: `DM Mono` (formula & kode)
- Body: `Nunito` (ramah dan modern)

---

## 📋 Konversi Mata Uang — Rate Statis

> Rate diperbarui terakhir: Januari 2025

| Mata Uang | Rate per 1 IDR |
|-----------|----------------|
| USD | 0.000063 |
| EUR | 0.000058 |
| SGD | 0.000085 |
| JPY | 0.0094 |
| GBP | 0.000050 |
| AUD | 0.000097 |
| MYR | 0.000296 |

---

## 🛠️ Teknologi

- **Backend**: Python 3.x + Flask 3.0
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript + Jinja2
- **Fonts**: Google Fonts (Playfair Display, DM Mono, Nunito)
- **Deployment**: Nginx + Gunicorn / Railway / PythonAnywhere

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan pendidikan dan komersial.

---

## 👤 Penulis

**[Nama Mahasiswa]**  
NIM: [NIM]  
Program Studi: [Prodi]  
Universitas: [Nama Universitas]

---




