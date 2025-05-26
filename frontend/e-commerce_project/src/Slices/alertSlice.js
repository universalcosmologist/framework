import { createSlice } from "@reduxjs/toolkit";

const initialState={
    message:"",
}

const alertSlice=createSlice({
    name:'alerts',
    initialState,
    reducers:{
        addMessage:(state,action)=>{
            state.message=action.payload;
        },
        hideMessage:(state)=>{
            state.message="";
        }
    }
});

export const{addMessage,hideMessage}=alertSlice.actions;
export default alertSlice.reducer;