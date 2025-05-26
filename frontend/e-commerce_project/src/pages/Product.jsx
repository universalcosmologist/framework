import React,{useState} from "react"
import { addMessage,hideMessage } from "../Slices/alertSlice";
import {useDispatch} from 'react-redux';

export default function Product(){
    const[formData,setFormData]=useState({
        title:"",
        description:"",
        category:"",
        price:"",
        image_file:null,
    });
    const dispatch=useDispatch();
    const show_notification=(message)=>{
        dispatch(addMessage(message));
        setTimeout(()=>{
            dispatch(hideMessage());
        },2000);
    }
    const handlePriceChange =(str)=>{
        let value = str.trim();

        if (!/^\d*\.?\d{0,2}$/.test(value)){
            console.log("invalid price");
            setFormData({ ...formData, price: "0" });
            show_notification("enter valid price format");
            return false;
        }
    
        let number = parseFloat(value);
    
        if (number > 0) {
            setFormData({ ...formData, price: String(number)});

        } else {
            setFormData({ ...formData, price: "0" });
        }
        return true;
    }
    const handleAnyFormElementChange=(event)=>{
        const {value,name,type,files}=event.target;
        if(type=='file'){
           const file=files[0];
           if(!file || !file.type.startsWith("image/")){
            console.log('select a valid file type');
            setFormData({...formData,image_file:null});
           }
           else setFormData({...formData,image_file:file});
        }else{
           setFormData({...formData,[name]:value});
        }
    }
    const handleSubmit=async(e)=>{
       e.preventDefault();
       if(!formData.image_file){
        console.log('no file is available,product image cannot be empty');
        return;
       }
       if(!formData.title || !formData.category || !formData.description || !handlePriceChange(formData.price)){
        console.log('correct all fields before submitting');
        return;
       }
       console.log(formData);
       const token = localStorage.getItem('token'); 
       try {
        const file=formData.image_file;
        const response=await fetch(`http://localhost:8000/image/generate_url?fileName=${file.name}&fileType=${file.type}`,{
            method:"GET",
            headers:{
                'Authorization':`Bearer ${token}`,
            }
        });
        const {fileUrl,uploadUrl}=await response.json();
       const putResponse = await fetch(uploadUrl, {
           method: "PUT",
           body: file,
            headers: {
             "Content-Type": file.type,
           },
         });
          
        console.log(putResponse); // This will show the whole response object
        if (putResponse.ok) {
           console.log("Image uploaded successfully!");
         } else {
           console.error("Image upload failed!", putResponse.status, await putResponse.text());
       }

        //token ko leke to aao
          
        const product_creation_response=await fetch('http://localhost:8000/products',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({
                title:formData.title,
                description:formData.description,
                category:formData.category,
                price:formData.price,
                image_url:fileUrl,
            })
        });
        const res=await product_creation_response.json();
        console.log(res);
        if(res.login_required_message!=undefined || res.invalid_token_message!=undefined){
            show_notification("login needed");
        }
       } catch (error) {
        console.log('upload failed error occured',error);
       }
    }
    return(
        <>
            <h2 className="ml-8 p-5 text-white text-2xl">Enter Product Details :</h2>
            <form className="bg-red-200 ml-10 mr-10 mt-2 p-5">
            <div className="m-2 p-2">
                <div>
                <label htmlFor="title">Title :</label>
                </div>
                <input 
                type="text" 
                id="title" 
                placeholder="enter product title" 
                name="title"
                className="rounded-md w-96 h-8"
                value={formData.title}
                onChange={handleAnyFormElementChange}
                />
            </div>
            <div className="m-2 p-2">
            <div>
            <label htmlFor="category">Category :</label>
            </div>
            <select
                   id="category"
                   name="category"
                   value={formData.category}
                   onChange={handleAnyFormElementChange}
                  className="rounded-md w-96 h-8"
            >
             <option value="">Select a category</option> {/* Default empty option */}
             <option value="electronics">Electronics</option>
             <option value="men's clothing">Men's Clothing</option>
             <option value="women's clothing">Women's Clothing</option>
             <option value="jewellery">Jewellery</option>
             </select>
            </div>
            <div className="m-2 p-2">
                <div>
                <label htmlFor="description">Description :</label>
                </div>
                <input 
                type="text" 
                id="description" 
                placeholder="enter product description" 
                className="rounded-md w-96 h-8"
                name="description"
                value={formData.description}
                onChange={handleAnyFormElementChange}
                />
            </div>
            <div className="m-2 p-2">
                <div>
                    <div>
                    <label htmlFor="price">Enter Price:</label>
                    </div>
                    <input 
                    type="text" 
                    id="price" 
                    name="price"
                    value={formData.price}
                    onChange={handleAnyFormElementChange}
                    onBlur={(e)=>handlePriceChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="m-2 p-2">
            <div>
            <label htmlFor="image">Choose Product Image:</label>
            </div>
            <input 
            type="file" 
            id="image" 
            className="mt-2"
            accept="image/*"
            onChange={handleAnyFormElementChange}
            />
            </div>
            <div className="m-2 p-2">
                <button className="bg-blue-500 rounded-lg p-2 text-white"
                onClick={handleSubmit}>
                Submit
                </button>
            </div>
        </form>
        </> 
    )
}