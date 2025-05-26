import {Routes,Route} from "react-router-dom"
import {Home,ProductCategory,Login,Layout,Search,Cart,Sign_Up,Product,ViewProduct,Profile} from './pages/index'  

export default function App() {
  return (
   <Routes>
     <Route element={<Layout/>}>
       <Route path="/" element={<Home/>}/>
       <Route path="/productcategory" element={<ProductCategory/>} />
       <Route path="/search_product" element={<Search/>}/>
       <Route path="/cart" element={<Cart/>}/>
     </Route>
     <Route path="/user" element={<Profile/>}/>
     <Route path="/viewproduct" element={<ViewProduct/>}/>
     <Route path="/login" element={<Login/>}/>
     <Route path="/signup" element={<Sign_Up/>}/>
     <Route path="/product" element={<Product/>}/>
   </Routes>
  )
}
