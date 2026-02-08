// ===============================
// CONFIG API
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbxIyh0zk6PS9lOXwt3bHKYQyrnSRe7hx9tM5nFA5oV7kZ89g8_ENnRNiBaz1TOtjnxepQ/exec";


// ===============================
// ELEMENTS HTML
// ===============================
const el = {
  matricule: document.getElementById("matricule"),
  nom: document.getElementById("nom"),
  statut: document.getElementById("statut"),
  fonction: document.getElementById("fonction"),
  rattachement: document.getElementById("rattachement"),
  dateIntegration: document.getElementById("dateIntegration"),
  login: document.getElementById("login"),
  dateCreation: document.getElementById("dateCreation"),
  deadline: document.getElementById("deadline"),
  outils: document.getElementById("outils"),
  etat: document.getElementById("etat"),
  dateFin: document.getElementById("dateFin"),
  statutSuivi: document.getElementById("statutSuivi"),
  msg: document.getElementById("msg"),
  dashboardCard: document.getElementById("dashboardCard"),
  formCard: document.getElementById("formCard")
};

let users = [];
let currentUser = null;
let dashboardData = [];
let chartSuivi = null;
let chartEtat = null;


// ===============================
// NAVIGATION
// ===============================
function showDashboard() {
  el.formCard.classList.add("hidden");
  el.dashboardCard.classList.remove("hidden");

  document.getElementById("btnForm")?.classList.remove("active");
  document.getElementById("btnDash")?.classList.add("active");

  loadDashboard();
}

function showForm() {
  el.dashboardCard.classList.add("hidden");
  el.formCard.classList.remove("hidden");

  document.getElementById("btnDash")?.classList.remove("active");
  document.getElementById("btnForm")?.classList.add("active");
}


// ===============================
// FORMAT DATE
// ===============================
function todayFR() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}


// ===============================
// CONVERT DATE FR -> ISO (yyyy-mm-dd)
// ===============================
function convertToISO(dateFR) {
  if (!dateFR) return "";

  if (dateFR.includes("-")) return dateFR;

  const parts = dateFR.split("/");
  if (parts.length !== 3) return "";

  const dd = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const yyyy = parts[2];

  return `${yyyy}-${mm}-${dd}`;
}


// ===============================
// CONVERT ISO -> FR
// ===============================
function convertToFR(dateISO) {
  if (!dateISO) return "";
  const parts = dateISO.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


// ===============================
// PARSE DATE FR
// ===============================
function parseFR(dateFR) {
  if (!dateFR) return null;
  const p = dateFR.split("/");
  if (p.length !== 3) return null;
  return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
}


// ===============================
// API GET USERS
// ===============================
async function loadUsers() {
  try {
    const res = await fetch(`${API_URL}?action=getUsers`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    users = data || [];

    el.matricule.innerHTML = `<option value="">-- Choisir un matricule --</option>`;

    users.forEach((u, index) => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `${u.matricule} - ${u.nom}`;
      el.matricule.appendChild(opt);
    });

  } catch (err) {
    console.error("loadUsers failed", err);
    showApiError(`Impossible de charger la liste des utilisateurs: ${err.message}`);
  }
}


// ===============================
// LOAD USER IN FORM
// ===============================
window.loadUser = function () {
  const i = el.matricule.value;
  if (i === "") return;

  currentUser = users[i];

  if (!currentUser) {
    resetForm();
    return;
  }

  // sécuriser outils si absent
  if (!currentUser.outils) currentUser.outils = [];

  // ajouter listener sur dateFin pour synchroniser le modèle
  el.dateFin.removeEventListener('change', handleDateFinChange);
  el.dateFin.addEventListener('change', handleDateFinChange);

  el.nom.textContent = currentUser.nom || "";
  el.statut.textContent = currentUser.statut || "";
  el.fonction.textContent = currentUser.fonction || "";
  el.rattachement.textContent = currentUser.rattachement || "";
  el.dateIntegration.textContent = currentUser.dateIntegration || "";

  el.login.textContent = currentUser.login || "";
  el.dateCreation.textContent = currentUser.dateCreation || "";
  el.deadline.textContent = currentUser.deadline || "";

  renderOutils();
  updateEtat();
};


// ===============================
// RENDER OUTILS DYNAMIQUES
// ===============================
function renderOutils() {
  if (!currentUser) return;

  el.outils.innerHTML = "";

  const container = document.createElement("div");
  container.className = "outils-container";

  currentUser.outils.forEach((o, idx) => {
    const card = document.createElement("div");
    card.className = "outil-card";

    // Status badge color
    let badgeClass = "en-cours";
    if (o.statut === "Terminé") badgeClass = "termine";
    else if (o.statut === "Rejeté") badgeClass = "rejete";

    card.innerHTML = `
      <span class="outil-status-badge ${badgeClass}">${o.statut || "En cours"}</span>

      <div class="outil-box">
        <label>📋 Outil</label>
        <input type="text" class="outil-nom" data-index="${idx}" value="${o.outil || ""}" placeholder="Nom de l'outil" />
      </div>

      <div class="outil-box">
        <label>✓ Statut</label>
        <select class="outil-statut" data-index="${idx}" ${(!o.outil || (String(o.outil).trim() === "") || o.statut === "Terminé" || o.statut === "Rejeté") ? "disabled" : ""}>
          <option value="En cours" ${(o.statut || "En cours") === "En cours" ? "selected" : ""}>En cours</option>
          <option value="Terminé" ${o.statut === "Terminé" ? "selected" : ""}>Terminé</option>
          <option value="Rejeté" ${o.statut === "Rejeté" ? "selected" : ""}>Rejeté</option>
        </select>
      </div>

      <div class="outil-box">
        <label>📅 Date</label>
        <input type="text" class="outil-date" data-index="${idx}" value="${o.date || ""}" readonly />
      </div>

      <button class="outil-delete-btn" data-index="${idx}" onclick="deleteOutil(${idx})" ${(o.statut || "En cours") !== "En cours" ? "disabled" : ""}>
        🗑️ Supprimer
      </button>
    `;

    container.appendChild(card);
  });

  el.outils.appendChild(container);

  // ensure selects are disabled when the outil name is empty (defensive)
  const nomsAfter = container.querySelectorAll('.outil-nom');
  nomsAfter.forEach(inp => {
    const idx = parseInt(inp.dataset.index);
    const val = (inp.value || '').trim();
    const sel = container.querySelector(`.outil-statut[data-index="${idx}"]`);
    
    // vérifier si l'outil est terminé/rejeté ou si le nom est vide
    const isTermineOrRejet = currentUser && currentUser.outils && currentUser.outils[idx] && 
                              (currentUser.outils[idx].statut === 'Terminé' || currentUser.outils[idx].statut === 'Rejeté');
    
    if (sel) {
      sel.disabled = (val === '' || isTermineOrRejet);
      if (val === '') {
        sel.value = 'En cours';
        // ensure model matches
        if (currentUser && currentUser.outils && currentUser.outils[idx]) currentUser.outils[idx].statut = 'En cours';
      }
    }
    // also ensure delete button disabled state matches statut
    const delBtn = container.querySelector(`.outil-delete-btn[data-index="${idx}"]`);
    if (delBtn) {
      delBtn.disabled = (currentUser && currentUser.outils && currentUser.outils[idx] && currentUser.outils[idx].statut !== 'En cours');
    }
  });

  setupOutilsEvents();
}


// ===============================
// ADD OUTIL
// ===============================
window.addOutil = function () {
  if (!currentUser) {
    alert("Veuillez d'abord sélectionner un collaborateur");
    return;
  }

  currentUser.outils.push({
    outil: "",
    statut: "En cours",
    date: ""
  });

  renderOutils();
  updateEtat();
};


// ===============================
// DELETE OUTIL
// ===============================
window.deleteOutil = function (idx) {
  if (!currentUser) return;

  const outil = currentUser.outils[idx];
  if (!outil) return;

  if (outil.statut !== "En cours") {
    alert("Impossible de supprimer un outil terminé ou rejeté");
    return;
  }

  currentUser.outils.splice(idx, 1);
  renderOutils();
  updateEtat();
};


// ===============================
// EVENTS OUTILS
// ===============================
function setupOutilsEvents() {
  const noms = document.querySelectorAll(".outil-nom");
  const selects = document.querySelectorAll(".outil-statut");
  const dates = document.querySelectorAll(".outil-date");

  // nom outil
  noms.forEach(inp => {
    inp.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.index);
      const val = e.target.value || "";
      currentUser.outils[idx].outil = val;

      // activer/désactiver le select statut selon si le nom est vide
      const sel = document.querySelector(`.outil-statut[data-index="${idx}"]`);
      if (sel) {
        if (val.trim() === "") {
          sel.value = "En cours";
          sel.disabled = true;
          currentUser.outils[idx].statut = "En cours";
        } else {
          sel.disabled = false;
        }
      }
    });
  });

  // statut
  selects.forEach(sel => {
    sel.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index);
      currentUser.outils[idx].statut = e.target.value;

      // si terminé ou rejeté => auto date aujourd'hui si vide
      if ((e.target.value === "Terminé" || e.target.value === "Rejeté") && !currentUser.outils[idx].date) {
        currentUser.outils[idx].date = todayFR();
      }

      updateEtat();
      renderOutils();
    });
  });

  // dates sont maintenant readonly, pas d'event listeners nécessaires
}


// ===============================
// CALCUL STATUT SUIVI
// ===============================
function calcStatutSuivi(deadline, dateFin, etat) {
  if (etat !== "Terminé") return "En cours";
  if (!deadline || !dateFin) return "En cours";

  const d1 = parseFR(deadline);
  const d2 = parseFR(dateFin);

  if (!d1 || !d2) return "En cours";

  return d2 <= d1 ? "Respecté" : "Non respecté";
}


// ===============================
// UPDATE ETAT + DATE FIN + STATUT SUIVI
// ===============================
function updateEtat() {
  if (!currentUser) return;

  const outils = currentUser.outils || [];

  // vérifier si tous les outils ont le statut "Terminé" ET au moins un outil existe
  const allTermine = outils.length > 0 && outils.every(o => o.statut === "Terminé");

  if (allTermine) {
    currentUser.etat = "Terminé";

    // prendre la dernière date remplie parmi les outils
    const dates = outils.filter(o => o.date && o.date !== "").map(o => o.date);
    if (dates.length > 0) {
      // prendre la date la plus récente
      currentUser.dateFin = dates[dates.length - 1];
    } else {
      // si pas de date, remplir avec aujourd'hui
      currentUser.dateFin = todayFR();
    }
  } else {
    currentUser.etat = "En cours";
    currentUser.dateFin = "";
  }

  currentUser.statutSuivi = calcStatutSuivi(currentUser.deadline, currentUser.dateFin, currentUser.etat);

  el.etat.textContent = currentUser.etat;
  el.dateFin.value = currentUser.dateFin || "";
  el.statutSuivi.textContent = currentUser.statutSuivi;

  el.etat.classList.remove("etat-ok", "etat-warn");
  if (currentUser.etat === "Terminé") el.etat.classList.add("etat-ok");
  else el.etat.classList.add("etat-warn");
}


// ===============================
// SAVE USER (FIX CORS: USE GET)
// ===============================
window.save = async function () {
  if (!currentUser) {
    el.msg.textContent = "❌ Veuillez sélectionner un matricule !";
    el.msg.style.color = "red";
    return;
  }

  // récupérer outils depuis inputs
  const noms = document.querySelectorAll(".outil-nom");
  const statuts = document.querySelectorAll(".outil-statut");

  noms.forEach(inp => {
    const idx = parseInt(inp.dataset.index);
    currentUser.outils[idx].outil = inp.value;
  });

  statuts.forEach(sel => {
    const idx = parseInt(sel.dataset.index);
    currentUser.outils[idx].statut = sel.value;
  });

  // les dates sont déjà dans le modèle (currentUser.outils[idx].date)
  // pas besoin de les récupérer des inputs readonly

  updateEtat();

  try {
    // IMPORTANT: GET pour éviter CORS
    const url = `${API_URL}?action=saveUser&data=${encodeURIComponent(JSON.stringify(currentUser))}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const result = await res.json();

    if (result.success) {
      el.msg.textContent = "✅ Enregistré avec succès";
      el.msg.style.color = "green";

      await loadUsers();
      resetForm();
    } else {
      el.msg.textContent = "❌ Erreur lors de l'enregistrement";
      el.msg.style.color = "red";
    }

  } catch (err) {
    console.error(err);
    el.msg.textContent = "❌ Impossible de contacter l'API";
    el.msg.style.color = "red";
  }
};


// ===============================
// HANDLE DATE FIN CHANGE
// ===============================
function handleDateFinChange(e) {
  if (currentUser) {
    currentUser.dateFin = convertToFR(el.dateFin.value);
    updateEtat();
  }
}


// ===============================
// RESET FORM
// ===============================
function resetForm() {
  el.matricule.value = "";
  el.nom.textContent = "";
  el.statut.textContent = "";
  el.fonction.textContent = "";
  el.rattachement.textContent = "";
  el.dateIntegration.textContent = "";
  el.login.textContent = "";
  el.dateCreation.textContent = "";
  el.deadline.textContent = "";
  el.etat.textContent = "";
  el.dateFin.value = "";
  el.statutSuivi.textContent = "";
  el.outils.innerHTML = "";
  currentUser = null;
}


// ===============================
// DASHBOARD
// ===============================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL}?action=getDashboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    dashboardData = data || [];

    renderDashboard(dashboardData);
    updateStats();
    updateCharts();

  } catch (err) {
    console.error("loadDashboard failed", err);
    showApiError(`Impossible de charger le dashboard: ${err.message}`);
  }
}

function renderDashboard(data) {
  const tbody = document.querySelector("#dashboardTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach(row => {
    const suiviClass =
      row.statutSuivi === "Respecté"
        ? "status-success"
        : row.statutSuivi === "Non respecté"
        ? "status-danger"
        : "status-info";

    tbody.innerHTML += `
      <tr>
        <td><strong>${row.matricule || ""}</strong></td>
        <td>${row.statut || ""}</td>
        <td>${row.nom || ""}</td>
        <td>${row.fonction || ""}</td>
        <td>${row.rattachement || ""}</td>
        <td>${row.dateIntegration || ""}</td>
        <td>${row.login || ""}</td>
        <td>${row.dateCreation || ""}</td>
        <td>${row.deadline || ""}</td>
        <td>${row.etat || ""}</td>
        <td>${row.dateFin || ""}</td>
        <td><span class="badge ${suiviClass}">${row.statutSuivi || ""}</span></td>
      </tr>
    `;
  });

  setupTableFilters();
}

function updateStats() {
  const total = dashboardData.length;
  const enCours = dashboardData.filter(u => u.statutSuivi === "En cours").length;
  const respecte = dashboardData.filter(u => u.statutSuivi === "Respecté").length;
  const nonRespecte = dashboardData.filter(u => u.statutSuivi === "Non respecté").length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statEnCours").textContent = enCours;
  document.getElementById("statRespecte").textContent = respecte;
  document.getElementById("statNonRespecte").textContent = nonRespecte;
}

function updateCharts() {
  if (!dashboardData || dashboardData.length === 0) {
    if (chartSuivi) { chartSuivi.destroy(); chartSuivi = null; }
    if (chartEtat) { chartEtat.destroy(); chartEtat = null; }
    return;
  }

  const enCours = dashboardData.filter(u => u.statutSuivi === "En cours").length;
  const respecte = dashboardData.filter(u => u.statutSuivi === "Respecté").length;
  const nonRespecte = dashboardData.filter(u => u.statutSuivi === "Non respecté").length;

  const etatTermine = dashboardData.filter(u => u.etat === "Terminé").length;
  const etatEnCours = dashboardData.filter(u => u.etat === "En cours").length;

  // Chart Suivi
  try {
    const ctxSuivi = document.getElementById("chartSuivi");
    if (!ctxSuivi) return;

    if (chartSuivi) chartSuivi.destroy();

    chartSuivi = new Chart(ctxSuivi, {
      type: "doughnut",
      data: {
        labels: ["Respecté", "Non respecté", "En cours"],
        datasets: [{
          data: [respecte, nonRespecte, enCours],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
          borderColor: ["#059669", "#dc2626", "#d97706"],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 12, font: { size: 12 }, usePointStyle: true }
          }
        }
      }
    });
  } catch (err) {
    console.error("Erreur création graphique Suivi:", err);
  }

  // Chart Etat
  try {
    const ctxEtat = document.getElementById("chartEtat");
    if (!ctxEtat) return;

    if (chartEtat) chartEtat.destroy();

    chartEtat = new Chart(ctxEtat, {
      type: "doughnut",
      data: {
        labels: ["Terminé", "En cours"],
        datasets: [{
          data: [etatTermine, etatEnCours],
          backgroundColor: ["#3b82f6", "#6b7280"],
          borderColor: ["#1e40af", "#4b5563"],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 12, font: { size: 12 }, usePointStyle: true }
          }
        }
      }
    });
  } catch (err) {
    console.error("Erreur création graphique Etat:", err);
  }
}


// ===============================
// FILTER TABLE
// ===============================
function setupTableFilters() {
  const searchBox = document.getElementById("searchBox");
  const etatFilter = document.getElementById("etatFilter");
  const suiviFilter = document.getElementById("suiviFilter");

  if (!searchBox || !etatFilter || !suiviFilter) return;

  const filterTable = () => {
    const searchTerm = searchBox.value.toLowerCase();
    const etatValue = etatFilter.value;
    const suiviValue = suiviFilter.value;

    const tbody = document.querySelector("#dashboardTable tbody");
    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr");

    rows.forEach(row => {
      const matricule = row.cells[0]?.textContent.toLowerCase() || "";
      const statut = row.cells[1]?.textContent.toLowerCase() || "";
      const nom = row.cells[2]?.textContent.toLowerCase() || "";
      const login = row.cells[6]?.textContent.toLowerCase() || "";

      const etat = row.cells[9]?.textContent || "";
      const suivi = row.cells[11]?.textContent || "";

      const matchSearch =
        matricule.includes(searchTerm) ||
        statut.includes(searchTerm) ||
        nom.includes(searchTerm) ||
        login.includes(searchTerm);

      const matchEtat = !etatValue || etat === etatValue;
      const matchSuivi = !suiviValue || suivi.includes(suiviValue);

      row.style.display = matchSearch && matchEtat && matchSuivi ? "" : "none";
    });
  };

  searchBox.oninput = filterTable;
  etatFilter.onchange = filterTable;
  suiviFilter.onchange = filterTable;
}


// ===============================
// INIT
// ===============================
(async function init() {
  await loadUsers();
})();


// ===============================
// API ERROR / DIAGNOSTICS
// ===============================
function showApiError(message) {
  const node = el.msg || document.getElementById("msg");

  if (node) {
    node.textContent =
      message +
      " — Vérifiez le déploiement Web App et les permissions (Anyone, even anonymous).";
    node.style.color = "red";
  } else {
    alert(message);
  }

  console.warn(message);
}

async function testApi() {
  try {
    const res = await fetch(`${API_URL}?action=getDashboard`, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await res.json();
    console.info("API OK");
    return true;
  } catch (err) {
    console.error("API test failed", err);
    showApiError("Test API a échoué: " + err.message);
    return false;
  }
}
