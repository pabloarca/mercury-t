// src/pages/Home.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/monochrome.jpg)' }}>  
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl mb-4">Login</h1>
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
          className="bg-blue-500 text-white p-2 w-full"
          onClick={handleLogin}
        >
          Acceder
        </button>
      </div>
    </div>
  );
};

export default Home;
