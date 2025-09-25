import Header from './Header'
import {Outlet} from 'react-router-dom'

function Layout() {
  return (
    <div>
        <Header/>
        <div className='m-4'>
           <Outlet/>
        </div>
    </div>
  )
}

export default Layout