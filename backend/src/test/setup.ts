import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, afterEach, beforeAll } from 'vitest';

const testDatabaseName = 'schedulefinder_test';
let mongoServer: MongoMemoryServer | undefined;

process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-only-access-token-secret';
process.env.PASSWORD_RESET_SECRET = 'test-only-password-reset-secret-at-least-32-bytes';
process.env.SENDGRID_API_KEY = 'SG.test-only.test-only';
process.env.CLOUDINARY_CLOUD_NAME = 'test-only';
process.env.CLOUDINARY_API_KEY = 'test-only';
process.env.CLOUDINARY_API_SECRET = 'test-only';
mongoose.set('strictQuery', true);

beforeAll(async () => {
  if (!testDatabaseName.endsWith('_test')) {
    throw new Error(`Refusing to use unsafe test database name: ${testDatabaseName}`);
  }

  if (mongoose.connection.readyState !== 0) {
    throw new Error('Refusing to start tests with an existing Mongoose connection');
  }

  mongoServer = await MongoMemoryServer.create({
    binary: { version: '6.0.14' },
    instance: { dbName: testDatabaseName },
  });

  await mongoose.connect(mongoServer.getUri(testDatabaseName));

  if (mongoose.connection.name !== testDatabaseName) {
    throw new Error(`Connected to unexpected test database: ${mongoose.connection.name}`);
  }
});

afterEach(async () => {
  const collections = Object.values(mongoose.connection.collections);

  await Promise.all(collections.map((collection) => collection.deleteMany({})));

  const remainingDocuments = await Promise.all(
    collections.map((collection) => collection.countDocuments({}))
  );

  if (remainingDocuments.some((count) => count !== 0)) {
    throw new Error('Test database cleanup left documents behind');
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } finally {
    await mongoServer?.stop();
  }
});
