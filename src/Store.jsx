import {configureStore} from '@reduxjs/toolkit';
import toastReducer from './ToastSlice';
import dataSlice from "./DataSlice.jsx";

export const Store = configureStore({
    reducer: {
        toast: toastReducer,
        data: dataSlice
    },
});