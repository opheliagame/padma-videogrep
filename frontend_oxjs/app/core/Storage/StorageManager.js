export class StorageManager {
  DB_NAME = "PadmaVideogrepDB";
  DB_VERSION = 1;
  STORE_NAME = "appState";

  constructor({ indexedDB = () => globalThis.indexedDB } = {}) {
    this.getIndexedDB =
      typeof indexedDB === "function" ? indexedDB : () => indexedDB;
  }

  init(callback) {
    const request = this.getIndexedDB().open(this.DB_NAME, this.DB_VERSION);

    request.onerror = function () {
      console.error("Database failed to open");
      callback?.(false);
    };

    request.onsuccess = function () {
      callback?.(true);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.STORE_NAME)) {
        db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
      }
    };
  }

  save(app) {
    const request = this.getIndexedDB().open(this.DB_NAME);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);
      store.put({
        id: "appData",
        state: app.state,
        data: app.data,
        timestamp: Date.now(),
      });
    };

    request.onerror = function () {
      console.error("Failed to open database for saving");
    };
  }

  load(callback) {
    const request = this.getIndexedDB().open(this.DB_NAME);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([this.STORE_NAME], "readonly");
      const store = transaction.objectStore(this.STORE_NAME);
      const getRequest = store.get("appData");

      getRequest.onsuccess = function () {
        callback?.(getRequest.result || null);
      };

      getRequest.onerror = function () {
        console.error("Error loading data from IndexedDB");
        callback?.(null);
      };
    };

    request.onerror = function () {
      console.error("Failed to open database for loading");
      callback?.(null);
    };
  }

  clear(callback) {
    const request = this.getIndexedDB().open(this.DB_NAME);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([this.STORE_NAME], "readwrite");
      const clearRequest = transaction.objectStore(this.STORE_NAME).clear();

      clearRequest.onsuccess = function () {
        callback?.(true);
      };

      clearRequest.onerror = function () {
        console.error("Error clearing IndexedDB");
        callback?.(false);
      };
    };

    request.onerror = function () {
      console.error("Failed to open database for clearing");
      callback?.(false);
    };
  }
}

export const storageManager = new StorageManager();
