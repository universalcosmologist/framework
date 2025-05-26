import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    products:null,
    fresh:false,
};


const productSlice=createSlice({
    name:'products',
    initialState,
    reducers:{
        setProducts:(state,action)=>{
            state.products=action.payload;
           
        },
        clearProducts:(state)=>{
            state.products=null;
        },
    }
})

export const{setProducts} = productSlice.actions;
export default productSlice.reducer;