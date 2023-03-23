import {Link,Outlet} from 'react-router-dom';
import Navbar from './Navbar'
type Props = {}

function PageLayout({}: Props) {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default PageLayout