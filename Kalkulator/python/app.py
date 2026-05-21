#!/usr/bin/env python3
"""
Forest Dew Calculator — Python CLI (Standalone)
=================================================
Kalkulator mandiri tanpa dependensi eksternal.
Jalankan langsung: python calculator.py

Fitur:
  1. Aritmatika (+ - * / ^ √ %)
  2. Logika & Bitwise (AND OR XOR NAND NOR XNOR NOT SHIFT)
  3. Konversi Basis (Desimal ↔ Biner ↔ Oktal ↔ Heks)
  4. Konversi Suhu (Celsius, Fahrenheit, Kelvin, Rankine)
  5. Konversi Mata Uang (kurs statis)
  6. Faktorial, Permutasi, Kombinasi
"""

import math
import sys

# ─────────────────────────────────────────────────────────────
#  WARNA TERMINAL
# ─────────────────────────────────────────────────────────────

GREEN  = "\033[92m"
CYAN   = "\033[96m"
YELLOW = "\033[93m"
RED    = "\033[91m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RESET  = "\033[0m"

def g(s): return f"{GREEN}{s}{RESET}"
def c(s): return f"{CYAN}{s}{RESET}"
def y(s): return f"{YELLOW}{s}{RESET}"
def r(s): return f"{RED}{s}{RESET}"
def b(s): return f"{BOLD}{s}{RESET}"


# ─────────────────────────────────────────────────────────────
#  1. ARITMATIKA
# ─────────────────────────────────────────────────────────────

def menu_arithmetic():
    print(f"\n{b(c('═══ KALKULATOR ARITMATIKA ═══'))}")
    print("Operator: + - * / ** (pangkat) sqrt (akar) % (modulo)")
    print("Ketik 'q' untuk kembali.\n")

    while True:
        expr = input(f"  {g('>')} Ekspresi: ").strip()
        if expr.lower() == 'q':
            break
        try:
            # Ganti sqrt menjadi math.sqrt
            expr_safe = expr.replace("sqrt(", "math.sqrt(").replace("^", "**")
            result = eval(expr_safe, {"__builtins__": {}, "math": math})
            print(f"    {y('=')} {g(result)}\n")
        except ZeroDivisionError:
            print(f"    {r('Error: Pembagian dengan nol')}\n")
        except Exception as e:
            print(f"    {r(f'Error: {e}')}\n")


# ─────────────────────────────────────────────────────────────
#  2. LOGIKA / BITWISE
# ─────────────────────────────────────────────────────────────

BITWISE_OPS = {
    "1": ("AND",    lambda a, b: a & b),
    "2": ("OR",     lambda a, b: a | b),
    "3": ("XOR",    lambda a, b: a ^ b),
    "4": ("NAND",   lambda a, b: (~(a & b)) & 0xFFFFFFFF),
    "5": ("NOR",    lambda a, b: (~(a | b)) & 0xFFFFFFFF),
    "6": ("XNOR",   lambda a, b: (~(a ^ b)) & 0xFFFFFFFF),
    "7": ("NOT A",  lambda a, b: (~a) & 0xFFFFFFFF),
    "8": ("LSHIFT", lambda a, b: (a << 1) & 0xFFFFFFFF),
    "9": ("RSHIFT", lambda a, b: (a >> 1) & 0xFFFFFFFF),
}

def menu_logic():
    print(f"\n{b(c('═══ KALKULATOR LOGIKA & BITWISE ═══'))}")
    for k, (name, _) in BITWISE_OPS.items():
        print(f"  {k}. {name}")
    print("  q. Kembali\n")

    while True:
        choice = input(f"  {g('>')} Pilih operasi: ").strip()
        if choice.lower() == 'q':
            break
        if choice not in BITWISE_OPS:
            print(f"  {r('Pilihan tidak valid')}")
            continue

        name, fn = BITWISE_OPS[choice]
        try:
            a = int(input(f"  {g('>')} Nilai A (desimal): "))
            b_val = 0
            if choice not in ("7", "8", "9"):
                b_val = int(input(f"  {g('>')} Nilai B (desimal): "))
            result = fn(a, b_val)
            print(f"\n  Operasi  : {y(name)}")
            print(f"  Desimal  : {g(result)}")
            print(f"  Biner    : {g(format(result, '032b'))}")
            print(f"  Oktal    : {g(oct(result)[2:])}")
            print(f"  Heks     : {g(hex(result)[2:].upper())}\n")
        except ValueError:
            print(f"  {r('Error: Masukkan bilangan bulat')}\n")


# ─────────────────────────────────────────────────────────────
#  3. KONVERSI BASIS
# ─────────────────────────────────────────────────────────────

def menu_base_conversion():
    print(f"\n{b(c('═══ KONVERSI BASIS BILANGAN ═══'))}")
    print("  1. Desimal → semua basis")
    print("  2. Biner   → semua basis")
    print("  3. Oktal   → semua basis")
    print("  4. Heks    → semua basis")
    print("  q. Kembali\n")

    base_map = {"1": 10, "2": 2, "3": 8, "4": 16}
    base_name = {"1": "desimal", "2": "biner", "3": "oktal", "4": "heksadesimal"}

    while True:
        choice = input(f"  {g('>')} Pilih sumber: ").strip()
        if choice.lower() == 'q':
            break
        if choice not in base_map:
            print(f"  {r('Pilihan tidak valid')}\n")
            continue
        val_str = input(f"  {g('>')} Masukkan nilai {base_name[choice]}: ").strip()
        try:
            decimal = int(val_str, base_map[choice])
            print(f"\n  Desimal      : {g(decimal)}")
            print(f"  Biner        : {g(bin(decimal)[2:])}")
            print(f"  Oktal        : {g(oct(decimal)[2:])}")
            print(f"  Heksadesimal : {g(hex(decimal)[2:].upper())}\n")
        except ValueError:
            print(f"  {r('Error: Format tidak valid untuk basis tersebut')}\n")


# ─────────────────────────────────────────────────────────────
#  4. KONVERSI SUHU
# ─────────────────────────────────────────────────────────────

def to_celsius(value: float, unit: str) -> float:
    u = unit.upper()
    if u == "C": return value
    if u == "F": return (value - 32) * 5 / 9
    if u == "K": return value - 273.15
    if u == "R": return (value - 491.67) * 5 / 9
    raise ValueError(f"Satuan '{unit}' tidak dikenali")

def menu_temperature():
    print(f"\n{b(c('═══ KONVERSI SUHU ═══'))}")
    print("  Satuan: C (Celsius) | F (Fahrenheit) | K (Kelvin) | R (Rankine)")
    print("  Ketik 'q' untuk kembali.\n")

    while True:
        val_str = input(f"  {g('>')} Nilai suhu (atau 'q'): ").strip()
        if val_str.lower() == 'q':
            break
        unit = input(f"  {g('>')} Dari satuan (C/F/K/R): ").strip()
        try:
            value = float(val_str)
            c_val = to_celsius(value, unit)
            print(f"\n  Celsius     : {g(round(c_val, 6))} °C")
            print(f"  Fahrenheit  : {g(round(c_val * 9/5 + 32, 6))} °F")
            print(f"  Kelvin      : {g(round(c_val + 273.15, 6))} K")
            print(f"  Rankine     : {g(round((c_val + 273.15) * 9/5, 6))} °R\n")
        except (ValueError, TypeError) as e:
            print(f"  {r(f'Error: {e}')}\n")


# ─────────────────────────────────────────────────────────────
#  5. KONVERSI MATA UANG
# ─────────────────────────────────────────────────────────────

RATES = {
    "USD": 1.0,    "IDR": 16350.0, "EUR": 0.9210,
    "GBP": 0.7920, "JPY": 156.40,  "SGD": 1.3480,
    "MYR": 4.7200, "AUD": 1.5380,  "CNY": 7.2500,
    "SAR": 3.7500, "KRW": 1380.0,  "INR": 83.50,
    "THB": 36.20,  "PHP": 58.30,
}

def menu_currency():
    print(f"\n{b(c('═══ KONVERSI MATA UANG ═══'))}")
    print("  " + "  ".join(RATES.keys()))
    print(f"  {y('⚠ Kurs statis, bukan real-time')}")
    print("  Ketik 'q' untuk kembali.\n")

    while True:
        frm = input(f"  {g('>')} Dari (kode, mis. IDR): ").strip().upper()
        if frm == 'Q':
            break
        to  = input(f"  {g('>')} Ke   (kode, mis. USD): ").strip().upper()
        amt = input(f"  {g('>')} Jumlah               : ").strip()
        try:
            amount = float(amt)
            if frm not in RATES:
                print(f"  {r(f'Mata uang {frm} tidak tersedia')}\n")
                continue
            if to not in RATES:
                print(f"  {r(f'Mata uang {to} tidak tersedia')}\n")
                continue
            in_usd = amount / RATES[frm]
            result = in_usd * RATES[to]
            rate   = RATES[to] / RATES[frm]
            print(f"\n  {g(amount)} {frm}  =  {g(round(result, 4))} {to}")
            print(f"  Kurs: 1 {frm} = {g(round(rate, 6))} {to}\n")
        except ValueError:
            print(f"  {r('Error: Masukkan angka yang valid')}\n")


# ─────────────────────────────────────────────────────────────
#  6. FAKTORIAL, PERMUTASI, KOMBINASI
# ─────────────────────────────────────────────────────────────

def menu_factorial():
    print(f"\n{b(c('═══ FAKTORIAL & KOMBINATORIKA ═══'))}")
    print("  1. n!         — Faktorial")
    print("  2. P(n,r)     — Permutasi")
    print("  3. C(n,r)     — Kombinasi")
    print("  4. Tabel n!   — Tampilkan tabel faktorial")
    print("  q. Kembali\n")

    while True:
        choice = input(f"  {g('>')} Pilih: ").strip()
        if choice.lower() == 'q':
            break

        if choice == "1":
            try:
                n = int(input(f"  {g('>')} n = "))
                if n < 0: raise ValueError("n harus ≥ 0")
                result = math.factorial(n)
                digits = len(str(result))
                print(f"\n  {y(n)}! = {g(result)}")
                print(f"  ({digits} digit)\n")
            except (ValueError, TypeError) as e:
                print(f"  {r(f'Error: {e}')}\n")

        elif choice == "2":
            try:
                n = int(input(f"  {g('>')} n = "))
                r_val = int(input(f"  {g('>')} r = "))
                if r_val > n or r_val < 0 or n < 0:
                    raise ValueError("Harus 0 ≤ r ≤ n")
                result = math.factorial(n) // math.factorial(n - r_val)
                print(f"\n  P({y(n)},{y(r_val)}) = {g(result)}\n")
            except (ValueError, TypeError) as e:
                print(f"  {r(f'Error: {e}')}\n")

        elif choice == "3":
            try:
                n = int(input(f"  {g('>')} n = "))
                r_val = int(input(f"  {g('>')} r = "))
                if r_val > n or r_val < 0 or n < 0:
                    raise ValueError("Harus 0 ≤ r ≤ n")
                result = math.comb(n, r_val)
                print(f"\n  C({y(n)},{y(r_val)}) = {g(result)}\n")
            except (ValueError, TypeError) as e:
                print(f"  {r(f'Error: {e}')}\n")

        elif choice == "4":
            try:
                limit = int(input(f"  {g('>')} Tampilkan hingga n = (maks 30): "))
                limit = min(max(limit, 0), 30)
                print(f"\n  {'n':>4}  {'n!':}")
                print(f"  {'─'*4}  {'─'*40}")
                for i in range(limit + 1):
                    print(f"  {i:>4}  {g(math.factorial(i))}")
                print()
            except ValueError:
                print(f"  {r('Error: Masukkan angka')}\n")
        else:
            print(f"  {r('Pilihan tidak valid')}\n")


# ─────────────────────────────────────────────────────────────
#  MAIN MENU
# ─────────────────────────────────────────────────────────────

def main():
    print(f"""
{b(g('╔══════════════════════════════════════════╗'))}
{b(g('║'))}    🌿  {b('FOREST DEW CALCULATOR')}    🌿    {b(g('║'))}
{b(g('║'))}         Kalkulator Lengkap Python          {b(g('║'))}
{b(g('╚══════════════════════════════════════════╝'))}
""")

    MENUS = {
        "1": ("Aritmatika",              menu_arithmetic),
        "2": ("Logika & Bitwise",        menu_logic),
        "3": ("Konversi Basis Bilangan", menu_base_conversion),
        "4": ("Konversi Suhu",           menu_temperature),
        "5": ("Konversi Mata Uang",      menu_currency),
        "6": ("Faktorial & Kombinatorika", menu_factorial),
        "q": ("Keluar",                  None),
    }

    while True:
        print(f"{b(c('─── Menu Utama ───'))}")
        for k, (name, _) in MENUS.items():
            if k != 'q':
                print(f"  {y(k)}. {name}")
        print(f"  {y('q')}. Keluar\n")

        choice = input(f"  {g('>')} Pilih menu: ").strip().lower()

        if choice == 'q':
            print(f"\n{g('  Terima kasih! Sampai jumpa. 🌿')}\n")
            sys.exit(0)
        elif choice in MENUS and MENUS[choice][1]:
            MENUS[choice][1]()
        else:
            print(f"  {r('Pilihan tidak valid. Coba lagi.')}\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{g('  Dihentikan. Sampai jumpa! 🌿')}\n")
