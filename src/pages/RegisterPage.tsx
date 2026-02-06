import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { useRegistration } from "../hooks/useRegistration";
import { Settings, MapPin, Check, X } from 'lucide-react';
// IMPORTANTE: Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import BackgroundCC from "../components/BackgroundCC";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { storeId: paramStoreId } = useParams<{ storeId: string }>(); 
    const [searchParams] = useSearchParams();
    
    // Estados de UI
    const [showRegisterModal, setShowRegisterModal] = useState(true);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showGif, setShowGif] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    
    // Estados del formulario (Solo conservamos el checkbox local porque no va al backend)
    const [termsAccepted, setTermsAccepted] = useState(false);

    // ELIMINADOS LOS ESTADOS LOCALES DE PHONE Y VOUCHER PARA USAR LOS DEL HOOK
    // const [phone, setPhone] = useState(''); 
    // const [voucher, setVoucher] = useState<File | null>(null);

    const activeStoreId = paramStoreId || searchParams.get("store");

    const { 
        loading, 
        message, 
        handleSpin, 
        storeName,
        name, setName,
        phone, setPhone,      // <--- AÑADIDO: Traemos el estado del hook
        voucher, setVoucher   // <--- AÑADIDO: Traemos el estado del hook
    } = useRegistration();

    const goToStores = () => {
        if (activeStoreId) {
            navigate(`/tiendas?store=${activeStoreId}`);
        } else {
            navigate('/tiendas');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validaciones básicas
        if (!name || !phone || !voucher || !termsAccepted) {
            alert("Por favor completa todos los campos y acepta los términos.");
            return;
        }

        // 2. Validar longitud de Teléfono
        if (phone.length < 9) {
            alert("El teléfono debe tener al menos 9 dígitos");
            return;
        }

        //console.log("Datos de registro:", { name, phone, voucher });

        setShowRegisterModal(false);
        setIsRegistered(true);
    };

    const onSpinClick = async () => {
        if (showGif || loading || !activeStoreId || !isRegistered) {
            if (!isRegistered && !loading && !showGif) setShowRegisterModal(true);
            return;
        }

        const result = await handleSpin();

        if (result.success && result.prizeName) {
            setShowGif(true);
            setTimeout(() => {
                navigate('/exit', {
                    state: { 
                        prizeName: result.prizeName, 
                        registerId: result.registerId,
                        isAnonymous: false,
                        storeId: activeStoreId 
                    },
                });
            }, 4000); 
        } 
    };

   
    
    return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans">
        
        {/* 1. FONDO PRINCIPAL (RULETA) */}
        <div className="absolute inset-0 z-0">
            <BackgroundCC />
        </div>

        <img src="/tottusmonster.png" alt="logo" className="w-45 h-auto mb-9 z-10 drop-shadow-md relative" />

        {/* === CONTENEDOR DE LA RULETA === */}
        <div className={`relative z-10 w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center transition-opacity duration-500 ${!isRegistered ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
            
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                <img src="/downarrow.png" alt="Flecha Ganadora" className="w-16 h-16 object-contain drop-shadow-2xl"/>
            </div>

            <img 
                src={showGif ? "/ruletamonster.gif" : "/ruletamonster.png"} 
                alt="Ruleta" 
                className="w-full h-full object-contain drop-shadow-2xl"
            />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <style>{`
                    @keyframes heartbeat {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    .animate-heartbeat { animation: heartbeat 1.5s infinite ease-in-out; }
                `}</style>

                <button
                    onClick={onSpinClick}
                    disabled={showGif || loading || !activeStoreId || !isRegistered}
                    className={`
                        w-22 h-22 rounded-full bg-black border-2 border-white shadow-lg
                        flex items-center justify-center transition-transform hover:scale-110 active:scale-95
                        ${(showGif || !isRegistered) ? 'cursor-default' : 'cursor-pointer animate-heartbeat'}
                    `}
                >
                    {loading ? (
                        <span className="text-xs text-white font-bold">...</span>
                    ) : (
                        <img src="/monster.png" alt="GO" className="w-16 h-16 object-contain" />
                    )}
                </button>
            </div>
        </div>
        
        {/* === NAVBAR INFERIOR === */}
        <div className="z-20 mt-8 flex flex-col items-center gap-3 relative">
            <div className="flex items-center gap-1">
                <button 
                    onClick={onSpinClick} 
                    disabled={showGif || loading || !activeStoreId || !isRegistered}
                    
                    className={`
                        flex items-center px-8 py-2 rounded-full text-white font-black shadow-lg transform transition-all border-2 border-transparent
                        ${showGif || loading || !activeStoreId || !isRegistered
                            ? 'grayscale opacity-70 cursor-not-allowed' 
                            : 'hover:brightness-110 active:scale-95' 
                        }
                    `}
                >
                    <span className="text-xl tracking-tight font-markpro uppercase border-2 border-[#a2e71a] px-5 rounded-full py-1">
                        {isRegistered ? "Juega Aquí" : "Regístrate"}
                    </span>
                </button>

                <button 
                    onClick={goToStores}
                    disabled={showGif} 
                    
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-full text-white border-2 border-[#a2e71a] shadow-lg transform transition-transform 
                        ${showGif ? 'grayscale opacity-50 cursor-not-allowed' : 'active:scale-95 hover:brightness-110'}
                    `}
                >
                    <Settings size={24} />
                </button>
            </div>

            {activeStoreId && (
                <div className="flex items-center gap-1 text-white/80 mt-1 animate-fade-in">
                    <MapPin size={12} className="text-[#5dc4c0]" />
                    <span className="text-xs font-medium tracking-wide uppercase">
                        {storeName || `Tienda: ${activeStoreId}`}
                    </span>
                </div>
            )}
        </div>

        {message && (
            <div className="mt-4 z-20 bg-white/90 text-red-600 px-4 py-2 rounded-lg font-bold shadow-lg text-center mx-4 max-w-xs text-sm relative">
                {message}
            </div>
        )}
        
        {/* ======================================= */}
        {/* 2. MODAL DE REGISTRO (FORMULARIO)       */}
        {/* ======================================= */}
        {showRegisterModal && (
            <div className="fixed inset-0 z-50 p-4 animate-fade-in overflow-y-auto flex items-center justify-center">
                
                {/* 2. FONDO DEL MODAL REGISTRO */}
                <div className="absolute inset-0 z-0">
                    <BackgroundCC />
                </div>
                
                {/* Contenedor Flex para alinear caja y botón fuera */}
                <div className="flex flex-col items-center justify-center w-full mt-20 mb-10 relative z-10">
                    
                   <div 
    className="bg-transparent border-2 border-white font-mont-bold rounded-3xl p-4 w-auto shadow-2xl relative"
    style={{
        borderColor: '#a2e71a',
        boxShadow: '0 0 15px #a2e71a, inset 0 0 5px #a2e71a' // Glow externo e interno sutil
    }}
>
                        
                        {/* --- LOGO --- */}
                        <div className="absolute -top-42 left-1/2 transform -translate-x-1/2 z-20 w-full flex justify-center">
                            <img 
                                src="/tottusmonster.png" 
                                alt="Logo Tottus Monster" 
                                className="w-60 md:w-48 h-auto drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" 
                            />
                        </div>

                        {/* Cabecera */}
                        <div className="text-left mb-2 mt-0">
                            <h2 className="text-[23px] font-teko text-white mb-0 tracking-normal">1 . REGÍSTRATE PARA PARTICIPAR</h2>
                            <p className="text-white text-[15px] text-left opacity-90 mb-4 leading-4">Llena tus datos y participa por<br/> fabulosos premios</p>
                        </div>

                        {/* FORMULARIO CON ID */}
                        <form id="register-form" onSubmit={handleRegisterSubmit} className="space-y-2 text-start">
                            
                            {/* Input Nombre */}
                            <div>
                                <label className="block text-white text-[13px] font-bold mb-0 ml-1">Nombres y apellidos</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej. Juan Pérez"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-76 px-5 py-1 bg-transparent border border-2 border-[#a2e71a] rounded-full text-white text-sm placeholder-gray-500 transition-all"
                                />
                            </div>

                            {/* Input Teléfono */}
                            <div>
                                <label className="block text-white text-[13px] font-bold mb-0 ml-1">Teléfono</label>
                                <input 
                                    type="tel" 
                                    placeholder="987654321"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={9}
                                    required
                                    className="w-76 px-5 py-1 bg-transparent border border-2 border-[#a2e71a] rounded-full text-white text-sm placeholder-gray-500 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Input Foto Voucher */}
                            <div>
                                <label className="block text-white text-[13px] font-bold mb-0 ml-1 tracking-wider">Foto de Voucher</label>
                                <label className="cursor-pointer flex items-center justify-left gap-2 w-76 px-6 py-1 border-2 border-[#a2e71a] rounded-full text-white text-xs font-black hover:bg-[#a2e71a] hover:text-black transition-all shadow-[0_0_10px_rgba(162,231,26,0.3)] active:scale-95">
                                    
                                    {voucher ? "ARCHIVO SELECCIONADO" : "SELECCIONAR ARCHIVO"}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setVoucher(e.target.files[0]);
                                            }
                                        }}
                                        required
                                    />
                                </label>
                            </div>

                            {/* CHECKBOX TÉRMINOS */}
                            <div className="flex items-start gap-2 mt-4 px-2 max-w-[288px]">
                                <div className="relative flex items-center pt-1">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white bg-transparent transition-all checked:bg-[#a2e71a] checked:border-[#a2e71a]"
                                    />
                                    <div className="pointer-events-none absolute top-1 left-0 text-white opacity-0 peer-checked:opacity-100 flex items-center justify-center w-4 h-4">
                                        <Check size={12}  />
                                    </div>
                                </div>
                                <label htmlFor="terms" className="text-[10px] text-gray-300 cursor-pointer select-none leading-tight">
                                    Acepto los <span 
                                        onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                                        className="text-[#a2e71a] underline font-bold cursor-pointer"
                                    >términos y condiciones</span> de uso de imagen para fines publicitarios.
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* BOTÓN FUERA DE LA CAJA (Vinculado al form por ID) */}
                    <button
                        type="submit"
                        form="register-form"
                        disabled={!termsAccepted}
                        className={`w-48 mt-10 py-1 rounded-full text-white bg-transparent font-black text-2xl shadow-lg border border-[#a2e71a] font-teko transition-all active:scale-95 
                            ${termsAccepted 
                                ? 'hover:brightness-110 shadow-[0_0_20px_rgba(101,199,195,0.4)]' 
                                : 'opacity-40 cursor-not-allowed grayscale'
                            }
                        `}
                        
                    >
                        ENVIAR
                    </button>

                </div>
            </div>
        )}

        {/* --- MODAL DE TÉRMINOS CON BORDE NEÓN --- */}
        {showTermsModal && (
            <div className="fixed inset-0 z-[60] p-6 animate-fade-in flex items-center justify-center">
                
                {/* 3. FONDO DEL MODAL TÉRMINOS */}
                <div className="absolute inset-0 z-0">
                    <BackgroundCC />
                </div>

                <div className="bg-black border-2 border-[#a2e71a] rounded-3xl p-8 max-w-md w-full relative shadow-[0_0_30px_rgba(162,231,26,0.2)] z-10">
                    <button 
                        onClick={() => setShowTermsModal(false)}
                        className="absolute top-4 right-4 text-[#a2e71a] hover:scale-110 transition-transform"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                    
                    <h3 className="text-[#a2e71a] font-black text-xl mb-4 tracking-tighter">TÉRMINOS Y CONDICIONES</h3>
                    
                    <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-white text-xs leading-relaxed text-justify font-light">
                            Promoción válida del 30 de enero del 2026 al 28 de febrero del 2026. Mecánica: Participan personas naturales mayores de 18 años, con residencia legal y domicilio en el territorio nacional del Perú, que realice la compra de Monster, en las tiendas Tottus ; para participar de la promoción RULETA VIRTUAL CAMPAÑA TOTTUS, deberás comprar 2 latas de monster (aplican todos los sabores) y podrás escanear el código QR ubicado en las tiendas autorizadas, llenar los datos de tu boucher de compra y subir su foto para entrar al sorteo por diferentes premios. El horario para ingresar a la landing page será en los horarios de atención de las tiendas TOTTUS .
                            <br /><br />
                            <strong>Los premios son:</strong> Alfombra de yoga (20), Ultra Paraguas (20), Ultra lentes de sol (20), Ultra Bocina (20), Ultra Cargador (20), Ultra Tomatodo Yeti (20).
                            <br /><br />
                            <strong>Modalidad de entrega de premios:</strong> Se hará entrega a los activadores en tienda de la pestaña de premio ganado; el cual validará la participación y el boucher de compra para otorgar el premio ganado. Entrega de premios sujetos a stock de tienda.
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default RegisterPage;