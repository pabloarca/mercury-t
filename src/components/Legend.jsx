
import React from 'react';

const Legend = () => {
  return (
    <div className="absolute bottom-6 right-2.5 bg-white p-4 rounded-lg shadow-lg z-10">
      <h3 className="font-bold mb-2">Leyenda</h3>
      <div className="flex items-center mb-2">
        <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: 'red' }}></span>
        <span>Edificios públicos con amianto</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#9400D3' }}></span>
        <span>Edificios privados con amianto</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#00FF00' }}></span>
        <span>Edificios públicos a menos de 50m de amianto</span>
      </div>
      <div className="flex items-center">
        <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#00BFFF' }}></span>
        <span>Edificios públicos sin amianto</span>
      </div>
    </div>
  );
};


const Logo = () => {
  return (
    <div className="logo-container">
      <a href="https://ast-amianto.es/">
        <img src="/logo.png" alt="Logo" className="logo" />
      </a>
    </div>
  );
};

export { Legend, Logo };
