import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  users: '++id, name, email , isSync', // Primary key and indexed props
  requests: '++id, method, payload, userId'
});