import React from 'react';

const BackgroundCC: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ 
        backgroundImage: 'url("/bgmonster15.png")',
        // Cambiamos a repeat-y para que solo se repita verticalmente si sobra espacio
        backgroundRepeat: 'repeat',
        // '100% auto' hace que la imagen ocupe todo el ancho disponible 
        // y el alto se ajuste proporcionalmente para no deformarse
        backgroundSize: '90% auto', 
        backgroundPosition: 'top center',
        backgroundColor: '#000000' 
      }}
    />
  );
}

export default BackgroundCC;