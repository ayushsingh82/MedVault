import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Navbar() {
    return (
      <nav className=''>
        <div className='flex flex-row mx-auto px-[40px] py-[25px] justify-between items-center mt-[0px] bg-black'>
          <div className='font-semibold text-xl text-white'>
            <a href='/'>Oasis</a>
          </div>
          <div className='flex justify-center flex-1 space-x-8 text-center'>
            <h1 className='font-medium text-lg text-white'>
              <a href='/'>Dashboard</a>
            </h1>
          </div>
          <div className='text-white'>
           <ConnectButton/>
          </div>
        </div>
        <hr className='border-t border-blue-600' />
      </nav>
    );
  }
  

export default Navbar