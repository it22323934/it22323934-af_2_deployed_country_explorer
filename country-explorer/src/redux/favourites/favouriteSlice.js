import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      // Avoid duplicates
      if (!state.favorites.some(fav => fav.alpha3Code === action.payload.alpha3Code)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        country => country.alpha3Code !== action.payload
      );
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    }
  }
});

export const { 
  addFavorite, 
  removeFavorite, 
  clearFavorites,
  setFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer;