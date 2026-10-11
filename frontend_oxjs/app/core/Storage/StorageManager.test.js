import { describe, expect, it, vi } from "vitest";
import { StorageManager } from "./StorageManager.js";

function createDatabaseHarness() {
  const openRequest = {};
  const getRequest = {};
  const putRequest = {};
  const clearRequest = {};
  const store = {
    clear: vi.fn(() => clearRequest),
    get: vi.fn(() => getRequest),
    put: vi.fn(() => putRequest),
  };
  const transaction = { objectStore: vi.fn(() => store) };
  const database = {
    objectStoreNames: { contains: vi.fn(() => true) },
    createObjectStore: vi.fn(),
    transaction: vi.fn(() => transaction),
  };
  const indexedDB = { open: vi.fn(() => openRequest) };

  return {
    storage: new StorageManager({ indexedDB }),
    indexedDB,
    openRequest,
    getRequest,
    store,
    database,
  };
}

describe("StorageManager", () => {
  it("initializes IndexedDB and creates the object store on upgrade", () => {
    const { storage, openRequest, indexedDB, database } = createDatabaseHarness();
    const callback = vi.fn();
    database.objectStoreNames.contains.mockReturnValue(false);

    storage.init(callback);
    openRequest.onupgradeneeded({ target: { result: database } });
    openRequest.onsuccess();

    expect(indexedDB.open).toHaveBeenCalledWith("PadmaVideogrepDB", 1);
    expect(database.createObjectStore).toHaveBeenCalledWith("appState", {
      keyPath: "id",
    });
    expect(callback).toHaveBeenCalledWith(true);
  });

  it("saves and loads app state through the injected database", () => {
    const { storage, openRequest, getRequest, store, database } =
      createDatabaseHarness();
    const app = { state: { mode: "write" }, data: { scenes: [] } };
    const callback = vi.fn();

    storage.save(app);
    openRequest.onsuccess({ target: { result: database } });
    expect(store.put).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "appData",
        state: app.state,
        data: app.data,
        timestamp: expect.any(Number),
      }),
    );

    storage.load(callback);
    openRequest.onsuccess({ target: { result: database } });
    getRequest.result = { id: "appData", state: app.state, data: app.data };
    getRequest.onsuccess();

    expect(callback).toHaveBeenCalledWith(getRequest.result);
  });

  it("reports failed opens through the operation callback", () => {
    const { storage, openRequest } = createDatabaseHarness();
    const callback = vi.fn();

    storage.init(callback);
    openRequest.onerror();

    expect(callback).toHaveBeenCalledWith(false);
  });
});