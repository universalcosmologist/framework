import React from 'react'
//until overridden className is none
function Button({children,onClick,className=""}) {
  return (
      <button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-800 px-5 py-2 rounded-md font-semibold transition duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  )
}

export default Button