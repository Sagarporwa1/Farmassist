import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('KisanApp.db');

export const initDatabase = () => {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS local_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUri TEXT NOT NULL,
      cropType TEXT NOT NULL,
      landArea TEXT NOT NULL,
      soilType TEXT NOT NULL,
      seedVariety TEXT NOT NULL,
      irrigationType TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      diseaseName TEXT,
      confidence REAL
    );
  `);
};

export const addCase = (caseData) => {
    const result = db.runSync(
        `INSERT INTO local_cases (imageUri, cropType, landArea, soilType, seedVariety, irrigationType, timestamp, diseaseName, confidence) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            caseData.imageUri,
            caseData.cropType,
            caseData.landArea,
            caseData.soilType,
            caseData.seedVariety,
            caseData.irrigationType,
            caseData.timestamp,
            caseData.diseaseName || null,
            caseData.confidence || null,
        ]
    );
    return result.lastInsertRowId;
};

export const getCases = () => {
    const allRows = db.getAllSync('SELECT * FROM local_cases ORDER BY id DESC');
    return allRows;
};

export const deleteCase = (id) => {
    db.runSync('DELETE FROM local_cases WHERE id = ?', [id]);
};
