import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root", // The key to use for storing data in local storage
  storage, // Use local storage as the storage engine
  whitelist: ["collapsible"], // List of reducers to persist
};

export default persistConfig;
