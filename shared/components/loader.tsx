import { cn } from '@/lib/utils'
import { LoaderIcon } from 'lucide-react'
import React from 'react'

function Loader() {
  return (
    <div className='w-screen h-screen bg-white/40 grid place-items-center  fixed z-50 top-0 left-0'>
         <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-8 animate-spin")}
    />
    </div>
  )
}

export default Loader