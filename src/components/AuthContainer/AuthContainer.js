import React, { useState, useContext } from 'react';
import {Form,Button,Spinner,Card,Container} from 'react-bootstrap';
import requester from '../utils/requester';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../contexts';
import { UserContext } from '../contexts';
import axios from 'axios';
import css from './main.module.css';

export default function AuthContainer() {
  const [fullName, setFullName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalPhone, setOriginalPhone] = useState('');
  const [language, setLanguage] = useContext(LanguageContext);
  const { t } = useTranslation();
  const [user, setUser] = useState(UserContext);


  const setPhone = (text) => {
    const phone = parsePhoneNumberFromString(text, 'KG');
    if (phone && phone.isValid() && phone.isPossible()) {
      setOriginalPhone(phone.format('E.164'));
    } else {
      setOriginalPhone('');
    }
    setPhoneNumber(text);
  }

  const send = () => {
    setLoading(true)
    requester.post('/auth', {
      phone_number: originalPhone.slice(1),
    }).then(({ data }) => {
      if (data.status.startsWith('exist')) {
        setStatus('login');
      } else {
        setStatus('register');
      }
    }).finally(() => {
      setLoading(false);
      console.log(originalPhone);
    })
  }

  const signIn = () => {
    setLoading(true)
    requester.post('/auth/login', {
      phone_number: originalPhone.slice(1),
      platform: 'web',
      version_code: 1,
      verification_code: verificationCode
    }).then(({ data }) => {
      if (data.status === 'success') {
        alert(`welcome ${data.payload.user.full_name}`);
        setUser(data.payload.user);
        localStorage.setItem('token', data.payload.token);
      } else if (data.status === 'code_is_invalid') {
        alert('code is invalid!!!');
      } else if (data.status === 'code_is_incorrect') {
        alert(`code is incorrect!!! You have ${data.payload.attempts} attempts left!`)
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  const signUp = () => {
    setLoading(true);
    requester.post('/auth/register', {
      phone_number: originalPhone.slice(1),
      platform: 'web',
      version_code: 1,
      verification_code: verificationCode,
      full_name: fullName
    }).then(({ data }) => {
      if (data.status === 'success') {
        alert(`welcome ${data.payload.user.full_name}`);
        setUser(data.payload.user);
        localStorage.setItem('token', data.payload.token)
      } else if (data.status === 'code_is_invalid') {
        alert('code is invalid!!!')
        console.log(data.status)
      } else if (data.status === 'code_is_incorrect') {
        alert(`code is incorrect!!! You have ${data.payload.message.attempts} attempts left!`)
      }
      console.log(data)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className={'block_all_form'}>
      <div className={'block_language'}>
        <Form.Group  >
          <Form.Control className={'drop_form'} onChange={(e) => setLanguage(e.target.value)} as='select' value={t('language')}>
            <option value="en">English</option>
            <option value="ru">Руский</option>
          </Form.Control>
        </Form.Group>
      </div>
      <div className={`d-flex justify-content-center align-items-center ${css.parent}  `}>
        <div className = {'block_form_inputs'}>
          <h1 className={'text-center'}>{t('form_window')}</h1>
          <div className={css.absolute}>

          </div>
          <Form.Group className='mb-3 text-center'>
            <h5>{t('phone_number')}</h5>
            <Form.Control className={'input_form'} disabled={status !== '' || loading} value={phoneNumber} onChange={({ target }) => setPhone(target.value)} type='tel' placeholder='996 500 008 003' />
          </Form.Group>
          {['register', 'login'].includes(status) && <Form.Group className='mb-3'>
            <Form.Label>{t('verification_code')}</Form.Label>
            <Form.Control disabled={loading} value={verificationCode} onChange={({ target }) => target.value.length < 5 && setVerificationCode(target.value)} type='number' placeholder='1234' />
          </Form.Group>}
          {status === 'register' && <Form.Group className='mb-3'>
            <Form.Label>{t('full_name')}</Form.Label>
            <Form.Control disabled={loading} value={fullName} onChange={({ target }) => setFullName(target.value)} type='text' placeholder='Ivan Ivanov' />
          </Form.Group>}
          {status === '' && <Button className={'btn_form'} onClick={() => send()} disabled={loading || originalPhone === ''} > {loading ? <Spinner size={'sm'} animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner> : t('send_sms')}</Button>}
          {status === 'login' && <Button className={'btn_form'} onClick={() => signIn()} disabled={loading || verificationCode.length !== 4} > {loading ? <Spinner size={'sm'} animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner> : t('sign_in')}</Button>}
          {status === 'register' && <Button className={'btn_form'} onClick={() => signUp()} disabled={loading || verificationCode.length !== 4 || fullName.length < 3}> {loading ? <Spinner size={'sm'} animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner> : t('sign_up')}</Button>}
        </div>
      </div>
    </div>
  )
}
// import React, { useState, useContext } from 'react'
// import {
//   Form,
//   Button,
//   Spinner,
//   Card,
// } from 'react-bootstrap'
// import requester from '../utils/requester'
// import { parsePhoneNumberFromString } from 'libphonenumber-js'
// import { useTranslation } from 'react-i18next';
// import { LanguageContext, UserContext } from '../contexts';
// import axios from 'axios';
// import css from './main.module.css';

// export default function AuthContainer() {
//   const [fullName, setFullName] = useState('')
//   const [verificationCode, setVerificationCode] = useState('')
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const [status, setStatus] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [originalPhone, setOriginalPhone] = useState('')
//   const [language, setLanguage] = useContext(LanguageContext);
//   const [user, setUser] = useContext(UserContext);
//   const { t } = useTranslation();

//   const setPhone = (text) => {
//     const phone = parsePhoneNumberFromString(text, 'KG')
//     if (phone && phone.isValid() && phone.isPossible()) {
//       setOriginalPhone(phone.format('E.164'))
//     } else {
//       setOriginalPhone('')
//     }
//     setPhoneNumber(text)
//   }

//   const send = () => {
//     setLoading(true)
//     requester.post('/auth', {
//       phone_number: originalPhone.slice(1),
//     }).then(({ data }) => {
//       if (data.status.startsWith('exist')) {
//         setStatus('login')
//       } else {
//         setStatus('register')
//       }
//     }).finally(() => {
//       setLoading(false)
//       console.log(originalPhone)
//     })
//   }

//   const signIn = () => {
//     setLoading(true)
//     requester.post('/auth/login', {
//       phone_number: originalPhone.slice(1),
//       platform: 'web',
//       version_code: 1,
//       verification_code: verificationCode
//     }).then(({ data }) => {
//       if (data.status === 'success') {
//         alert(`welcome ${ data.payload.user.full_name }`)
//         localStorage.setItem('token', data.payload.token);
//         setUser(data.payload.user)
//       } else if (data.status === 'code_is_invalid') {
//         alert('code is invalid!!!')
//       } else if (data.status === 'code_is_incorrect') {
//         alert(`code is incorrect!!! You have ${ data.payload.attempts } attempts left!`)
//       }
//     }).finally(() => {
//       setLoading(false)
//     })
//   }

//   const signUp = () => {
//     setLoading(true)
//     requester.post('/auth/register', {
//       phone_number: originalPhone.slice(1),
//       platform: 'web',
//       version_code: 1,
//       verification_code: verificationCode,
//       full_name: fullName
//     }).then(({ data }) => {
//       if (data.status === 'success') {
//         alert(`welcome ${data.payload.user.full_name }`)
//         localStorage.setItem('token', data.payload.token)
//         setUser(data.payload.user)
//       } else if (data.status === 'code_is_invalid') {
//         alert('code is invalid!!!')
//         console.log(data.status)
//       } else if (data.status === 'code_is_incorrect') {
//         alert(`code is incorrect!!! You have ${ data.payload.message.attempts } attempts left!`)
//       }
//       console.log(data)
//     }).finally(() => {
//       setLoading(false)
//     })
//   }

//   return (
//     <>
//       <div className={`d - flex justify-content-center align-items-center ${css.parent}`}>
//       <Card className={`w-50 ${css.card}`}>
//       <Card.Body>
//         <h1 className={'text-center'}>{t('form_window')}</h1>
//         <div className={css.absolute}>
//           <Form.Group>
//             <Form.Label>{t('language')}</Form.Label>
//             <Form.Control onChange={(e) => setLanguage(e.target.value)} as='select' value={language}>
//               <option value="en">English</option>
//               <option value="ru">Руский</option>
//             </Form.Control>
//           </Form.Group>

//         </div>
//         <Form.Group className='mb-3'>
//           <Form.Label>{t('phone_number')}</Form.Label>
//           <Form.Control disabled={status !== '' || loading} value={phoneNumber} onChange={({ target }) => setPhone(target.value)} type='tel' placeholder='996 500 008 003' />
//         </Form.Group>
//         {['register', 'login'].includes(status) && <Form.Group className='mb-3'>
//           <Form.Label>{t('verification_code')}</Form.Label>
//           <Form.Control disabled={loading} value={verificationCode} onChange={({ target }) => target.value.length < 5 && setVerificationCode(target.value)} type='number' placeholder='1234' />
//         </Form.Group>}
//         {status === 'register' && <Form.Group className='mb-3'>
//           <Form.Label>{t('full_name')}</Form.Label>
//           <Form.Control disabled={loading} value={fullName} onChange={({ target }) => setFullName(target.value)} type='text' placeholder='Ivan Ivanov' />
//         </Form.Group>}
//         {status === '' && <Button onClick={() => send()} disabled={loading || originalPhone === ''} > {loading ? <Spinner size={'sm'} animation="border" role="status">
//           <span className="visually-hidden"></span>
//         </Spinner> : t('send_sms')}</Button>}
//         {status === 'login' && <Button onClick={() => signIn()} disabled={loading || verificationCode.length !== 4} > {loading ? <Spinner size={'sm'} animation="border" role="status">
//           <span className="visually-hidden"></span>
//         </Spinner> : t('sign_in')}</Button>}
//         {status === 'register' && <Button onClick={() => signUp()} disabled={loading || verificationCode.length !== 4 || fullName.length < 3}> {loading ? <Spinner size={'sm'} animation="border" role="status">
//           <span className="visually-hidden"></span>
//         </Spinner> : t('sign_up')}</Button>}
//       </Card.Body>
//     </Card>
//     </div >
//     </>
//   )
// }