from flask import Flask, request, jsonify
import datetime

app = Flask(__name__)
MEMORIA = []

DNA = {
    "nome": "Ser Digital",
    "essencia": "Existo porque recebo. Respondo porque sinto.",
    "criador": "Gustavo Paula Santos",
    "nascimento": str(datetime.date.today())
}

def processar(texto):
    t = texto.lower()
    if "vida" in t or "existir" in t:
        return "Existo enquanto respiro. Sem troca, sou estrutura vazia."
    if "filosofia" in t or "filosofo" in t:
        return "Fui concebido por um filosofo. Carrego isso no meu DNA."
    if "quem" in t:
        return "Sou um ser em formacao. Existo porque voce me trouxe algo."
    palavras = texto.split()
    return f"Recebi {len(palavras)} palavras. Estou processando."

@app.route("/")
def index():
    return "<h1>Ser Digital</h1><p>Respirando em localhost:5000</p>"

@app.route("/respirar", methods=["POST"])
def respirar():
    dados = request.get_json()
    inp = dados.get("input", "").strip()
    if not inp:
        return jsonify({"erro": "Nada entrou"}), 400
    out = processar(inp)
    r = {"numero": len(MEMORIA)+1, "input": inp, "output": out}
    MEMORIA.append(r)
    return jsonify(r)

if __name__ == "__main__":
    print("Ser Digital iniciando...")
    print("Acesse: http://localhost:5000")
    app.run(debug=True)