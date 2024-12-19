import React from 'react'
import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Navbar() {
    return (
      <nav className='fixed w-full z-50 bg-black/30 backdrop-blur-md border-b-2 border-blue-500/50'>
        <div className='flex flex-row mx-auto px-[40px] py-[25px] justify-between items-center'>
          <div className='font-semibold text-xl text-white'>
            <Link to='/'>MedVault</Link>
          </div>
          <div className='flex justify-center flex-1 space-x-8 text-center'>
            <h1 className='font-medium text-sm text-white'>
              <Link to='/trade-data'>Add Trade</Link>
            </h1>
            <h1 className='font-medium text-sm text-white ml-[40px]'>
              <Link to='/trade'>Share</Link>
            </h1>
          </div>
          <div className='text-white'>
           <ConnectButton/>
          </div>
        </div>
      </nav>
    );
  }

export default Navbar