const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const startMemoryDB = async () => {
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use the default MongoDB port
        dbName: 'secondarypro'
      }
    });
    
    const uri = mongod.getUri();
    console.log('🚀 MongoDB Memory Server started at:', uri);
    return uri;
  } catch (error) {
    console.error('❌ Failed to start MongoDB Memory Server:', error);
    throw error;
  }
};

const stopMemoryDB = async () => {
  if (mongod) {
    await mongod.stop();
    console.log('🛑 MongoDB Memory Server stopped');
  }
};

module.exports = { startMemoryDB, stopMemoryDB };
