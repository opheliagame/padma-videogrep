/**
 * IndexedDB Storage Manager
 * Handles saving and restoring app state and data
 */

window.StorageManager = {
  DB_NAME: "PadmaVideogrepDB",
  DB_VERSION: 1,
  STORE_NAME: "appState",

  // Initialize the database
  init: function (callback) {
    var request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

    request.onerror = function () {
      console.error("Database failed to open");
      if (callback) callback(false);
    };

    request.onsuccess = function () {
      console.log("Database opened successfully");
      if (callback) callback(true);
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(StorageManager.STORE_NAME)) {
        db.createObjectStore(StorageManager.STORE_NAME, { keyPath: "id" });
        console.log("Object store created");
      }
    };
  },

  // Save app state and data to IndexedDB
  save: function (app) {
    var request = indexedDB.open(StorageManager.DB_NAME);

    request.onsuccess = function (event) {
      var db = event.target.result;
      var transaction = db.transaction([StorageManager.STORE_NAME], "readwrite");
      var store = transaction.objectStore(StorageManager.STORE_NAME);

      var dataToSave = {
        id: "appData",
        state: app.state,
        data: app.data,
        timestamp: new Date().getTime(),
      };

      var putRequest = store.put(dataToSave);

      putRequest.onsuccess = function () {
        console.log("Data saved to IndexedDB");
      };

      putRequest.onerror = function () {
        console.error("Error saving data to IndexedDB");
      };
    };

    request.onerror = function () {
      console.error("Failed to open database for saving");
    };
  },

  // Load app state and data from IndexedDB
  load: function (callback) {
    var request = indexedDB.open(StorageManager.DB_NAME);

    request.onsuccess = function (event) {
      var db = event.target.result;
      var transaction = db.transaction([StorageManager.STORE_NAME], "readonly");
      var store = transaction.objectStore(StorageManager.STORE_NAME);

      var getRequest = store.get("appData");

      getRequest.onsuccess = function () {
        var result = getRequest.result;
        if (result) {
          console.log("Data loaded from IndexedDB:", result);
          if (callback) callback(result);
        } else {
          console.log("No saved data found in IndexedDB");
          if (callback) callback(null);
        }
      };

      getRequest.onerror = function () {
        console.error("Error loading data from IndexedDB");
        if (callback) callback(null);
      };
    };

    request.onerror = function () {
      console.error("Failed to open database for loading");
      if (callback) callback(null);
    };
  },

  // Clear all data from IndexedDB
  clear: function (callback) {
    var request = indexedDB.open(StorageManager.DB_NAME);

    request.onsuccess = function (event) {
      var db = event.target.result;
      var transaction = db.transaction([StorageManager.STORE_NAME], "readwrite");
      var store = transaction.objectStore(StorageManager.STORE_NAME);

      var clearRequest = store.clear();

      clearRequest.onsuccess = function () {
        console.log("IndexedDB cleared");
        if (callback) callback(true);
      };

      clearRequest.onerror = function () {
        console.error("Error clearing IndexedDB");
        if (callback) callback(false);
      };
    };

    request.onerror = function () {
      console.error("Failed to open database for clearing");
      if (callback) callback(false);
    };
  },
};
