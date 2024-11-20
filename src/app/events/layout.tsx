import Footer from '@/components/shared-components/Footer'
import Header from '@/components/shared-components/Header'
import React from 'react'


const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="overflow-x-hidden overflow-y-hidden bg-gradient-to-tr from-[#595858] to-[#000107] relative min-h-screen w-full">
      <img
        src="/left-glow.png"
        alt="Background Image 2"
        className="absolute hidden md:flex -top-20 left-0"
      />
      <img
        src="/right-glow.png"
        alt="Background Image 3"
        className="absolute -top-12 right-0 hidden md:flex"
      />
      <img
        src="/line-pattern.png"
        alt="Background Image 4"
        className="absolute top-1/4 left-0 w-full"
      />
      <div className='max-w-[1280px] mx-auto my-3 relative z-20'>
  
      <Header />

      {children}
      <Footer />
      </div>
      </div>
    </>
  )
}

export default layout