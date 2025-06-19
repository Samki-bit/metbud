import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function navBar() {
  return (
    <div className='flex justify-center'>
      <div className='h-10 w-xl relative bg-[#393E46] backdrop-opacity-40 m-10 flex rounded-sm text-lg font-semibold justify-center gap-20 items-center '>
        <div className=" text-white  transition-all cursor-pointer" ><NavLink to={'/tuner'} className={({ isActive }) => {
          return isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-all'
        }}>Tuner</NavLink></div>
        <div className=" text-white  transition-all cursor-pointer" ><NavLink to={'/'} className={({ isActive }) => {
          return isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-all'
        }}>Metronome</NavLink></div>
      </div>
    </div>
  )
}

export default navBar
