import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../Slices/ProductSlice'
import alertReducer from '../Slices/alertSlice';

export const store=configureStore({
    reducer:{
      products:productReducer,
      alerts:alertReducer,
    },
});
  
export default store;