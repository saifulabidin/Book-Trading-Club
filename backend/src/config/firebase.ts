import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Check for required Firebase configuration
const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// Validate required configuration
if (!projectId) {
  throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
}
if (!privateKey) {
  throw new Error('Missing FIREBASE_PRIVATE_KEY environment variable');
}
if (!clientEmail) {
  throw new Error('Missing FIREBASE_CLIENT_EMAIL environment variable');
}

// Create a properly formatted service account object
const serviceAccount = {
  type: 'service_account',
  project_id: projectId,
  private_key: privateKey.replace(/\\n/g, '\n'),
  client_email: clientEmail,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

export const auth = admin.auth();