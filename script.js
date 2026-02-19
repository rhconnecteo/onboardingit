// ===============================
// CONFIG API
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycby9F0yKZquOMRFi0I4pucZtSq7eMjbyqNUUd-nVh6p3PeLhd7YutqiAyborkcMz3MAU2w/exec";


// ===============================
// ELEMENTS HTML
// ===============================
const el = {
  matricule: document.getElementById("matricule"),
  affichageMatricule: document.getElementById("affichageMatricule"),
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
  formCard: document.getElementById("formCard"),
  detailCard: document.getElementById("detailCard"),
  detailTableBody: document.getElementById("detailTableBody"),
  detailEmptyMessage: document.getElementById("detailEmptyMessage"),
  filterDetailMatricule: document.getElementById("filterDetailMatricule"),
  filterDetailFonction: document.getElementById("filterDetailFonction"),
  filterDetailRattachement: document.getElementById("filterDetailRattachement"),
  filterDetailStatut: document.getElementById("filterDetailStatut")
};

// 🔥 Liste des outils disponibles
const OUTILS_DISPONIBLES = [
  { value: "S3", label: "S3" },
  { value: "Sentinel Mada", label: "Sentinel Mada" },
  { value: "Ability", label: "Ability" },
  { value: "Angaza", label: "Angaza" },
  { value: "ARTEC", label: "ARTEC" },
  { value: "BDC 1", label: "BDC 1" },
  { value: "BDC 2", label: "BDC 2" },
  { value: "ECMS", label: "ECMS" },
  { value: "Klaod", label: "Klaod" },
  { value: "Novacare (Astellia)", label: "Novacare (Astellia)" },
  { value: "Pentaho", label: "Pentaho" },
  { value: "Sage", label: "Sage" },
  { value: "Sandvine", label: "Sandvine" },
  { value: "SIMS Telma", label: "SIMS Telma" },
  { value: "Sms Connect", label: "Sms Connect" },
  { value: "Utiba 2Tmv", label: "Utiba 2Tmv" },
  { value: "RBS NEW", label: "RBS NEW" },
  { value: "POS", label: "POS" },
  { value: "LOAN", label: "LOAN" },
  { value: "Lynx", label: "Lynx" },
  { value: "BO", label: "BO" },
  { value: "Vocalcom", label: "Vocalcom" },
  { value: "Zendesk", label: "Zendesk" },
  { value: "Moodle", label: "Moodle" },
  { value: "Charlie", label: "Charlie" },
  { value: "Viber", label: "Viber" },
  { value: "Skype", label: "Skype" },
  { value: "Whatsapp", label: "Whatsapp" },
  { value: "Outlook", label: "Outlook" },
  { value: "Mail Office 365", label: "Mail Office 365" },
  { value: "Office 365", label: "Office 365" },
  { value: "Facebook", label: "Facebook" },
  { value: "Dlreporting", label: "Dlreporting" },
  { value: "Nextcloud", label: "Nextcloud" },
  { value: "OGC Telma", label: "OGC Telma" },
  { value: "Success Corner", label: "Success Corner" },
  { value: "Scoring Tool", label: "Scoring Tool" },
  { value: "Jupiter", label: "Jupiter" },
  { value: "Dataviz", label: "Dataviz" },
  { value: "Plateforme Mcb", label: "Plateforme Mcb" },
  { value: "Utiba Mvola", label: "Utiba Mvola" },
  { value: "Billrun", label: "Billrun" },
  { value: "CBS Free", label: "CBS Free" },
  { value: "Numlex", label: "Numlex" },
  { value: "Sentinel Free", label: "Sentinel Free" },
  { value: "Web Provisionning", label: "Web Provisionning" },
  { value: "CBS Comores", label: "CBS Comores" },
  { value: "CPS", label: "CPS" },
  { value: "Sentinel Comores", label: "Sentinel Comores" },
  { value: "Sims Telco", label: "Sims Telco" },
  { value: "VMS", label: "VMS" },
  { value: "REQ", label: "REQ" },
  { value: "S2 Mayotte", label: "S2 Mayotte" },
  { value: "S2 Réunion", label: "S2 Réunion" },
  { value: "S2 Run", label: "S2 Run" },
  { value: "S2 May", label: "S2 May" },
  { value: "Sav Only", label: "Sav Only" },
  { value: "Helios", label: "Helios" },
  { value: "UPYA", label: "UPYA" },
  { value: "Visio", label: "Visio" },
  { value: "Service Now", label: "Service Now" },
  { value: "YouTube", label: "YouTube" },
  { value: "INOCX", label: "INOCX" },
  { value: "Centraltest", label: "Centraltest" },
  { value: "Linkedin", label: "Linkedin" },
  { value: "SAGE RH", label: "SAGE RH" },
  { value: "Adobe", label: "Adobe" },
  { value: "Canva", label: "Canva" },
  { value: "Instagram", label: "Instagram" },
  { value: "Mojo", label: "Mojo" },
  { value: "Aithor", label: "Aithor" },
  { value: "SugarCRM", label: "SugarCRM" },
  { value: "E-koragna", label: "E-koragna" },
  { value: "Google Sheet", label: "Google Sheet" },
  { value: "Google Collab", label: "Google Collab" },
  { value: "Looker Studio", label: "Looker Studio" },
  { value: "App Sheet", label: "App Sheet" },
  { value: "Whois.com", label: "Whois.com" },
  { value: "DOLIBAR Callity", label: "DOLIBAR Callity" },
  { value: "Bot Agent", label: "Bot Agent" },
  { value: "Cogneed", label: "Cogneed" },
  { value: "CRM Client", label: "CRM Client" },
  { value: "Odigo", label: "Odigo" },
  { value: "I Advize", label: "I Advize" },
  { value: "KEYYO", label: "KEYYO" },
  { value: "SAGE 1000", label: "SAGE 1000" },
  { value: "BAYA", label: "BAYA" },
  { value: "Winscp", label: "Winscp" },
  { value: "Python", label: "Python" }
];

let users = [];
let currentUser = null;
let dashboardData = [];
let chartSuivi = null;
let chartEtat = null;
let detailsCache = {}; // Cache pour stocker les données de détails
let isSaving = false; // 🔥 Flag pour empêcher les clics multiples


// ===============================
// NAVIGATION
// ===============================
function showDashboard() {
  el.formCard.classList.add("hidden");
  el.dashboardCard.classList.remove("hidden");
  el.detailCard.classList.add("hidden");

  document.getElementById("btnForm")?.classList.remove("active");
  document.getElementById("btnDash")?.classList.add("active");
  document.getElementById("btnDetail")?.classList.remove("active");

  loadDashboard();
}

function showForm() {
  el.dashboardCard.classList.add("hidden");
  el.detailCard.classList.add("hidden");
  el.formCard.classList.remove("hidden");

  document.getElementById("btnDash")?.classList.remove("active");
  document.getElementById("btnDetail")?.classList.remove("active");
  document.getElementById("btnForm")?.classList.add("active");
}

function showDetail() {
  el.formCard.classList.add("hidden");
  el.dashboardCard.classList.add("hidden");
  el.detailCard.classList.remove("hidden");

  document.getElementById("btnForm")?.classList.remove("active");
  document.getElementById("btnDash")?.classList.remove("active");
  document.getElementById("btnDetail")?.classList.add("active");

  loadDetail();
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
      opt.value = u.matricule;  // 🔥 Utiliser le matricule au lieu de l'index
      opt.textContent = `${u.matricule} - ${u.nom}`;
      el.matricule.appendChild(opt);
    });

  } catch (err) {
    console.error("loadUsers failed", err);
    showApiError(`Impossible de charger la liste des utilisateurs: ${err.message}`);
  }
}


// ===============================
// NORMALIZE OUTILS (migrate old structure)
// ===============================
function normalizeOutils(outils) {
  if (!outils || !Array.isArray(outils)) return [];
  
  return outils.map(o => {
    // Si l'outil utilise l'ancienne structure avec 'date', le convertir
    if (o.date && !o.dateDebut && !o.dateFin) {
      return {
        outil: o.outil || "",
        ticket: o.ticket || "",
        statut: o.statut || "En cours",
        dateDebut: o.date || "",
        dateFin: ""
      };
    }
    // Sinon, s'assurer que tous les champs existent
    return {
      outil: o.outil || "",
      ticket: o.ticket || "",
      statut: o.statut || "En cours",
      dateDebut: o.dateDebut || "",
      dateFin: o.dateFin || ""
    };
  });
}


// ===============================
// LOAD USER IN FORM
// ===============================
// EDIT USER FROM DASHBOARD
// ===============================
function editUser(matricule) {
  // 🔥 Sélectionner directement par matricule
  el.matricule.value = matricule;
  loadUser();
  showForm();
}


// ===============================
// SHOW DETAILS MODAL (OUTILS)
// ===============================
function showDetails(detailId) {
  const modal = document.getElementById("detailsModal");
  const tbody = document.getElementById("detailsTableBody");
  
  if (!modal || !tbody) return;
  
  // Récupérer les données du cache
  const details = detailsCache[detailId];
  if (!details) {
    console.error("Détails non trouvés:", detailId);
    return;
  }
  
  // Remplir le header
  document.getElementById("detailsModalMatricule").textContent = details.matricule;
  document.getElementById("detailsModalNom").textContent = details.nom;
  
  // Remplir les infos générales
  document.getElementById("detailsDateCreation").textContent = details.dateCreation;
  document.getElementById("detailsDeadline").textContent = details.deadline;
  
  // Remplir la table des outils
  tbody.innerHTML = "";
  
  const outils = details.outils;
  
  if (!outils || outils.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Aucun outil</td></tr>';
  } else {
    outils.forEach(o => {
      const statusClass = o.statut === "Terminé" ? "status-success" : "status-info";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${o.outil || "-"}</strong></td>
        <td><span class="badge ${statusClass}">${o.statut || "En cours"}</span></td>
        <td>${o.dateDebut || "-"}</td>
        <td>${o.dateFin || "-"}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Afficher la modal
  modal.classList.remove("hidden");
}

function closeDetails() {
  const modal = document.getElementById("detailsModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}


// ===============================
window.loadUser = function () {
  const matriculeSelected = el.matricule.value;
  if (matriculeSelected === "") {
    el.msg.textContent = "";
    el.msg.style.color = "";
    return;
  }

  // 🔥 Chercher par matricule au lieu de par index
  currentUser = users.find(u => u.matricule === matriculeSelected);

  if (!currentUser) {
    resetForm();
    return;
  }

  // Normaliser les outils (ancienne structure → nouvelle)
  if (!currentUser.outils) {
    currentUser.outils = [];
  } else {
    currentUser.outils = normalizeOutils(currentUser.outils);
  }

  el.dateFin.removeEventListener('change', handleDateFinChange);
  el.dateFin.addEventListener('change', handleDateFinChange);

  el.affichageMatricule.textContent = currentUser.matricule || "";
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

  el.msg.textContent = "";
  el.msg.style.color = "";
};


// ===============================
// RENDER OUTILS DYNAMIQUES (sans Rejeté)
// ===============================
function renderOutils() {
  if (!currentUser) return;

  el.outils.innerHTML = "";

  const container = document.createElement("div");
  container.className = "outils-container";

  currentUser.outils.forEach((o, idx) => {
    const card = document.createElement("div");
    card.className = "outil-card";

    let badgeClass = "en-cours";
    if (o.statut === "Terminé") badgeClass = "termine";

    card.innerHTML = `
      <span class="outil-status-badge ${badgeClass}">${o.statut || "En cours"}</span>

      <div class="outil-box">
        <label>📋 Outil</label>
        <select class="outil-nom" data-index="${idx}">
          <option value="">-- Choisir un outil --</option>
          ${OUTILS_DISPONIBLES.map(t => `<option value="${t.value}" ${o.outil === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
        </select>
      </div>

      <div class="outil-box">
        <label>🎟️ N° Ticket</label>
        <input type="text" class="outil-ticket" data-index="${idx}" value="${o.ticket || ""}" placeholder="Ex: Insérez le numéro de ticket..." />
      </div>

      <div class="outil-box">
        <label>✓ Statut</label>
        <select class="outil-statut" data-index="${idx}" ${(!o.outil || String(o.outil).trim() === "" || o.statut === "Terminé") ? "disabled" : ""}>
          <option value="En cours" ${(o.statut || "En cours") === "En cours" ? "selected" : ""}>En cours</option>
          <option value="Terminé" ${o.statut === "Terminé" ? "selected" : ""}>Terminé</option>
        </select>
      </div>

      <div class="outil-box">
        <label>📅 Début</label>
        <input type="date" class="outil-dateDebut" data-index="${idx}" value="${convertToISO(o.dateDebut || "")}" />
      </div>

      <div class="outil-box">
        <label>🏁 Fin</label>
        <input type="text" class="outil-dateFin" data-index="${idx}" value="${o.dateFin || ""}" readonly />
      </div>

      <button class="outil-delete-btn" data-index="${idx}" onclick="deleteOutil(${idx})" ${(o.statut || "En cours") !== "En cours" ? "disabled" : ""}>
        🗑️ Supprimer
      </button>
    `;

    container.appendChild(card);
  });

  el.outils.appendChild(container);

  // Synchronisation défensive
  const nomsAfter = container.querySelectorAll('.outil-nom');
  nomsAfter.forEach(inp => {
    const idx = parseInt(inp.dataset.index);
    const val = (inp.value || '').trim();
    const sel = container.querySelector(`.outil-statut[data-index="${idx}"]`);
    
    if (sel) {
      sel.disabled = (val === '' || currentUser?.outils?.[idx]?.statut === 'Terminé');
      if (val === '') {
        sel.value = 'En cours';
        if (currentUser?.outils?.[idx]) currentUser.outils[idx].statut = 'En cours';
      }
    }

    const delBtn = container.querySelector(`.outil-delete-btn[data-index="${idx}"]`);
    if (delBtn) {
      delBtn.disabled = (currentUser?.outils?.[idx]?.statut !== 'En cours');
    }
  });

  setupOutilsEvents();
  updateOutilsDisabledState();
}


// ===============================
// ADD OUTIL
// ===============================
window.addOutil = function () {
  if (!currentUser) {
    el.msg.textContent = "❌ Veuillez d'abord sélectionner un collaborateur";
    el.msg.style.color = "red";
    return;
  }

  currentUser.outils.push({
    outil: "",
    ticket: "",
    statut: "En cours",
    dateDebut: todayFR(),  // 🔥 Date du jour J
    dateFin: ""
  });

  renderOutils();
  updateEtat();
  setupOutilsEvents();
  updateOutilsDisabledState();
};


// ===============================
// DELETE OUTIL
// ===============================
window.deleteOutil = function (idx) {
  if (!currentUser) return;

  const outil = currentUser.outils[idx];
  if (!outil) return;

  if (outil.statut !== "En cours") {
    el.msg.textContent = "❌ Impossible de supprimer un outil terminé";
    el.msg.style.color = "red";
    return;
  }

  currentUser.outils.splice(idx, 1);
  renderOutils();
  updateEtat();
};


// ===============================
// EVENTS OUTILS
// ===============================
function updateOutilsDisabledState() {
  const allSelects = document.querySelectorAll(".outil-nom");
  
  // Récupérer les outils sélectionnés (sauf les vides)
  const selectedOutils = new Set();
  allSelects.forEach(select => {
    if (select.value && select.value.trim() !== "") {
      selectedOutils.add(select.value);
    }
  });

  // Pour chaque select, désactiver les options déjà sélectionnées ailleurs
  allSelects.forEach(select => {
    const currentValue = select.value;
    const options = select.querySelectorAll("option");
    
    options.forEach(option => {
      if (option.value && option.value.trim() !== "") {
        // Désactiver si sélectionné AILLEURS (pas dans ce select)
        if (selectedOutils.has(option.value) && option.value !== currentValue) {
          option.disabled = true;
        } else {
          option.disabled = false;
        }
      }
    });
  });
}

function setupOutilsEvents() {
  const outils = document.querySelectorAll(".outil-nom");  // C'est maintenant un SELECT
  const selects = document.querySelectorAll(".outil-statut");
  const tickets = document.querySelectorAll(".outil-ticket");
  const dateDebuts = document.querySelectorAll(".outil-dateDebut");

  outils.forEach(select => {
    select.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index);
      const val = e.target.value || "";
      currentUser.outils[idx].outil = val;

      const sel = document.querySelector(`.outil-statut[data-index="${idx}"]`);
      if (sel) {
        if (val.trim() === "") {
          sel.value = "En cours";
          sel.disabled = true;
          currentUser.outils[idx].statut = "En cours";
        } else {
          sel.disabled = currentUser.outils[idx].statut === "Terminé";
        }
      }

      // 🔥 Mettre à jour l'état des options pour éviter les doublons
      updateOutilsDisabledState();
    });
  });

  selects.forEach(sel => {
    sel.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index);
      currentUser.outils[idx].statut = e.target.value;

      if (e.target.value === "Terminé" && !currentUser.outils[idx].dateFin) {
        currentUser.outils[idx].dateFin = todayFR();  // 🔥 Date fin = aujourd'hui
      }

      updateEtat();
      renderOutils();   // refresh badges + disabled states
    });
  });

  // 🔥 Event listener pour N° Ticket
  tickets.forEach(input => {
    input.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index);
      currentUser.outils[idx].ticket = e.target.value || "";
    });
  });

  // 🔥 Event listener pour Date Début
  dateDebuts.forEach(input => {
    input.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index);
      const dateISO = e.target.value || "";
      currentUser.outils[idx].dateDebut = convertToFR(dateISO);
    });
  });
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

  const allTermine = outils.length > 0 && outils.every(o => o.statut === "Terminé");

  if (allTermine) {
    currentUser.etat = "Terminé";

    // Récupérer les dates de fin (dateFin) pour trouver la plus récente
    const dates = outils
      .filter(o => o.dateFin && o.dateFin !== "")
      .map(o => o.dateFin);

    if (dates.length > 0) {
      // dernière date (la plus récente)
      currentUser.dateFin = dates[dates.length - 1];
    } else {
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
// SAVE USER
// ===============================
window.save = async function () {
  // 🔥 Empêcher les clics multiples avec le flag
  if (isSaving) {
    return;
  }

  if (!currentUser) {
    el.msg.textContent = "❌ Veuillez sélectionner un matricule !";
    el.msg.style.color = "red";
    return;
  }

  isSaving = true;
  el.msg.textContent = "⏳ Enregistrement en cours...";
  el.msg.style.color = "blue";

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

  // 🔥 VALIDATION : Vérifier s'il y a des outils vides
  const outilsVides = currentUser.outils.filter(o => !o.outil || o.outil.trim() === "");
  
  if (outilsVides.length > 0) {
    // Mettre la zone d'outils en rouge
    el.outils.style.border = "3px solid #ef4444";
    el.outils.style.backgroundColor = "#fef2f2";
    el.outils.style.padding = "16px";
    el.outils.style.borderRadius = "8px";
    
    el.msg.textContent = "❌ Veuillez sélectionner un outil pour chaque ligne AVANT d'enregistrer !";
    el.msg.style.color = "red";
    el.msg.style.fontWeight = "bold";
    
    isSaving = false;
    return;
  } else {
    // Enlever le style rouge si validation OK
    el.outils.style.border = "";
    el.outils.style.backgroundColor = "";
    el.outils.style.padding = "";
    el.outils.style.borderRadius = "";
  }

  // 🔥 Supprimer les outils vides (si validation OK)
  currentUser.outils = currentUser.outils.filter(o => o.outil && o.outil.trim() !== "");

  updateEtat();

  try {
    const url = `${API_URL}?action=saveUser&data=${encodeURIComponent(JSON.stringify(currentUser))}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const result = await res.json();

    if (result.success) {
      el.msg.textContent = "✅ Enregistré avec succès";
      el.msg.style.color = "green";

      // Recharger les données du serveur pour mettre à jour Etat et StatutSuivi
      await loadUsers();
      
      // Récupérer le matricule du currentUser AVANT le reload
      const matriculeToReload = currentUser.matricule;
      
      // Sélectionner à nouveau avec le matricule
      el.matricule.value = matriculeToReload;
      loadUser();
      
      // IMPORTANT: Débloquer AVANT de terminer
      isSaving = false;
    } else {
      el.msg.textContent = "❌ Erreur lors de l'enregistrement";
      el.msg.style.color = "red";
      isSaving = false;
    }

  } catch (err) {
    console.error(err);
    el.msg.textContent = "❌ Impossible de contacter l'API";
    el.msg.style.color = "red";
    isSaving = false;
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
  detailsCache = {}; // Vider le cache avant de remplir

  data.forEach((row, index) => {
    const suiviClass =
      row.statutSuivi === "Respecté"   ? "status-success" :
      row.statutSuivi === "Non respecté" ? "status-danger" :
      "status-info";

    const modifyBtn = row.etat === "En cours" 
      ? `<button class="btn btn-action btn-modify" onclick="editUser('${row.matricule}')">✏️ Modifier</button>`
      : `<button class="btn btn-action btn-disabled" disabled>✓ Terminé</button>`;

    tbody.innerHTML += `
      <tr>
        <td><strong>${row.matricule || ""}</strong></td>
        <td>${row.statut || ""}</td>
        <td>${row.nom || ""}</td>
        <td>${row.fonction || ""}</td>
        <td>${row.rattachement || ""}</td>
        <td>${row.login || ""}</td>
        <td>${row.dateCreation || ""}</td>
        <td>${row.deadline || ""}</td>
        <td>${row.etat || ""}</td>
        <td>${row.dateFin || ""}</td>
        <td><span class="badge ${suiviClass}">${row.statutSuivi || ""}</span></td>
        <td>${modifyBtn}</td>
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

  const enCours    = dashboardData.filter(u => u.statutSuivi === "En cours").length;
  const respecte   = dashboardData.filter(u => u.statutSuivi === "Respecté").length;
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
          legend: { position: "bottom", labels: { padding: 12, font: { size: 12 }, usePointStyle: true } }
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
          legend: { position: "bottom", labels: { padding: 12, font: { size: 12 }, usePointStyle: true } }
        }
      }
    });
  } catch (err) {
    console.error("Erreur création graphique Etat:", err);
  }
}


// ===============================
// LOAD DETAIL
// ===============================
async function loadDetail() {
  try {
    const res = await fetch(`${API_URL}?action=getDashboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    dashboardData = data || [];

    // Populer les filtres
    populateDetailFilters();

    // Afficher les détails
    renderDetailTable(dashboardData);

  } catch (err) {
    console.error("loadDetail failed", err);
    el.detailEmptyMessage.style.display = "block";
    el.detailEmptyMessage.textContent = `❌ Impossible de charger les détails: ${err.message}`;
  }
}

// ===============================
// POPULATE DETAIL FILTERS
// ===============================
function populateDetailFilters() {
  // Matricules
  const matricules = [...new Set(dashboardData.map(u => u.matricule).filter(m => m))];
  el.filterDetailMatricule.innerHTML = '<option value="">-- Tous les matricules --</option>';
  matricules.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    el.filterDetailMatricule.appendChild(opt);
  });

  // Fonctions
  const fonctions = [...new Set(dashboardData.map(u => u.fonction).filter(f => f))];
  el.filterDetailFonction.innerHTML = '<option value="">-- Toutes les fonctions --</option>';
  fonctions.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    el.filterDetailFonction.appendChild(opt);
  });

  // Rattachements
  const rattachements = [...new Set(dashboardData.map(u => u.rattachement).filter(r => r))];
  el.filterDetailRattachement.innerHTML = '<option value="">-- Tous les rattachements --</option>';
  rattachements.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    el.filterDetailRattachement.appendChild(opt);
  });
}

// ===============================
// APPLY DETAIL FILTERS
// ===============================
function applyDetailFilters() {
  const matricule = el.filterDetailMatricule.value;
  const fonction = el.filterDetailFonction.value;
  const rattachement = el.filterDetailRattachement.value;
  const statut = el.filterDetailStatut.value;

  const filteredData = dashboardData.filter(u => {
    const matchMatricule = !matricule || u.matricule === matricule;
    const matchFonction = !fonction || u.fonction === fonction;
    const matchRattachement = !rattachement || u.rattachement === rattachement;
    
    // Filtrer par statut: vérifier si au moins un outil a le statut demandé
    let matchStatut = true;
    if (statut) {
      if (!u.outils || u.outils.length === 0) {
        matchStatut = false;
      } else {
        matchStatut = u.outils.some(o => o.statut === statut);
      }
    }
    
    return matchMatricule && matchFonction && matchRattachement && matchStatut;
  });

  renderDetailTable(filteredData);
}

// ===============================
// RESET DETAIL FILTERS
// ===============================
function resetDetailFilters() {
  el.filterDetailMatricule.value = "";
  el.filterDetailFonction.value = "";
  el.filterDetailRattachement.value = "";
  el.filterDetailStatut.value = "";
  renderDetailTable(dashboardData);
}

// ===============================
// RENDER DETAIL TABLE
// ===============================
function renderDetailTable(data) {
  el.detailTableBody.innerHTML = "";
  el.detailEmptyMessage.style.display = "none";

  // Créer une liste d'outils (déploiement)
  const rows = [];

  data.forEach(user => {
    if (!user.outils || user.outils.length === 0) {
      rows.push({
        matricule: user.matricule,
        nom: user.nom,
        fonction: user.fonction,
        rattachement: user.rattachement,
        login: user.login,
        outil: "---",
        ticket: "---",
        statut: "---",
        dateDebut: "---",
        dateFin: "---"
      });
    } else {
      user.outils.forEach(outil => {
        rows.push({
          matricule: user.matricule,
          nom: user.nom,
          fonction: user.fonction,
          rattachement: user.rattachement,
          login: user.login,
          outil: outil.outil || "---",
          ticket: outil.ticket || "---",
          statut: outil.statut || "---",
          dateDebut: outil.dateDebut || "---",
          dateFin: outil.dateFin || "---"
        });
      });
    }
  });

  if (rows.length === 0) {
    el.detailEmptyMessage.style.display = "block";
    el.detailEmptyMessage.textContent = "Aucune donnée à afficher";
  } else {
    rows.forEach(row => {
      const tr = document.createElement("tr");
      const editBtn = `<button class="btn-edit" onclick="editUser('${row.matricule}')">✏️ Modifier</button>`;
      
      tr.innerHTML = `
        <td><strong>${row.matricule}</strong></td>
        <td>${row.nom}</td>
        <td>${row.fonction}</td>
        <td>${row.rattachement}</td>
        <td>${row.login}</td>
        <td>${row.outil}</td>
        <td>${row.ticket}</td>
        <td>
          <span class="badge ${row.statut === 'Terminé' ? 'status-success' : 'status-info'}">
            ${row.statut}
          </span>
        </td>
        <td>${row.dateDebut}</td>
        <td>${row.dateFin}</td>
        <td>${editBtn}</td>
      `;
      el.detailTableBody.appendChild(tr);
    });
  }
}


// ===============================
// FILTER TABLE
// ===============================
function setupTableFilters() {
  const searchBox  = document.getElementById("searchBox");
  const etatFilter  = document.getElementById("etatFilter");
  const suiviFilter = document.getElementById("suiviFilter");

  if (!searchBox || !etatFilter || !suiviFilter) return;

  const filterTable = () => {
    const searchTerm = searchBox.value.toLowerCase();
    const etatValue  = etatFilter.value;
    const suiviValue = suiviFilter.value;

    const tbody = document.querySelector("#dashboardTable tbody");
    if (!tbody) return;

    const rows = tbody.querySelectorAll("tr");

    rows.forEach(row => {
      const matricule = row.cells[0]?.textContent.toLowerCase() || "";
      const statut    = row.cells[1]?.textContent.toLowerCase() || "";
      const nom       = row.cells[2]?.textContent.toLowerCase() || "";
      const login     = row.cells[5]?.textContent.toLowerCase() || "";

      const etat  = row.cells[8]?.textContent || "";
      const suivi = row.cells[10]?.textContent || "";

      const matchSearch =
        matricule.includes(searchTerm) ||
        statut.includes(searchTerm)    ||
        nom.includes(searchTerm)       ||
        login.includes(searchTerm);

      const matchEtat  = !etatValue || etat === etatValue;
      const matchSuivi = !suiviValue || suivi.includes(suiviValue);

      row.style.display = matchSearch && matchEtat && matchSuivi ? "" : "none";
    });
  };

  searchBox.oninput   = filterTable;
  etatFilter.onchange  = filterTable;
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
    node.textContent = message + " — Vérifiez le déploiement Web App et les permissions (Anyone, even anonymous).";
    node.style.color = "red";
  } else {
    console.error(message);
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

// bonjour