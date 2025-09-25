import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const url=import.meta.env.VITE_API_URL;
    const [data, setData] = useState(null);
    const [fresh, setFresh] = useState(false);
    const token=localStorage.getItem('token');
  
    useEffect(() => {
      if (!fresh && token) {
        console.log("hello refetching");
        const fetchData = async () => {
          const res=await fetch(`${url}/products`,{
            method:"GET",
            headers:{
                'Authorization':`Bearer ${token}`,
            }
          });
          const json = await res.json();
          setData(json.products);
          setFresh(true);
        };
        fetchData();
      }else if(!token){
        console.log("hello no token");
        setData(null);
        setFresh(true);
      }
    }, [fresh]);
  
    return (
      <ProductContext.Provider value={{ data, setFresh, fresh }}>
        {children}
      </ProductContext.Provider>
    );
};

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useProductContext = () => useContext(ProductContext);
