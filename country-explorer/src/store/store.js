import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../redux/user/userSlice";
import themeReducer from "../redux/themeSlice";
import favoritesReducer from "../redux/favourites/favouriteSlice";
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  favorites: favoritesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
