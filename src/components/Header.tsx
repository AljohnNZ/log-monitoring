import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-[#004936] text-white text-center w-full">
      <div className="container mx-auto flex items-center justify-center flex-col">
        <img src="/aljohn-logo-black.svg" alt="Company Logo" className="h-12 mb-2" />
        <h1 className="text-xl font-bold">Aljohn Log Monitor</h1>
      </div>
    </header>
  );
};

export default Header;