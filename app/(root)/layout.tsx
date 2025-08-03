import {ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";


import AuthButton from '@/components/AuthButton';

const RootLayout =async({children}:{children: ReactNode}) => {

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">Intervia</h2>
        </Link>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default RootLayout