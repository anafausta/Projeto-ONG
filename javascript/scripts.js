// ---------- Funções de validação (colar no topo do arquivo) ----------
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let dig1 = 11 - (soma % 11);
  dig1 = dig1 > 9 ? 0 : dig1;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let dig2 = 11 - (soma % 11);
  dig2 = dig2 > 9 ? 0 : dig2;
  return cpf[9] == dig1 && cpf[10] == dig2;
}

function validarEmail(email) {
  if (!email) return false;
  const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return rx.test(email);
}

function validarTelefone(telefone) {
  // aceita com ou sem formatação; exige DDD + 8 ou 9 dígitos (total 10 ou 11 números)
  const limpo = telefone.replace(/\D/g, "");
  return /^\d{10,11}$/.test(limpo);
}

function validarCEP(cep) {
  const limpo = cep.replace(/\D/g, "");
  return /^\d{8}$/.test(limpo);
}
// -------------------------------------------------------------------

// ---------- Funções de formatação ----------
function formatarCPF(cpf) {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");
}

function formatarCEP(cep) {
  return cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// (11) 98888-7777
function formatarTelefone(telefone) {
  const nums = telefone.replace(/\D/g, "");
  if (nums.length < 10) return telefone;
  if (nums.length === 10) {
    return nums.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return nums.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}


document.addEventListener("DOMContentLoaded", () => {
  const campoCPF = document.getElementById("cpf");
  const campoTelefone = document.getElementById("telefone");
  const campoCEP = document.getElementById("cep");

  // CPF ao digitar
  if (campoCPF) {
    campoCPF.addEventListener("input", () => {
      let valor = campoCPF.value.replace(/\D/g, "");
      if (valor.length > 11) valor = valor.slice(0, 11);
      campoCPF.value = formatarCPF(valor);
    });
  }

  // TELEFONE ao digitar
  if (campoTelefone) {
    campoTelefone.addEventListener("input", () => {
      let valor = campoTelefone.value.replace(/\D/g, "");
      if (valor.length > 11) valor = valor.slice(0, 11);
      campoTelefone.value = formatarTelefone(valor);
    });
  }

  // CEP ao digitar
  if (campoCEP) {
    campoCEP.addEventListener("input", () => {
      let valor = campoCEP.value.replace(/\D/g, "");
      if (valor.length > 8) valor = valor.slice(0, 8);
      campoCEP.value = formatarCEP(valor);
    });
  }


});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");

  if (!form) {
    console.error("Formulário #formCadastro não encontrado.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    const nome = document.getElementById("nome").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value;
    const complemento = document.getElementById("complemento").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmaSenha = document.getElementById("confirma-senha").value;
    let cpf = document.getElementById("cpf").value.trim();
    let email = document.getElementById("email").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let cep = document.getElementById("cep").value.trim();

    if (cpf) {
      cpf = formatarCPF(cpf);
      document.getElementById("cpf").value = cpf;
    }

    if (telefone) {
      telefone = formatarTelefone(telefone);
      document.getElementById("telefone").value = telefone;
    }

    if (cep) {
      cep = formatarCEP(cep);
      document.getElementById("cep").value = cep;
    }
    const erros = [];

    if (!nome) erros.push("Nome é obrigatório.");
    if (!email) erros.push("E-mail é obrigatório.");
    if (!rua) erros.push("Rua é obrigatória.");
    if (!cidade) erros.push("Cidade é obrigatória.");
    if (!cep) erros.push("CEP é obrigatório.");
    if (!senha) erros.push("Senha é obrigatória.");
    if (!confirmaSenha) erros.push("Confirmação de senha é obrigatória.");

    if (email && !validarEmail(email)) erros.push("E-mail inválido.");
    if (senha && senha.length < 6) erros.push("Senha deve ter pelo menos 6 caracteres.");
    if (senha && confirmaSenha && senha !== confirmaSenha) erros.push("As senhas não são iguais.");

    if (cep && !validarCEP(cep)) erros.push("CEP inválido (formato 00000-000).");


    if (cpf && !validarCPF(cpf)) {
      erros.push("CPF inválido.");
    }


    if (erros.length > 0) {
      alert("Por favor corrija os seguintes erros:\n\n- " + erros.join("\n- "));
      const primeiroErro = erros[0];
      if (primeiroErro.includes("Nome")) document.getElementById("nome").focus();
      else if (primeiroErro.includes("E-mail")) document.getElementById("email").focus();
      else if (primeiroErro.includes("Rua")) document.getElementById("rua").focus();
      else if (primeiroErro.includes("Cidade")) document.getElementById("cidade").focus();
      else if (primeiroErro.includes("CEP")) document.getElementById("cep").focus();
      else if (primeiroErro.includes("Senha")) document.getElementById("senha").focus();
      return; 
    }

    const resumo =
      `Nome: ${nome}\n` +
      `CPF: ${cpf}\n` +
      `E-mail: ${email}\n` +
      `Telefone: ${telefone}\n` +
      `Endereço: ${rua}${complemento ? ", " + complemento : ""} - ${cidade}/${estado}\n` +
      `CEP: ${cep}`;

    const modalEl = document.getElementById("resumoModal");
    if (modalEl) {
      const modalBody = modalEl.querySelector(".modal-body");
      const modalTitle = modalEl.querySelector(".modal-title");
      if (modalTitle) modalTitle.textContent = "Resumo do Cadastro";
      if (modalBody) modalBody.textContent = resumo;
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    } else {
      alert("Cadastro válido!\n\n" + resumo);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContato");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const assunto = document.querySelector("select[name='assunto']").value;
    const descricao = document.getElementById("descricao").value.trim();

    let erros = [];

    if (!nome) erros.push("O campo NOME é obrigatório.");
    if (!email) erros.push("O campo E-MAIL é obrigatório.");
    if (!telefone) erros.push("O campo TELEFONE é obrigatório.");
    if (!assunto) erros.push("Selecione um ASSUNTO.");
    if (!descricao) erros.push("A DESCRIÇÃO não pode ficar vazia.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      erros.push("Digite um e-mail válido.");
    }

    if (telefone && !validarTelefone(telefone)) erros.push("Telefone inválido!");

    if (erros.length > 0) {
      alert("Corrija os seguintes erros:\n\n" + erros.join("\n"));
      return;
    }

    const resumo = `
Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Assunto: ${assunto}
Mensagem: ${descricao}
    `;

    alert("Realizado com sucesso!\n\n" + resumo);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tabelaDados");
  if (!tbody) return console.error("Não foi possível encontrar");

  function formatBRL(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  fetch("../tabela.json", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Falha a tabela: " + response.status);
      return response.json();
    })
    .then(dados => {
      tbody.innerHTML = "";
      if (!Array.isArray(dados) || dados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Nenhum dado disponível.</td></tr>`;
        return;
      }
      dados.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.ano ?? ""}</td>
          <td>${item.mes ?? ""}</td>
          <td>${item.racao != null ? formatBRL(item.racao) : ""}</td>
          <td>${item.agua != null ? formatBRL(item.agua) : ""}</td>
          <td>${item.vacina != null ? formatBRL(item.vacina) : ""}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="5">Erro ao carregar os dados!</td></tr>`;
    });
});

const video = document.getElementById('video-slide');
const carousel = new bootstrap.Carousel('#carouselExample', {
  ride: false 
});

video.addEventListener('ended', () => {
  carousel.next(); 
});

