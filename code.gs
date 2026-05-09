/*******************************************************
 * CODE.GS
 * API Google Apps Script pour lire et enregistrer
 * les données de la feuille Google Sheets "Processus Offboarding".
 *
 * Colonnes dans la feuille "Processus Offboarding" :
 * 1  = Matricule
 * 2  = Statut
 * 3  = Nom et Prénoms
 * 4  = Fonction
 * 5  = Rattachement
 * 6  = Date de départ
 * 7  = Login
 * 8  = Date de création
 * 9  = Deadline (calculée automatiquement ou saisie)
 * 10 = Date fin (calculée dans JavaScript puis enregistrée ici)
 * 11 = Ticket Tyfanie
 * 12 = StatutSuivi (formule Google Sheets)
 * 13 = Etat (formule Google Sheets)
 *
 * Ensuite à partir de la colonne 14 :
 * Outil1 | N° Ticket | Statut | Date Début | Date Fin |
 * Outil2 | N° Ticket | Statut | Date Début | Date Fin ...
 *
 *******************************************************/


const SPREADSHEET_ID = "1h7KpviGAHD7Afh9twRJlH1UzHAp0n4V_6-bZqv_WfCk";
const SHEET_NAME = "Processus Offboarding";


/* =====================================================
   1) ENTRY POINT : doGet()
   Cette fonction reçoit les requêtes HTTP GET.
   Exemple :
   - ?action=getUsers
   - ?action=getDashboard
   - ?action=saveUser&data=....
   - ?callback=maFonctionJsonp
===================================================== */
function doGet(e) {

  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action;
  const callback = params.callback;

  if (!action) {
    return outputJSON({ error: "Action manquante" }, callback);
  }

  switch (action) {

    case "getUsers":
      return outputJSON(getUsersAPI(), callback);

    case "getDashboard":
      return outputJSON(getDashboardAPI(), callback);

    case "saveUser":

      if (!params.data) {
        return outputJSON({ error: "Paramètre data manquant" }, callback);
      }

      const user = JSON.parse(params.data);

      saveUserAPI(user);

      return outputJSON({ success: true }, callback);

    default:
      return outputJSON({ error: "Action invalide : " + action }, callback);
  }
}


/* =====================================================
   2) outputJSON()
   Transforme un objet JS en réponse JSON lisible
===================================================== */
function outputJSON(obj, callback) {
  const payload = JSON.stringify(obj);

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${payload});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}


function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);

  if (!sh) {
    throw new Error(`Feuille introuvable : ${SHEET_NAME}`);
  }

  return sh;
}


/* =====================================================
   Utilitaires : lecture de l'entête et mapping nom->index
   - getHeaderMap(sh) : retourne un objet { normalizedHeader: zeroBasedIndex }
   - colIndex(name, headerMap, fallbackOneBased) : récupère index (0-based)
===================================================== */
function normalizeHeader(h) {
  if (h === undefined || h === null) return "";
  try {
    return String(h)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  } catch (e) {
    return String(h).toLowerCase().replace(/\s+/g, ' ').trim();
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
  if (headerMap && headerMap.hasOwnProperty(key)) return headerMap[key];
  // fallback to provided 1-based column index -> convert to 0-based
  return (typeof fallbackOneBased === 'number') ? (fallbackOneBased - 1) : undefined;
}

function findToolsStartIndex(headerMap, sh) {
  // Prefer explicit headers that contain the word 'outil'
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0] || [];

  for (let i = 0; i < headers.length; i++) {
    const h = normalizeHeader(headers[i]);
    if (h && h.indexOf('outil') !== -1) return i; // zero-based index of first 'outil' header
  }

  // List of possible known header name variants (fallback)
  const known = [
    'matricule','statut','nom et prenoms','nom et prénoms','fonction','rattachement',
    'date de depart','date de départ','date dintegration','date d integration','date d\'integration','login',
    'ticket tyfanie','date de creation','date de création','date de deadline','deadline','date fin','statutsuivi','etat'
  ];

  let maxIdx = -1;

  known.forEach(k => {
    const i = headerMap[normalizeHeader(k)];
    if (typeof i === 'number' && i > maxIdx) maxIdx = i;
  });

  if (maxIdx >= 0) return maxIdx + 1; // start after last known header

  // default fallback: tools start at column 14 (1-based) -> index 13
  return 13;
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

  const toolsStart = findToolsStartIndex(headerMap, sh); // zero-based

  for (let i = 1; i < data.length; i++) {

    const matricule = (data[i][ colIndex('matricule', headerMap, 1) ] || "").trim();

    if (!matricule) continue;

    const etat = (data[i][ colIndex('etat', headerMap, 13) ] || "En cours").trim();

    if (etat === "Terminé") continue;

    // =============================
    // Lecture des outils dynamiques
    // =============================
    let outils = [];

    // Chaque outil prend 5 colonnes : Outil | N° Ticket | Statut | Date Début | Date Fin
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

    // =============================
    // Construire l'objet utilisateur
    // =============================
    res.push({
      row: i + 1,

      matricule: matricule,
      statut: data[i][ colIndex('statut', headerMap, 2) ],
      nom: data[i][ colIndex('nom et prenoms', headerMap, 3) ],
      fonction: data[i][ colIndex('fonction', headerMap, 4) ],
      rattachement: data[i][ colIndex('rattachement', headerMap, 5) ],
      dateDepart: data[i][ colIndex('date de depart', headerMap, 6) ],
      // backward compatibility for old frontend keys
      dateIntegration: data[i][ colIndex('date de depart', headerMap, 6) ],
      // alias for frontend compatibility
      datedepart: data[i][ colIndex('date de depart', headerMap, 6) ],

      login: data[i][ colIndex('login', headerMap, 7) ],
      dateCreation: data[i][ colIndex('date de creation', headerMap, 8) ],
      deadline: data[i][ colIndex('deadline', headerMap, 9) ],

      dateFin: data[i][ colIndex('date fin', headerMap, 10) ] || "",
      ticketTyfanie: data[i][ colIndex('ticket tyfanie', headerMap, 11) ] || "",
      statutSuivi: data[i][ colIndex('statutsuivi', headerMap, 12) ] || "",
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

  if (!user.row) {
    throw new Error("Row manquant dans user");
  }

  const row = user.row;

  const headerMap = getHeaderMap(sh);
  const toolsStart = findToolsStartIndex(headerMap, sh); // zero-based index

  // =========================================
  // 1) Sauvegarder Date fin (colonne nommée 'Date Fin')
  // =========================================
  const dateFinCol = colIndex('date fin', headerMap, 10);
  if (typeof dateFinCol === 'number') {
    sh.getRange(row, dateFinCol + 1).setValue(user.dateFin || "");
  }


  // =========================================
  // 2) NE PAS toucher Ticket Tyfanie, StatutSuivi et Etat
  // =========================================
  // Col 11 = Ticket Tyfanie
  // Col 12 = StatutSuivi (formule Google Sheets)
  // Col 13 = Etat (formule Google Sheets)
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

      const colOneBased = startColOneBased + i * 5;

      sh.getRange(row, colOneBased).setValue(o.outil || "");
      sh.getRange(row, colOneBased + 1).setValue(o.ticket || "");
      sh.getRange(row, colOneBased + 2).setValue(o.statut || "En cours");
      sh.getRange(row, colOneBased + 3).setValue(o.dateDebut || "");
      sh.getRange(row, colOneBased + 4).setValue(o.dateFin || "");
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

  for (let i = 1; i < data.length; i++) {

    const matricule = (data[i][ colIndex('matricule', headerMap, 1) ] || "").trim();

    if (!matricule) continue;

    // =============================
    // Lecture des outils dynamiques
    // =============================
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

    // =============================
    // Construire l'objet utilisateur
    // =============================
    res.push({
      matricule: matricule,
      statut: data[i][ colIndex('statut', headerMap, 2) ],
      nom: data[i][ colIndex('nom et prenoms', headerMap, 3) ],
      fonction: data[i][ colIndex('fonction', headerMap, 4) ],
      rattachement: data[i][ colIndex('rattachement', headerMap, 5) ],
      dateDepart: data[i][ colIndex('date de depart', headerMap, 6) ],
      // backward compatibility for old frontend keys
      dateIntegration: data[i][ colIndex('date de depart', headerMap, 6) ],
      // alias for frontend compatibility
      datedepart: data[i][ colIndex('date de depart', headerMap, 6) ],

      login: data[i][ colIndex('login', headerMap, 7) ],
      dateCreation: data[i][ colIndex('date de creation', headerMap, 8) ],
      deadline: data[i][ colIndex('deadline', headerMap, 9) ],

      dateFin: data[i][ colIndex('date fin', headerMap, 10) ] || "",
      ticketTyfanie: data[i][ colIndex('ticket tyfanie', headerMap, 11) ] || "",
      statutSuivi: data[i][ colIndex('statutsuivi', headerMap, 12) ] || "",
      etat: data[i][ colIndex('etat', headerMap, 13) ] || "",

      outils: outils
    });
  }

  return res;
}
