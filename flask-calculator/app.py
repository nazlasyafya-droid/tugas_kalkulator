from flask import Flask, render_template, request, jsonify, session
import math
import json

app = Flask(__name__)
app.secret_key = 'forest-dew-calculator-2024'

# Static currency rates (IDR base)
CURRENCY_RATES = {
    'IDR': 1,
    'USD': 0.000063,
    'EUR': 0.000058,
    'SGD': 0.000085,
    'JPY': 0.0094,
    'GBP': 0.000050,
    'AUD': 0.000097,
    'MYR': 0.000296,
}

@app.route('/')
def index():
    if 'history' not in session:
        session['history'] = []
    return render_template('index.html')

@app.route('/api/arithmetic', methods=['POST'])
def arithmetic():
    data = request.get_json()
    op = data.get('operation')
    a = data.get('a')
    b = data.get('b')
    
    try:
        a = float(a)
        if b is not None:
            b = float(b)
        
        result = None
        formula = ''
        steps = []
        
        if op == 'add':
            result = a + b
            formula = f'{a} + {b} = {result}'
            steps = [
                f'Penjumlahan: {a} + {b}',
                f'Hasil: {result}'
            ]
        elif op == 'subtract':
            result = a - b
            formula = f'{a} − {b} = {result}'
            steps = [
                f'Pengurangan: {a} − {b}',
                f'Hasil: {result}'
            ]
        elif op == 'multiply':
            result = a * b
            formula = f'{a} × {b} = {result}'
            steps = [
                f'Perkalian: {a} × {b}',
                f'Hasil: {result}'
            ]
        elif op == 'divide':
            if b == 0:
                return jsonify({'error': 'Pembagi tidak boleh nol!'})
            result = a / b
            formula = f'{a} ÷ {b} = {result}'
            steps = [
                f'Pembagian: {a} ÷ {b}',
                f'Hasil: {result}'
            ]
        elif op == 'power':
            result = a ** b
            formula = f'{a}^{b} = {result}'
            steps = [
                f'Perpangkatan: {a} dipangkatkan {b}',
                f'{a}^{b} = {a} × {a} (sebanyak {int(b)} kali)' if b == int(b) and b > 0 and b <= 5 else f'{a}^{b}',
                f'Hasil: {result}'
            ]
        elif op == 'sqrt':
            if a < 0:
                return jsonify({'error': 'Akar bilangan negatif tidak valid!'})
            result = math.sqrt(a)
            formula = f'√{a} = {result}'
            steps = [
                f'Akar Kuadrat dari {a}',
                f'√{a} = {a}^(1/2)',
                f'Hasil: {result}'
            ]
        elif op == 'modulus':
            if b == 0:
                return jsonify({'error': 'Pembagi tidak boleh nol!'})
            result = a % b
            formula = f'{a} mod {b} = {result}'
            quotient = int(a // b)
            steps = [
                f'Modulus (sisa bagi): {a} mod {b}',
                f'{a} = {b} × {quotient} + {result}',
                f'Sisa pembagian: {result}'
            ]
        elif op == 'floor_div':
            if b == 0:
                return jsonify({'error': 'Pembagi tidak boleh nol!'})
            result = int(a // b)
            formula = f'{a} // {b} = {result}'
            steps = [
                f'Floor Division: {a} ÷ {b}',
                f'Hasil desimal: {a/b:.4f}',
                f'Dibulatkan ke bawah: ⌊{a/b:.4f}⌋ = {result}'
            ]
        
        # Format result
        if result is not None:
            if result == int(result) and op not in ['divide']:
                result_display = int(result)
            else:
                result_display = round(result, 8)
            
            entry = {
                'category': 'Aritmatika',
                'formula': formula,
                'result': str(result_display)
            }
            save_history(entry)
            
            return jsonify({
                'result': result_display,
                'formula': formula,
                'steps': steps
            })
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
    return jsonify({'error': 'Operasi tidak valid'})


@app.route('/api/logic', methods=['POST'])
def logic():
    data = request.get_json()
    op = data.get('operation')
    a = data.get('a')
    b = data.get('b')
    
    try:
        a_val = int(a)
        
        result = None
        formula = ''
        steps = []
        
        if op == 'and':
            b_val = int(b)
            result = a_val & b_val
            formula = f'{a_val} AND {b_val} = {result}'
            steps = [
                f'Operasi AND (bitwise): {a_val} & {b_val}',
                f'Biner A: {bin(a_val)} ({a_val})',
                f'Biner B: {bin(b_val)} ({b_val})',
                f'AND: bit 1 hanya jika keduanya 1',
                f'Hasil: {bin(result)} = {result}'
            ]
        elif op == 'or':
            b_val = int(b)
            result = a_val | b_val
            formula = f'{a_val} OR {b_val} = {result}'
            steps = [
                f'Operasi OR (bitwise): {a_val} | {b_val}',
                f'Biner A: {bin(a_val)} ({a_val})',
                f'Biner B: {bin(b_val)} ({b_val})',
                f'OR: bit 1 jika salah satu atau keduanya 1',
                f'Hasil: {bin(result)} = {result}'
            ]
        elif op == 'not':
            # Use 8-bit NOT for display
            result = ~a_val
            formula = f'NOT {a_val} = {result}'
            steps = [
                f'Operasi NOT (bitwise): ~{a_val}',
                f'Biner A: {bin(a_val)}',
                f'NOT: membalik semua bit',
                f'Hasil: {result}'
            ]
        elif op == 'xor':
            b_val = int(b)
            result = a_val ^ b_val
            formula = f'{a_val} XOR {b_val} = {result}'
            steps = [
                f'Operasi XOR (bitwise): {a_val} ^ {b_val}',
                f'Biner A: {bin(a_val)} ({a_val})',
                f'Biner B: {bin(b_val)} ({b_val})',
                f'XOR: bit 1 jika bit berbeda',
                f'Hasil: {bin(result)} = {result}'
            ]
        elif op == 'nand':
            b_val = int(b)
            result = ~(a_val & b_val)
            formula = f'{a_val} NAND {b_val} = {result}'
            steps = [
                f'Operasi NAND: NOT(A AND B)',
                f'Langkah 1 - AND: {a_val} & {b_val} = {a_val & b_val}',
                f'Langkah 2 - NOT: ~{a_val & b_val} = {result}',
                f'Hasil: {result}'
            ]
        elif op == 'nor':
            b_val = int(b)
            result = ~(a_val | b_val)
            formula = f'{a_val} NOR {b_val} = {result}'
            steps = [
                f'Operasi NOR: NOT(A OR B)',
                f'Langkah 1 - OR: {a_val} | {b_val} = {a_val | b_val}',
                f'Langkah 2 - NOT: ~{a_val | b_val} = {result}',
                f'Hasil: {result}'
            ]
        
        if result is not None:
            entry = {
                'category': 'Logika',
                'formula': formula,
                'result': str(result)
            }
            save_history(entry)
            
            return jsonify({
                'result': result,
                'formula': formula,
                'steps': steps
            })
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
    return jsonify({'error': 'Operasi tidak valid'})


@app.route('/api/transform', methods=['POST'])
def transform():
    data = request.get_json()
    category = data.get('category')
    
    try:
        if category == 'base':
            value = data.get('value', '').strip()
            from_base = data.get('from_base')
            
            # Convert to decimal first
            base_map = {'decimal': 10, 'binary': 2, 'octal': 8, 'hex': 16}
            from_b = base_map.get(from_base, 10)
            
            decimal_val = int(value, from_b)
            
            results = {
                'decimal': str(decimal_val),
                'binary': bin(decimal_val)[2:],
                'octal': oct(decimal_val)[2:],
                'hex': hex(decimal_val)[2:].upper()
            }
            
            steps = [
                f'Nilai input: {value} (basis {from_b})',
                f'Konversi ke Desimal: {decimal_val}',
                f'Desimal → Biner: {results["binary"]}',
                f'Desimal → Oktal: {results["octal"]}',
                f'Desimal → Heksadesimal: {results["hex"]}'
            ]
            
            formula = f'{value} ({from_base}) → Dec:{results["decimal"]}, Bin:{results["binary"]}, Oct:{results["octal"]}, Hex:{results["hex"]}'
            
            entry = {'category': 'Konversi Basis', 'formula': formula, 'result': f'Dec: {results["decimal"]}'}
            save_history(entry)
            
            return jsonify({'results': results, 'steps': steps, 'formula': formula})
        
        elif category == 'temperature':
            value = float(data.get('value'))
            from_unit = data.get('from_unit')
            
            # Convert to Celsius first
            if from_unit == 'celsius':
                celsius = value
            elif from_unit == 'fahrenheit':
                celsius = (value - 32) * 5/9
            elif from_unit == 'kelvin':
                celsius = value - 273.15
            elif from_unit == 'reamur':
                celsius = value * 5/4
            
            results = {
                'celsius': round(celsius, 4),
                'fahrenheit': round(celsius * 9/5 + 32, 4),
                'kelvin': round(celsius + 273.15, 4),
                'reamur': round(celsius * 4/5, 4)
            }
            
            unit_symbols = {'celsius': '°C', 'fahrenheit': '°F', 'kelvin': 'K', 'reamur': '°R'}
            sym = unit_symbols.get(from_unit, '')
            
            steps = [
                f'Nilai input: {value}{sym}',
                f'Konversi ke Celsius: {results["celsius"]}°C',
                f'Celsius → Fahrenheit: C×9/5+32 = {results["fahrenheit"]}°F',
                f'Celsius → Kelvin: C+273.15 = {results["kelvin"]}K',
                f'Celsius → Réaumur: C×4/5 = {results["reamur"]}°R'
            ]
            
            formula = f'{value}{sym} → C:{results["celsius"]}°C, F:{results["fahrenheit"]}°F, K:{results["kelvin"]}K, R:{results["reamur"]}°R'
            
            entry = {'category': 'Konversi Suhu', 'formula': formula, 'result': f'{results["celsius"]}°C'}
            save_history(entry)
            
            return jsonify({'results': results, 'steps': steps, 'formula': formula})
        
        elif category == 'currency':
            amount = float(data.get('amount'))
            from_curr = data.get('from_currency', 'IDR')
            
            # Convert to IDR first
            idr_amount = amount / CURRENCY_RATES.get(from_curr, 1)
            
            results = {}
            for curr, rate in CURRENCY_RATES.items():
                results[curr] = round(idr_amount * rate, 4)
            
            steps = [
                f'Jumlah input: {amount} {from_curr}',
                f'Konversi ke IDR: Rp {idr_amount:,.2f}',
                *[f'IDR → {curr}: {val:,.4f}' for curr, val in results.items() if curr != 'IDR']
            ]
            
            formula = f'{amount} {from_curr} = {results.get("IDR", idr_amount):,.2f} IDR'
            
            entry = {'category': 'Konversi Mata Uang', 'formula': formula, 'result': f'Rp {idr_amount:,.2f}'}
            save_history(entry)
            
            return jsonify({'results': results, 'steps': steps, 'formula': formula, 'from_idr': idr_amount})
        
        elif category == 'factorial':
            n = int(data.get('value'))
            if n < 0:
                return jsonify({'error': 'Faktorial hanya untuk bilangan non-negatif!'})
            if n > 20:
                return jsonify({'error': 'Nilai terlalu besar (maks 20)!'})
            
            result = math.factorial(n)
            
            if n <= 10:
                expansion = ' × '.join(str(i) for i in range(n, 0, -1))
                if n == 0:
                    expansion = '1 (by definition)'
            else:
                expansion = f'{n} × {n-1} × ... × 2 × 1'
            
            steps = [
                f'Faktorial: {n}!',
                f'Definisi: n! = n × (n-1) × ... × 2 × 1',
                f'Ekspansi: {n}! = {expansion}',
                f'Hasil: {result}'
            ]
            
            formula = f'{n}! = {result}'
            
            entry = {'category': 'Faktorial', 'formula': formula, 'result': str(result)}
            save_history(entry)
            
            return jsonify({'result': result, 'steps': steps, 'formula': formula})
        
        elif category == 'fibonacci':
            n = int(data.get('value'))
            if n < 0:
                return jsonify({'error': 'Fibonacci hanya untuk bilangan non-negatif!'})
            if n > 30:
                return jsonify({'error': 'Nilai terlalu besar (maks 30)!'})
            
            fib = [0, 1]
            for i in range(2, n + 1):
                fib.append(fib[-1] + fib[-2])
            
            sequence = fib[:n+1]
            result = fib[n]
            
            seq_str = ', '.join(str(x) for x in sequence[:min(10, len(sequence))])
            if len(sequence) > 10:
                seq_str += f', ... , {result}'
            
            steps = [
                f'Deret Fibonacci ke-{n}',
                f'Rumus: F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1',
                f'Deret: {seq_str}',
                f'F({n}) = {result}'
            ]
            
            formula = f'F({n}) = {result}'
            
            entry = {'category': 'Fibonacci', 'formula': formula, 'result': str(result)}
            save_history(entry)
            
            return jsonify({
                'result': result,
                'sequence': sequence[:20],
                'steps': steps,
                'formula': formula
            })
    
    except ValueError as e:
        return jsonify({'error': f'Input tidak valid: {str(e)}'})
    except Exception as e:
        return jsonify({'error': str(e)})
    
    return jsonify({'error': 'Kategori tidak valid'})


@app.route('/api/history', methods=['GET'])
def get_history():
    history = session.get('history', [])
    return jsonify({'history': history})


@app.route('/api/history/clear', methods=['POST'])
def clear_history():
    session['history'] = []
    return jsonify({'success': True})


def save_history(entry):
    if 'history' not in session:
        session['history'] = []
    history = session['history']
    history.insert(0, entry)
    if len(history) > 50:
        history = history[:50]
    session['history'] = history
    session.modified = True


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
