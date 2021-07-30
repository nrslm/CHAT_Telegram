import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import AuthContainer from './components/AuthContainer/AuthContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/utils/i18n';
import { LanguageContext, UserContext } from './components/contexts';
import i18n from './components/utils/i18n';
import requester from './components/utils/requester';
import Home from './MainContainer/Home';


export default function App() {
  const language = useState(localStorage.getItem('language') || 'en');
  // const user = useState(null);
  const [user1, setUser1] = useState(JSON.parse(localStorage.getItem('user')) || null);


  useEffect(() => {
    localStorage.setItem('language', language[0]);
    i18n.changeLanguage(language[0]);
  }, [language[0]]);
  useEffect(() => {
    if (user1)localStorage.setItem('user', JSON.stringify(user1));
    else localStorage.removeItem('user');
  }, [user1]);

  useEffect(() => {
    requester.get('/auth/me').then(res => {
      if (res.data.status === 'success') setUser1(res.data.payload);
    });
  }, []);
  console.log(user1);
  return (
    <>
      <LanguageContext.Provider value={language}>
        <div className='body'>
          <UserContext.Provider value={[user1, setUser1]}>
            {!user1 ? <AuthContainer /> : <Home value= {user1} />}
          </UserContext.Provider>
        </div>
      </LanguageContext.Provider>
    </>
  );
}