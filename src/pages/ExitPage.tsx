import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings,  MapPin } from 'lucide-react'; 

const ExitPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Recuperamos prizeName y storeId del state
    const { prizeName, storeId, storeName } = location.state || {}; 

    const BRAND_COLOR_BLACK = "#000000ff"; 
    const BRAND_COLOR_TEAL = "#5bc4bf";

    const handlePlayAgain = () => {
        if (storeId) {
            navigate(`/${storeId}`); 
        } else {
            navigate('/');
        }
    };

    const goToStores = () => {
        if (storeId) {
            navigate(`/tiendas?store=${storeId}`);
        } else {
            navigate('/tiendas');
        }
    };

    return (
        <div 
            style={{ backgroundColor: BRAND_COLOR_BLACK }} 
            className="min-h-screen flex flex-col items-center justify-center p-4 overscroll-y-none relative font-sans text-center"
        >
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 pointer-events-none"></div>

            {/* Ajuste de ancho máximo para que no se sienta tan "gordo" en pantallas grandes */}
            <div className="z-10 w-[95%] max-w-xs sm:max-w-sm flex flex-col items-center">
                
                <img
                    src="/inkachipslogo.png"
                    alt="Inka Chips Logo"
                    className="w-32 sm:w-40 h-auto mb-6 drop-shadow-md" 
                />
                
                {/* Contenedor de Felicidades con padding responsive */}
                <div 
                    style={{ backgroundColor: BRAND_COLOR_TEAL }}  
                    className="rounded-3xl p-5 sm:p-8 w-full border-4 border-white shadow-2xl mb-8"
                >
                    <h1 className="text-3xl sm:text-5xl text-white font-creativeLand tracking-tight mb-4 drop-shadow-sm">
                        FELICIDADES
                    </h1>

                    <div className="bg-transparent font-creativeLand rounded-xl p-4 sm:p-6 mb-4 border-4 border-white">
                        {prizeName ? (
                            <h2 className="text-5xl sm:text-4xl text-white uppercase break-words leading-tight">
                                Ganaste <br />
                                {prizeName}
                            </h2>
                        ) : (
                            <h2 className="text-lg text-white/70 font-bold">
                                PREMIO NO DETECTADO
                            </h2>
                        )}
                    </div>

                    <div className="space-y-2 text-white font-medium text-xs sm:text-sm">
                        <p className="drop-shadow-sm leading-tight">
                            Acércate al módulo de atención para reclamar tu premio.
                        </p>
                        <p className="text-white/80 text-[10px] sm:text-xs italic">
                            *Recuerda mostrar tu DNI y el comprobante de compra.
                        </p>
                    </div>
                </div>

                {/* === NAVBAR INFERIOR RESPONSIVE === */}
                <div className="flex flex-col items-center gap-3 ">
                    <div className="flex items-center justify-center gap-3 ">
                        {/* BOTÓN VOLVER A JUGAR */}
                        <button 
                            onClick={handlePlayAgain} 
                            style={{ backgroundColor: '#5dc4c0' }}
                            className="flex items-center justify-center flex-1 py-3 px-4 rounded-full text-white font-black shadow-lg transform transition-all border-2 border-transparent hover:brightness-110 active:scale-95"
                        >
                            
                            <span className="text-2xl sm:text-3xl tracking-tight px-4 font-creativeLand  whitespace-nowrap">Juega Aqui</span>
                        </button>

                        {/* BOTÓN SETTINGS */}
                        <button 
                            onClick={goToStores}
                            style={{ backgroundColor: '#5dc4c0' }}
                            className="flex items-center justify-center w-12 h-12 rounded-full text-white border-2 border-white/20 shadow-lg transform transition-transform active:scale-95 hover:brightness-110 flex-shrink-0"
                        >
                            <Settings size={24} />
                        </button>
                    </div>

                    {/* Nombre de la tienda también en el ExitPage para consistencia */}
                    {storeId && (
                        <div className="flex items-center gap-1 text-white/60 mt-2">
                            <MapPin size={12} className="text-[#5dc4c0]" />
                            <span className="text-[10px] sm:text-xs font-medium tracking-wide uppercase">
                                {storeName || `Tienda: ${storeId.substring(0, 8)}...`}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExitPage;