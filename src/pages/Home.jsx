import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/monochrome.jpg)' }}>
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl mb-4">Accede al mapa</h1>
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
    </div>
  );
};

export default Home;
