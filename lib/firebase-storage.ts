import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config
const configPath = path.join(__dirname, '..', 'firebase-applet-config.json');
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error('Could not read firebase-applet-config.json', e);
}

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

let isInitialized = false;

export const initFirebaseStorage = async () => {
  if (isInitialized) return;
  try {
    await signInWithEmailAndPassword(auth, 'server@eminbilgiislem.com', 'SuperSecretPassword123!');
    isInitialized = true;
    console.log('Firebase Storage initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase Storage:', error);
  }
};

export const loadDataFromFirebase = async () => {
  if (!isInitialized) await initFirebaseStorage();
  try {
    const collections = [
      'users', 'employees', 'quotes', 'purchasableServices',
      'purchasedServices', 'refundRequests', 'supportTickets', 'supportMessages',
      'customerServices', 'customerPayments', 'customerTransactions', 'customerDocuments'
    ];
    const data: any = {};
    for (const key of collections) {
      const docRef = doc(db, 'appData', key);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        data[key] = snap.data().items;
      }
    }
    // Special case for settings which is an object, not an array
    const settingsRef = doc(db, 'appData', 'settings');
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      data.settings = settingsSnap.data();
    }
    return data;
  } catch (error) {
    console.error('Error loading data from Firebase:', error);
  }
  return null;
};

export const saveDataToFirebase = async (data: any) => {
  if (!isInitialized) await initFirebaseStorage();
  try {
    for (const [key, value] of Object.entries(data)) {
      const docRef = doc(db, 'appData', key);
      if (key === 'settings') {
        await setDoc(docRef, value as any, { merge: true });
      } else {
        await setDoc(docRef, { items: value }, { merge: true });
      }
    }
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
};

export const migrateDataIfNeeded = async () => {
  const dataFile = path.join(__dirname, '..', 'data.json');
  if (fs.existsSync(dataFile)) {
    try {
      const content = fs.readFileSync(dataFile, 'utf8');
      const data = JSON.parse(content);
      console.log('Migrating data.json to Firebase...');
      await saveDataToFirebase(data);
      fs.renameSync(dataFile, `${dataFile}.migrated`);
      console.log('Migration complete.');
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }
};
