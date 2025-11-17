// Smartcargo-Advisory/src/pages/AdminLogin.jsx

// ... (Importaciones necesarias)

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // Llamada al Endpoint Fijo de autenticación
            const response = await apiClient.post('/admin/login', { username, password });
            
            // Si el login es exitoso, guardar el token para acceder a /admin/audits
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin/dashboard'); 

        } catch (error) {
            alert("Acceso denegado. Credenciales incorrectas.");
            console.error("Fallo de autenticación admin:", error);
        }
    };

    return (
        <div className="admin-login-container">
            <h2>🔒 Acceso de Auditoría y Mantenimiento</h2>
            <p>Solo para personal autorizado que requiera revisar registros legales.</p>
            <input 
                type="text" 
                placeholder="Usuario (ADMIN_USERNAME)" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Contraseña (ADMIN_PASSWORD)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Acceder</button>
        </div>
    );
};
