import { createSeedData } from "./seed";

const STORAGE_PREFIX = "crm";

function safeReadCollection(value, fallback = []) {
  try {
    const parsed = value === null || value === undefined ? fallback : JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `crm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUserKey(userEmail) {
  return `${STORAGE_PREFIX}:${String(userEmail || "").trim().toLowerCase()}`;
}

export function getCollectionKey(userEmail, collectionName) {
  return `${getUserKey(userEmail)}:${collectionName}`;
}

export function getAll(userEmail, collectionName, fallback = []) {
  if (!userEmail) return fallback;

  const rawValue = localStorage.getItem(getCollectionKey(userEmail, collectionName));
  return safeReadCollection(rawValue, fallback);
}

export function setAll(userEmail, collectionName, records) {
  if (!userEmail) return;

  localStorage.setItem(getCollectionKey(userEmail, collectionName), JSON.stringify(records));
}

export function createRecord(userEmail, collectionName, newRecord) {
  const records = getAll(userEmail, collectionName, []);
  const createdRecord = {
    ...newRecord,
    id: newRecord.id || createId(),
    createdAt: newRecord.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  records.push(createdRecord);
  setAll(userEmail, collectionName, records);
  return createdRecord;
}

export function updateRecord(userEmail, collectionName, recordId, updates) {
  const records = getAll(userEmail, collectionName, []);
  const index = records.findIndex((record) => record.id === recordId);

  if (index === -1) {
    return null;
  }

  const updatedRecord = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  records[index] = updatedRecord;
  setAll(userEmail, collectionName, records);
  return updatedRecord;
}

export function removeRecord(userEmail, collectionName, recordId) {
  const records = getAll(userEmail, collectionName, []);
  const nextRecords = records.filter((record) => record.id !== recordId);
  setAll(userEmail, collectionName, nextRecords);
  return nextRecords;
}

export function addActivity(userEmail, type, message) {
  const activity = {
    id: createId(),
    type,
    message,
    createdAt: new Date().toISOString(),
  };

  const activities = getAll(userEmail, "activities", []);
  activities.unshift(activity);
  setAll(userEmail, "activities", activities.slice(0, 30));
  return activity;
}

export function ensureUserSeedData(userEmail) {
  if (!userEmail) return;

  const seedKey = getCollectionKey(userEmail, "leads");
  if (localStorage.getItem(seedKey)) {
    return;
  }

  const baseData = createSeedData();

  ["leads", "contacts", "tasks", "activities"].forEach((collectionName) => {
    localStorage.setItem(
      getCollectionKey(userEmail, collectionName),
      JSON.stringify(baseData[collectionName] || [])
    );
  });
}

export function readUserData(userEmail) {
  return {
    leads: getAll(userEmail, "leads", []),
    contacts: getAll(userEmail, "contacts", []),
    tasks: getAll(userEmail, "tasks", []),
    activities: getAll(userEmail, "activities", []),
  };
}
