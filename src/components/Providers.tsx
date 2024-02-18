import { SessionProvider } from 'next-auth/react'
import React from 'react'

type Props = {
    children:React.ReactNode
}

function Providers({children}: Props) {
  return (
    <div>
        <SessionProvider>
            {children}
        </SessionProvider>
    </div>
  )
}

export default Providers