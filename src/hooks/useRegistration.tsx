import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL, CAMPAIGN_ID } from "../constants/RegistrationConstants";
import type { RouteParams } from "../constants/RegistrationConstants";

export interface SpinResult {
    success: boolean;
    prizeName?: string;
    registerId?: string;
}

// 1. Interfaz actualizada: phoneNumber -> email
interface RouletteHook {
    loading: boolean;
    message: string;
    storeId: string | undefined;
    storeName: string;
    // Campos del formulario
    name: string;
    dni: string;
    email: string; // <--- CAMBIADO
    setName: (val: string) => void;
    setDni: (val: string) => void;
    setEmail: (val: string) => void; // <--- CAMBIADO
    // Acción
    handleSpin: () => Promise<SpinResult>; 
}

export const useRegistration = (): RouletteHook => {
    // === ESTADOS ===
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [storeName, setStoreName] = useState("");
    
    // === ESTADOS DEL FORMULARIO ACTUALIZADOS ===
    const [name, setName] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState(""); // <--- CAMBIADO

    // === HOOKS DE ROUTER ===
    const { storeId } = useParams<RouteParams>();

    // === OBTENER INFO DE LA TIENDA ===
    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (!storeId) return;

            try {
                const res = await fetch(`${API_URL}/api/v1/admin/stores/${storeId}`);
                
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        setStoreName(json.data.name);
                    }
                } else {
                    console.error("Error en respuesta del servidor:", res.status);
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            }
        };

        fetchStoreInfo();
    }, [storeId]);

    // === ACCIÓN DE REGISTRAR Y GIRAR ===
    const handleSpin = async (): Promise<SpinResult> => {
        setMessage("");
        
        // 1. Validación local (email incluido)
        if (!storeId) {
            setMessage("Error: No se identificó la tienda.");
            return { success: false };
        }
        if (!name.trim() || !dni.trim() || !email.trim()) {
            setMessage("⚠️ Por favor completa todos los datos para jugar.");
            return { success: false };
        }

        setLoading(true);

        try {
            // 2. Llamada al endpoint enviando 'email'
            const res = await fetch(`${API_URL}/api/v1/register-spin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    storeId, 
                    campaign: CAMPAIGN_ID,
                    name, 
                    dni, 
                    email // <--- CAMBIADO
                }),
            });
            
            const resJson = await res.json();

            if (res.ok) {
                return { 
                    success: true, 
                    prizeName: resJson.prize, 
                    registerId: resJson.registerId 
                };
            } else {
                setMessage(`⚠️ ${resJson.message || "Error al procesar el giro."}`);
                return { success: false };
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Error de conexión con el servidor.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        message,
        storeId,
        storeName,
        name, setName,
        dni, setDni,
        email, setEmail, // <--- CAMBIADO
        handleSpin,
    };
};