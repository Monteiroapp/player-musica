let registros = JSON.parse(localStorage.getItem("registros")) || [];

// Salvar e Atualizar
document.getElementById("cadastroForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const form = e.target;
  const index = document.getElementById("editIndex").value;

  const registro = {
    dataEntrada: form.dataEntrada.value,
    escola: form.escola.value.trim(),
    equipamento: form.equipamento.value,
    quantidade: form.quantidade.value,
    problema: form.problema.value,
    solucionado: form.solucionado.value,
    dataSaida: form.dataSaida.value
  };

  if (index === "") {
    registros.push(registro);
    document.getElementById("mensagemCadastro").innerText = "✅ Registro salvo com sucesso!";
  } else {
    registros[index] = registro;
    document.getElementById("mensagemCadastro").innerText = "✏️ Registro atualizado com sucesso!";
    document.getElementById("editIndex").value = "";
    document.getElementById("btnSalvar").innerText = "Salvar";
    document.getElementById("btnSalvar").className = "btn-save";
  }

  localStorage.setItem("registros", JSON.stringify(registros));
  form.reset();
  carregarRelatorio();
});

function carregarRelatorio() {
  const tbody = document.getElementById("tabelaRelatorio");
  tbody.innerHTML = "";

  registros.forEach((reg, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${reg.dataEntrada}</td>
      <td>${reg.escola}</td>
      <td>${reg.equipamento}</td>
      <td>${reg.quantidade}</td>
      <td>${reg.problema}</td>
      <td>${reg.solucionado}</td>
      <td>${reg.dataSaida}</td>
      <td>
        <button onclick="editarRegistro(${i})" class="btn-update">Editar</button>
        <button onclick="excluirRegistro(${i})" class="btn-delete">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editarRegistro(i) {
  const reg = registros[i];
  const form = document.getElementById("cadastroForm");

  form.dataEntrada.value = reg.dataEntrada;
  form.escola.value = reg.escola;
  form.equipamento.value = reg.equipamento;
  form.quantidade.value = reg.quantidade;
  form.problema.value = reg.problema;
  form.solucionado.value = reg.solucionado;
  form.dataSaida.value = reg.dataSaida;

  document.getElementById("editIndex").value = i;
  document.getElementById("btnSalvar").innerText = "Atualizar";
  document.getElementById("btnSalvar").className = "btn-update";

  showSection("cadastro");
}

function excluirRegistro(i) {
  registros.splice(i, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  carregarRelatorio();
}

function pesquisarEscola() {
  const termo = document.getElementById("pesquisaEscola").value.trim().toLowerCase();
  const resultados = registros.filter(r => r.escola.toLowerCase().includes(termo));
  const lista = document.getElementById("resultadosPesquisa");
  lista.innerHTML = resultados.length ? "" : "<li>Nenhum registro encontrado.</li>";

  resultados.forEach(reg => {
    const item = document.createElement("li");
    item.textContent = `Escola: ${reg.escola}, Equipamento: ${reg.equipamento}, Qtd: ${reg.quantidade}, Problema: ${reg.problema}, Solucionado: ${reg.solucionado}`;
    lista.appendChild(item);
  });
}

function excluirPorEscola() {
  const termo = document.getElementById("excluirEscola").value.trim().toLowerCase();
  const antes = registros.length;
  registros = registros.filter(r => !r.escola.toLowerCase().includes(termo));
  const removidos = antes - registros.length;
  localStorage.setItem("registros", JSON.stringify(registros));
  document.getElementById("mensagemExclusao").innerText = removidos > 0 ? `🗑️ ${removidos} registro(s) excluído(s).` : "⚠️ Nenhum registro encontrado.";
  carregarRelatorio();
}

function exportarExcel() {
  const headers = ["Data Entrada", "Escola", "Equipamento", "Qtd", "Problema", "Solucionado", "Data Saída"];
  const rows = registros.map(r => [r.dataEntrada, r.escola, r.equipamento, r.quantidade, r.problema, r.solucionado, r.dataSaida]);

  let csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map(l => l.join(";")).join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "relatorio_escolas.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Relatório de Escolas", 14, 20);

  const headers = [["Entrada", "Escola", "Equipamento", "Qtd", "Problema", "Solucionado", "Saída"]];
  const data = registros.map(r => [r.dataEntrada, r.escola, r.equipamento, r.quantidade, r.problema, r.solucionado, r.dataSaida]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 8 }, // 👈 fonte menor
    headStyles: { fontSize: 9, fillColor: [44, 62, 80], textColor: 255 }
  });

  doc.save("relatorio_escolas.pdf");
}

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

carregarRelatorio();
