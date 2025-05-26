import React,{useEffect} from 'react'

function Profile() {
  const token=localStorage.getItem('token');
  const [item,setItem]=React.useState(null);
  if(!token){
    return (
        <div>
            Login to view your profile
        </div>
    )
  }

  const fetch_user=async()=>{
    try {
    console.log("performing fetch now");
    const res=await fetch('http://localhost:8000/users/profile',{
        method:"GET",
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    });
    console.log("fetch done");
    const ans=await res.json();
    console.log(ans);
    setItem(ans);
    } catch (error) {
        console.log("fetch error occured in fetch_user function",error);
    }
  }
  
  useEffect(()=>{
   if(token){
     fetch_user();
   }
  },[]);

  if(item){
    return (
      <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg max-w-md mx-auto my-6">
  <h2 className="text-xl font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
    User Profile
  </h2>
  <div className="mb-2">
    <span className="font-medium text-gray-400">Name:</span> {item.user?.name}
  </div>
  <div className="mb-2">
    <span className="font-medium text-gray-400">Email:</span> {item.user?.email}
  </div>
  <div className="mb-2">
    <span className="font-medium text-gray-400">Role:</span> {item.user?.role}
  </div>
  <div>
    <span className="font-medium text-gray-400">Phone:</span> {item.user?.phone}
  </div>
</div>
    )
  }
  return (
    <div>No User Data Available</div>
  )
}

export default Profile