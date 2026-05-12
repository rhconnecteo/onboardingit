/*******************************************************
 * CODE.GS
 * API Google Apps Script pour lire et enregistrer
 * les données de la feuille Google Sheets "IT".
 *
 * Colonnes dans la feuille "IT" :
 * 1  = Matricule
 * 2  = Statut
 * 3  = Nom et Prénoms
 * 4  = Fonction
 * 5  = Rattachement
 * 6  = Date d'intégration
 * 7  = Login
 * 8  = Date de création
 * 9  = Deadline (calculée automatiquement ou saisie)
 * 10 = Date fin (calculée dans JavaScript puis enregistrée ici)
 * 11 = StatutSuivi (formule Google Sheets)
 * 12 = Etat (formule Google Sheets)
 *
 * Ensuite à partir de la colonne 13 :
 * Outil1 | N° Ticket | Statut | Date Début | Date Fin |
 * Outil2 | N° Ticket | Statut | Date Début | Date Fin ...
 *
 *******************************************************/

const SPREADSHEET_ID = "1s-xEaEL_AT1_sMP3nQezj4QSHyNUKEw4XeOlOwjABp4";
const SHEET_NAME = "IT";


/* =====================================================
   1) ENTRY POINT : doGet()
   Cette fonction reçoit les requêtes HTTP GET.
   Exemple :
   - ?action=getUsers
   - ?action=getDashboard
   - ?action=saveUser&data=....
===================================================== */
function doGet(e) {
  const parameters = e && e.parameter ? e.parameter : {};
  const action = parameters.action;

  if (!action) {
    return outputResponse({ error: "Action manquante" }, e);
  }

  try {
    switch (action) {

      case "getUsers":
        return outputResponse(getUsersAPI(), e);

      case "getDashboard":
        return outputResponse(getDashboardAPI(), e);

      case "saveUser":

        if (!parameters.data) {
          return outputResponse({ error: "Paramètre data manquant" }, e);
        }

        const user = JSON.parse(parameters.data);

        saveUserAPI(user);

        return outputResponse({ success: true }, e);

      default:
        return outputResponse({ error: "Action invalide : " + action }, e);
    }
  } catch (err) {
    return outputResponse({ error: err && err.message ? err.message : String(err) }, e);
  }
}


/* =====================================================
   1.b) outputResponse(obj, e)
   Retourne JSON normal ou JSONP si callback est fourni.
===================================================== */
function outputResponse(obj, e) {
  const callback = e && e.parameter ? (e.parameter.callback || "") : "";

  if (callback) {
    return outputJSONP(callback, obj);
  }

  return outputJSON(obj);
}


/* =====================================================
   1.c) outputJSONP(callback, obj)
   Permet les appels cross-origin via balise <script>.
===================================================== */
function outputJSONP(callback, obj) {
  const safeCallback = String(callback).replace(/[^a-zA-Z0-9_$.]/g, "");
  const payload = safeCallback + "(" + JSON.stringify(obj) + ")";

  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}


/* =====================================================
   2) outputJSON()
   Transforme un objet JS en réponse JSON lisible
===================================================== */
function outputJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);

  if (!sh) {
    throw new Error("Feuille introuvable : " + SHEET_NAME);
  }

  return sh;
}

function normalizeHeader(h) {
  if (h === undefined || h === null) return "";
  try {
    return String(h)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  } catch (e) {
    return String(h).toLowerCase().replace(/\s+/g, " ").trim();
  }
}

function getHeaderMap(sh) {
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0] || [];
  const map = {};

  for (let i = 0; i < headers.length; i++) {
    const key = normalizeHeader(headers[i]);
    if (key) map[key] = i;
  }

  return map;
}

function colIndex(name, headerMap, fallbackOneBased) {
  const key = normalizeHeader(name);
  if (headerMap && Object.prototype.hasOwnProperty.call(headerMap, key)) return headerMap[key];
  return typeof fallbackOneBased === "number" ? (fallbackOneBased - 1) : undefined;
}

function findToolsStartIndex(headerMap, sh) {
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0] || [];

  for (let i = 0; i < headers.length; i++) {
    const h = normalizeHeader(headers[i]);
    if (h && h.indexOf("outil") !== -1) return i;
  }

  const known = [
    "matricule", "statut", "nom et prenoms", "nom et prenoms", "fonction", "rattachement",
    "date d integration", "date dintegration", "date d'integration", "date de creation", "date de creation",
    "login", "deadline", "date fin", "statutsuivi", "etat"
  ];

  let maxIdx = -1;

  known.forEach((k) => {
    const i = headerMap[normalizeHeader(k)];
    if (typeof i === "number" && i > maxIdx) maxIdx = i;
  });

  if (maxIdx >= 0) return maxIdx + 1;

  return 12;
}

function getMainColumnIndex(name, headerMap, sh, toolsStart, fallbackOneBased) {
  const key = normalizeHeader(name);
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0] || [];
  const limit = typeof toolsStart === "number" ? Math.min(toolsStart, headers.length) : headers.length;

  for (let i = 0; i < limit; i++) {
    if (normalizeHeader(headers[i]) === key) return i;
  }

  const fallbackIndex = colIndex(name, headerMap, fallbackOneBased);
  if (typeof fallbackIndex === "number" && (typeof toolsStart !== "number" || fallbackIndex < toolsStart)) {
    return fallbackIndex;
  }

  return typeof fallbackOneBased === "number" ? (fallbackOneBased - 1) : undefined;
}


/* =====================================================
   3) getUsersAPI()
   Récupère tous les utilisateurs dont Etat != "Terminé"
   (Etat = colonne 12)
===================================================== */
function getUsersAPI() {
  const sh = getSheet();
  const headerMap = getHeaderMap(sh);
  const data = sh.getDataRange().getDisplayValues();

  const res = [];
  const toolsStart = findToolsStartIndex(headerMap, sh);

  const matriculeCol = getMainColumnIndex("matricule", headerMap, sh, toolsStart, 1);
  const statutCol = getMainColumnIndex("statut", headerMap, sh, toolsStart, 2);
  const nomCol = getMainColumnIndex("nom et prenoms", headerMap, sh, toolsStart, 3);
  const fonctionCol = getMainColumnIndex("fonction", headerMap, sh, toolsStart, 4);
  const rattachementCol = getMainColumnIndex("rattachement", headerMap, sh, toolsStart, 5);
  const dateIntegrationCol = getMainColumnIndex("date d integration", headerMap, sh, toolsStart, 6);
  const loginCol = getMainColumnIndex("login", headerMap, sh, toolsStart, 7);
  const dateCreationCol = getMainColumnIndex("date de creation", headerMap, sh, toolsStart, 8);
  const deadlineCol = getMainColumnIndex("deadline", headerMap, sh, toolsStart, 9);
  const dateFinCol = getMainColumnIndex("date fin", headerMap, sh, toolsStart, 10);
  const statutSuiviCol = getMainColumnIndex("statutsuivi", headerMap, sh, toolsStart, 11);
  const etatCol = getMainColumnIndex("etat", headerMap, sh, toolsStart, 12);

  for (let i = 1; i < data.length; i++) {
    const matricule = (data[i][matriculeCol] || "").trim();

    if (!matricule) continue;

    const etat = (data[i][etatCol] || "En cours").trim();

    if (etat === "Terminé") continue;

    let outils = [];

    for (let col = toolsStart; col < data[i].length; col += 5) {
      const outil = (data[i][col] || "").trim();
      const ticket = (data[i][col + 1] || "").trim();
      const statut = (data[i][col + 2] || "").trim();
      const dateDebut = (data[i][col + 3] || "").trim();
      const dateFin = (data[i][col + 4] || "").trim();

      if (outil) {
        outils.push({
          outil: outil,
          ticket: ticket || "",
          statut: statut || "En cours",
          dateDebut: dateDebut || "",
          dateFin: dateFin || ""
        });
      }
    }

    res.push({
      row: i + 1,

      matricule: matricule,
      statut: data[i][statutCol],
      nom: data[i][nomCol],
      fonction: data[i][fonctionCol],
      rattachement: data[i][rattachementCol],
      dateIntegration: data[i][dateIntegrationCol],

      login: data[i][loginCol],
      dateCreation: data[i][dateCreationCol],
      deadline: data[i][deadlineCol],

      dateFin: data[i][dateFinCol] || "",
      statutSuivi: data[i][statutSuiviCol] || "",
      etat: etat,

      outils: outils
    });
  }

  return res;
}


/* =====================================================
   4) saveUserAPI(user)
   Enregistre dans la feuille IT :
   - Date fin (col 10) => envoyée depuis JavaScript
   - Les outils (à partir de col 13)
   ⚠️ Ne touche pas Etat et StatutSuivi (formules Sheets)
===================================================== */
function saveUserAPI(user) {
  const sh = getSheet();

  if (!user) {
    throw new Error("Paramètre user manquant");
  }

  if (!user.row) {
    throw new Error("Row manquant dans user");
  }

  const row = user.row;

  const headerMap = getHeaderMap(sh);
  const toolsStart = findToolsStartIndex(headerMap, sh);

  const dateFinCol = getMainColumnIndex("date fin", headerMap, sh, toolsStart, 10);

  // =========================================
  // 1) Sauvegarder Date fin
  // =========================================
  if (typeof dateFinCol === "number") {
    sh.getRange(row, dateFinCol + 1).setValue(user.dateFin || "");
  }


  // =========================================
  // 2) NE PAS toucher StatutSuivi et Etat
  // =========================================
  // Col 11 = StatutSuivi (formule Google Sheets)
  // Col 12 = Etat (formule Google Sheets)
  // On ne touche pas pour ne pas casser les formules.


  // =========================================
  // 3) Nettoyer les anciens outils
  // =========================================
  const lastCol = sh.getLastColumn();
  const startColOneBased = toolsStart + 1;

  if (lastCol >= startColOneBased) {
    sh.getRange(row, startColOneBased, 1, lastCol - (startColOneBased - 1)).clearContent();
  }


  // =========================================
  // 4) Réécrire les outils envoyés
  // =========================================
  // Chaque outil prend 5 colonnes :
  // Outil | N° Ticket | Statut | Date Début | Date Fin
  if (user.outils && user.outils.length > 0) {

    user.outils.forEach((o, i) => {

      const col = startColOneBased + i * 5;

      sh.getRange(row, col).setValue(o.outil || "");
      sh.getRange(row, col + 1).setValue(o.ticket || "");
      sh.getRange(row, col + 2).setValue(o.statut || "En cours");
      sh.getRange(row, col + 3).setValue(o.dateDebut || "");
      sh.getRange(row, col + 4).setValue(o.dateFin || "");
    });
  }
}


/* =====================================================
   5) getDashboardAPI()
   Récupère tous les utilisateurs (sans filtre Etat)
===================================================== */
function getDashboardAPI() {
  const sh = getSheet();
  const headerMap = getHeaderMap(sh);
  const data = sh.getDataRange().getDisplayValues();

  const res = [];
  const toolsStart = findToolsStartIndex(headerMap, sh);

  const matriculeCol = getMainColumnIndex("matricule", headerMap, sh, toolsStart, 1);
  const statutCol = getMainColumnIndex("statut", headerMap, sh, toolsStart, 2);
  const nomCol = getMainColumnIndex("nom et prenoms", headerMap, sh, toolsStart, 3);
  const fonctionCol = getMainColumnIndex("fonction", headerMap, sh, toolsStart, 4);
  const rattachementCol = getMainColumnIndex("rattachement", headerMap, sh, toolsStart, 5);
  const dateIntegrationCol = getMainColumnIndex("date d integration", headerMap, sh, toolsStart, 6);
  const loginCol = getMainColumnIndex("login", headerMap, sh, toolsStart, 7);
  const dateCreationCol = getMainColumnIndex("date de creation", headerMap, sh, toolsStart, 8);
  const deadlineCol = getMainColumnIndex("deadline", headerMap, sh, toolsStart, 9);
  const dateFinCol = getMainColumnIndex("date fin", headerMap, sh, toolsStart, 10);
  const statutSuiviCol = getMainColumnIndex("statutsuivi", headerMap, sh, toolsStart, 11);
  const etatCol = getMainColumnIndex("etat", headerMap, sh, toolsStart, 12);

  for (let i = 1; i < data.length; i++) {
    const matricule = (data[i][matriculeCol] || "").trim();

    if (!matricule) continue;

    let outils = [];

    for (let col = toolsStart; col < data[i].length; col += 5) {
      const outil = (data[i][col] || "").trim();
      const ticket = (data[i][col + 1] || "").trim();
      const statut = (data[i][col + 2] || "").trim();
      const dateDebut = (data[i][col + 3] || "").trim();
      const dateFin = (data[i][col + 4] || "").trim();

      if (outil) {
        outils.push({
          outil: outil,
          ticket: ticket || "",
          statut: statut || "En cours",
          dateDebut: dateDebut || "",
          dateFin: dateFin || ""
        });
      }
    }

    res.push({
      matricule: matricule,
      statut: data[i][statutCol],
      nom: data[i][nomCol],
      fonction: data[i][fonctionCol],
      rattachement: data[i][rattachementCol],
      dateIntegration: data[i][dateIntegrationCol],

      login: data[i][loginCol],
      dateCreation: data[i][dateCreationCol],
      deadline: data[i][deadlineCol],

      dateFin: data[i][dateFinCol] || "",
      statutSuivi: data[i][statutSuiviCol] || "",
      etat: data[i][etatCol] || "",

      outils: outils
    });
  }

  return res;
}
