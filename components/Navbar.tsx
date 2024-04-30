import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex-between fixed z-50 w-full bg-dark-1 px-6 py-4  lg:px-10'> 
    
      <Link
      href={`/`}
      className='flex items-center gap-1' >
        <Image 
        src={'/icons/logo.svg'}
        alt='Yoom logo'
        width={32}
        height={32}
        className='max-sm:size-10'/>
        <p className='text-[26px] font-extrabold text-white max-sm:hidden'>Yoom</p>
      </Link>

      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
    </nav>
  )
}

export default Navbar