// folioxe/src/appwriteClient.js
import { Client, Storage, ID } from 'appwrite'; // Import ID for unique file IDs

const client = new Client();

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1'; // e.g., 'https://cloud.appwrite.io/v1' or 'http://localhost/v1'
const APPWRITE_PROJECT_ID = '683a16f50031cb546db1';

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || APPWRITE_ENDPOINT === 'YOUR_APPWRITE_API_ENDPOINT') {
  console.error(
    "Appwrite endpoint or project ID is missing. " +
    "Please create an appwriteClient.js file in your src/ folder " +
    "and add your Appwrite endpoint and project ID."
  );
} else {
    client
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);
}

const storage = new Storage(client);

export { client, storage, ID }; // Export ID as well