import {ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const RootLayout =async({children}:{children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  //non-logged in users won't be able to see the homepage
  if(!isUserAuthenticated) redirect('/sign-in');
  return (
    <div className="root-layout">
      <nav>
          <Link href="/" className="flex items-center gap-2">
            <Image src ="/logo.png" alt = "Logo" width = {38} height = {32} />
                <h2 className = "text-primary-100">Intervia</h2>
          </Link>
      </nav>
        {children}
    </div>
  )
}

export default RootLayout