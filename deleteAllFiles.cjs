// deleteAllFiles.js
const { Client, Storage, Query } = require('appwrite');

const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('683a16f50031cb546db1');

// If you are using an API key, set it as an environment variable or use a header override if needed by your SDK version.
// For most server-side operations, the API key should be set in the headers automatically if you run this in a trusted environment.
// If you need to set the API key manually, check the SDK docs for the correct method for your version. 

const storage = new Storage(client);
const BUCKET_ID = '683a18bc0017007f6313';

async function deleteAllFiles(bucketId) {
  let hasMore = true;
  let lastFileId = null;

  try {
    while (hasMore) {
      const queries = [Query.limit(100)];
      if (lastFileId) queries.push(Query.cursorAfter(lastFileId));

      const response = await storage.listFiles(bucketId, queries);
      const files = response.files;

      if (!files.length) {
        hasMore = false;
        break;
      }

      for (const file of files) {
        await storage.deleteFile(bucketId, file.$id);
        console.log(`✅ Deleted: ${file.name} (ID: ${file.$id})`);
      }

      lastFileId = files[files.length - 1].$id;
    }

    console.log('🎉 All files deleted successfully from the bucket.');
  } catch (error) {
    console.error('❌ Error deleting files:', error.message);
  }
}

deleteAllFiles(BUCKET_ID);
