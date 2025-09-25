import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import {Provider} from 'react-redux'
import store from './Store/Store.js';
import AlertComponent from './Components/AlertComponent.jsx';
import { ProductProvider } from '../contexts/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
    <Provider store={store}>
    <BrowserRouter>
    <AlertComponent/>
    <App />
    </BrowserRouter>
    </Provider>
  </ProductProvider>
  </StrictMode>
)
