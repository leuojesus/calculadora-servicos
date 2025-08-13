// Funções para mostrar/esconder os campos de custos extras
document.getElementById('pedagio-check').addEventListener('change', function() {
    document.getElementById('pedagio-input-group').classList.toggle('hidden', !this.checked);
});

document.getElementById('almoco-check').addEventListener('change', function() {
    document.getElementById('almoco-input-group').classList.toggle('hidden', !this.checked);
});

// Função principal para calcular
function calcular() {
    // --- PASSO 1: LIMPEZA E RESET ---
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    resultadoDiv.style.borderColor = '#4a4a70';

    const inputs = document.querySelectorAll('.calculator input[type="number"]');
    inputs.forEach(input => input.classList.remove('input-invalid'));

    // --- PASSO 2: COLETA DE DADOS E VALIDAÇÃO ---
    const campos = {
        valorHora: { el: document.getElementById('valor-hora'), desc: 'Valor por Hora', isInteger: false },
        horasTrabalhadas: { el: document.getElementById('horas-trabalhadas'), desc: 'Horas Trabalhadas', isInteger: true },
        minutosTrabalhados: { el: document.getElementById('minutos-trabalhados'), desc: 'Minutos Trabalhados', isInteger: true },
        kmRodado: { el: document.getElementById('km-rodado'), desc: 'Distância Total', isInteger: true },
        valorKm: { el: document.getElementById('valor-km'), desc: 'Custo por KM', isInteger: false },
        valorHoraDeslocamento: { el: document.getElementById('valor-hora-deslocamento'), desc: 'Valor por Hora de Deslocamento', isInteger: false },
        horasDeslocamento: { el: document.getElementById('horas-deslocamento'), desc: 'Horas em Deslocamento', isInteger: true },
        minutosDeslocamento: { el: document.getElementById('minutos-deslocamento'), desc: 'Minutos em Deslocamento', isInteger: true },
        valorPedagio: { el: document.getElementById('valor-pedagio'), desc: 'Valor dos Pedágios', isChecked: document.getElementById('pedagio-check').checked, isInteger: false },
        valorAlmoco: { el: document.getElementById('valor-almoco'), desc: 'Valor da Alimentação', isChecked: document.getElementById('almoco-check').checked, isInteger: false }
    };

    let errors = [];
    const camposDeTempo = ['horasTrabalhadas', 'minutosTrabalhados', 'horasDeslocamento', 'minutosDeslocamento', 'kmRodado'];

    for (const key in campos) {
        if (campos[key].isChecked === false) continue;

        const valorStr = campos[key].el.value;
        if (!valorStr) continue; // Pula a validação se o campo estiver vazio

        const valorNum = parseFloat(valorStr);

        if (valorNum < 0) {
            errors.push(`${campos[key].desc} não pode ser negativo.`);
            campos[key].el.classList.add('input-invalid');
        }

        // Checa se o campo que deveria ser inteiro, de fato é.
        if (campos[key].isInteger && !Number.isInteger(valorNum)) {
            errors.push(`${campos[key].desc} deve ser um número inteiro.`);
            campos[key].el.classList.add('input-invalid');
        }
    }
    
    if (parseFloat(campos.minutosTrabalhados.el.value) > 59) {
        errors.push("Minutos trabalhados não podem ser maiores que 59.");
        campos.minutosTrabalhados.el.classList.add('input-invalid');
    }
    if (parseFloat(campos.minutosDeslocamento.el.value) > 59) {
        errors.push("Minutos em deslocamento não podem ser maiores que 59.");
        campos.minutosDeslocamento.el.classList.add('input-invalid');
    }

    // --- PASSO 3: EXIBIR ERROS OU CALCULAR ---
    if (errors.length > 0) {
        let errorHTML = '<div class="error-summary"><h2>Por favor, corrija os seguintes erros:</h2><ul>';
        errors.forEach(error => { errorHTML += `<li>${error}</li>`; });
        errorHTML += '</ul></div>';
        resultadoDiv.innerHTML = errorHTML;
        resultadoDiv.style.borderColor = '#ff6b6b';
        return;
    }

    // --- PASSO 4: CÁLCULO (se não houver erros) ---
    const valorHora = parseFloat(campos.valorHora.el.value) || 0;
    const kmRodado = parseFloat(campos.kmRodado.el.value) || 0;
    const valorKm = parseFloat(campos.valorKm.el.value) || 0;
    const valorHoraDeslocamento = parseFloat(campos.valorHoraDeslocamento.el.value) || 0;
    const totalHorasTrabalhadasDecimal = (parseFloat(campos.horasTrabalhadas.el.value) || 0) + ((parseFloat(campos.minutosTrabalhados.el.value) || 0) / 60);
    const totalHorasDeslocamentoDecimal = (parseFloat(campos.horasDeslocamento.el.value) || 0) + ((parseFloat(campos.minutosDeslocamento.el.value) || 0) / 60);
    
    const custoHorasTrabalhadas = valorHora * totalHorasTrabalhadasDecimal;
    const custoKm = kmRodado * valorKm;
    const custoDeslocamento = valorHoraDeslocamento * totalHorasDeslocamentoDecimal;
    
    const valorPedagio = campos.valorPedagio.isChecked ? (parseFloat(campos.valorPedagio.el.value) || 0) : 0;
    const valorAlmoco = campos.valorAlmoco.isChecked ? (parseFloat(campos.valorAlmoco.el.value) || 0) : 0;

    const custoTotal = custoHorasTrabalhadas + custoKm + custoDeslocamento + valorPedagio + valorAlmoco;

    resultadoDiv.innerHTML = `
        <h2>Detalhamento dos Custos</h2>
        <p>Horas Trabalhadas: R$ ${custoHorasTrabalhadas.toFixed(2)}</p>
        <p>Custo de KM: R$ ${custoKm.toFixed(2)}</p>
        <p>Custo de Deslocamento: R$ ${custoDeslocamento.toFixed(2)}</p>
        <p>Pedágios: R$ ${valorPedagio.toFixed(2)}</p>
        <p>Alimentação: R$ ${valorAlmoco.toFixed(2)}</p>
        <p id="valor-total">CUSTO TOTAL: R$ ${custoTotal.toFixed(2)}</p>
    `;
}