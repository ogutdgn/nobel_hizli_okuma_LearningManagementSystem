import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

    const navigate = useNavigate();

  return (
    <div>
        <button onClick={() => navigate("ogrenciler")}>Öğrencilere bak</button>
        <button onClick={() => navigate("odevler")}>Ödev yükle</button>
        <button onClick={() => navigate("egzersizler")}>Egzersizler</button>
        <button onClick={() => navigate("kurslar")}>Kurslar</button>
        <button onClick={() => navigate("profil")}>Kurslar</button>
    </div>
  )
}

export default HomePage