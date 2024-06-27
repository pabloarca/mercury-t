import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const sanitizedEmail = email.replace('.', ',');
      const snapshot = await get(ref(database, `municipios`));
      let municipio = null;
      snapshot.forEach(childSnapshot => {
        const childData = childSnapshot.val();
        if (childData.usuario === sanitizedEmail) {
          municipio = childSnapshot.key;
        }
      });

      if (municipio) {
        navigate(`/user/${municipio}`);
      } else {
        console.error("Municipio not found for this user");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Por favor, ingresa tu email para restablecer la contraseña.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Se ha enviado un enlace para restablecer tu contraseña a tu email.");
    } catch (error) {
      console.error("Error al enviar email para restablecer contraseña: ", error);
      alert("Error al enviar email para restablecer contraseña, verifica que el email sea correcto.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/monochrome.jpg)' }}>
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold mb-2 text-blue-900">Bienvenido al portal de mapas de AST-Amianto</h1>
        <h2 className="text-2xl mb-4">Accede al censo de amianto web privado de tu localidad</h2>
      </div>
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h3 className="text-base font-bold mb-4">Introduce tus credenciales</h3>
        <input
          type="email"
          className="mb-2 p-2 w-full border"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="mb-2 p-2 w-full border"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 w-full mb-2"
          onClick={handleLogin}
        >
          Acceder
        </button>
        <button
          className="bg-transparent text-blue-500 hover:text-blue-800 p-2 w-full"
          onClick={handleResetPassword}
        >
          Restablecer contraseña
        </button>
      </div>
      <div className="mt-8 text-center">
        <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-6" />
        <div className="flex justify-around w-full ">
          <a href="https://ast-amianto.es/" className="text-blue-900 pr-20 hover:underline">Página principal</a>
          <a href="https://ast-amianto.es/servicios" className="text-blue-900 pr-20 hover:underline">Servicios</a>
          <a href="https://ast-amianto.es/contacto" className="text-blue-900 pr-20 hover:underline">Contacto</a>
          <a href="https://ast-amianto.es/sobre-nosotros" className="text-blue-900 hover:underline">Sobre Nosotros</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
