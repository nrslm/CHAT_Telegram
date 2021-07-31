import React, { useContext, useEffect, useState } from 'react'
import {
    Form,
    Button,
    Spinner,
    Card,
    Container,
} from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { UserContext, LanguageContext } from './../components/contexts';
import { useTranslation } from 'react-i18next';
import requester from '../components/utils/requester';

const Home = (v) => {
    const { t } = useTranslation();
    const [language, setLanguage] = useContext(LanguageContext);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [imgInput, setImgInput] = useState(false);
    const [nameInput, setNameInput] = useState(false);
    const [inpChatValue, setInpChatValue] = useState('');
    const [dataMessage, setDataMessage] = useState([]);


    const [user, setUser] = useContext(UserContext);
    const [inputChat, setInputChat] = useState();
    const [inputChat_text, setInputChat_text] = useState('');



    useEffect(() => {
        requester.get('/message')
            .then(({ data }) => {
                alert('data');
                // setDataMessage(data.payload);
                console.log(data.payload);  
            }).catch(e => {
                console.log(e);
                alert('err');
            }).finally(() => {
                alert('final');
            });
    }, []);

    const inputChatValue = (v) => {
        setInpChatValue(v);
    }

    const keyInp = (v) => {
        if (v.keyCode === 13) {
            // setInputChat_text(inpChatValue);

            requester.post('/message', {
                text: inpChatValue,
            }).then(({ data }) => {
                console.log(data);
            }).finally(() => {
            })
        }
    }
    const btn_chat_sand = () => {
        // setInputChat_text(inpChatValue);

        requester.post('/message', {
            text: inpChatValue,
        }).then(({ data }) => {
            console.log(data);
        }).finally(() => {
        })
    }

    // text post server:
    // modal1
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // modal2
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    // const btn = () => {
    //     setUser(null)
    // }

    const inputImg = (v) => {
        setImgInput(v);
        requester.post('/auth/me', {
            picture: v
        })
            .then(res => {
                if (res.data.status === 'success') {
                    setUser(res.data.payload);
                }
            });
        console.log(v);
    }

    // edit name:
    const inputName = (v) => {
        setNameInput(v);
    }
    const btn_name = () => {
        requester.post('/auth/me', {
            full_name: nameInput
        })
            .then(res => {
                if (res.data.status === 'success') {
                    setUser(res.data.payload);
                }
                console.log(res);
            });
        setShow(false);
    }

    const btnModalShow = () => {
        setShow(false);
    }

    return (
        <div className={'block_all_home'}>
            {/* modal1 */}
            <Modal show={show} >
                <div className={''}>
                    <Modal.Header className={'modalHead modalBlock'}>
                        <Button onClick={() => btnModalShow()} variant="danger">X</Button>
                    </Modal.Header>
                    <Modal.Body className={'text-center'}>

                        <label>
                            <div className={'profil_img '} style={{ backgroundImage: ('url(https://api.chat.besoft.kg/' + user.picture.path.original + ')') }}>
                            </div>
                            <input onChange={(e) => inputImg(e.target.files[0])} type="file" style={{ display: "none" }} />
                        </label>

                        <hr />
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <h3>{t('setFullName')}</h3>
                            <Form.Control onChange={(e) => inputName(e.target.value)} type="text" placeholder="Full Name" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className={'block_btn_chat'}>
                            <div className={'d-flex'}>
                                <h5>Язык</h5>
                                <Form.Group  >

                                    <Form.Control className={'drop_form'} onChange={(e) => setLanguage(e.target.value)} as='select' value={language}>
                                        <option value="en">English</option>
                                        <option value="ru">Руский</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <Button onClick={() => btn_name()} variant='success'>{t('btn_send')}</Button>
                        </div>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* modal2 */}

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose2}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {
                <div className={'block_left_home'}>
                    <label>
                        <div className={'profil_img'} style={{ backgroundImage: ('url(https://api.chat.besoft.kg/' + user.picture.path.original + ')') }}>

                        </div>

                        <input onChange={(e) => inputImg(e.target.files[0])} type="file" style={{ display: "none" }} />
                    </label>
                    <hr className={'hr'} />
                    <div>
                        <div style={{ width: '16rem' }}>

                            <Card.Title className={'card_user'}>{t('full_name_profil')} {v.value.full_name} </Card.Title>
                            <hr className={'hr'} />
                            <Card.Subtitle className="mb-2">{t('Phone_number_profil')}{v.value.phone_number}</Card.Subtitle>
                            <hr className={'hr'} />
                            <Card.Subtitle className="mb-2">{t('Last_activity')}{v.value.last_action}</Card.Subtitle>
                            <hr className={'hr'} />
                            <Button onClick={handleShow} className={'mt-4 btn_setting'} variant="outline-warning">{t('setting_profil')}</Button>
                        </div>
                    </div>
                </div>
            }
            <div className={'block_rigth_home  d-flex flex-column'}>
                <div className={'w-100 heder_home'}>
                    <h4 className={'title_chat'} onClick={handleShow2}>IT в картинках</h4>
                </div>
                <div className={'block_chat flex-grow-1'}>
                    <div className={'text_chat  d-flex flex-column '}>
                        {dataMessage.map((v, i) => {
                            return (
                                v.user_id === user.id ? (
                                    <div className={"d-block align-self-end m-2"}>
                                        <span className={'span_chat '}>
                                            {v.text}
                                        </span>
                                    </div>
                                ) :
                                    <div className={""}>
                                        <div className={'profil_enimi d-inline-block'} style={{ backgroundImage: `url(https://api.chat.besoft.kg/${v.user.picture.path.original})` }}>

                                        </div>
                                        <span className={'d-inline-block span_chat span_chat_enimi'}>
                                            {v.text}
                                        </span>
                                    </div>
                            )

                        })}
                        <div className={""}>
                            <div className={'profil_enimi d-inline-block'} style={{ backgroundImage: "url(https://unitedkingdom-grlk5lagedl.stackpathdns.com/production/uk/images/1611143385752165-Billie-Eilish-Book-New-Music-1.jpg?w=1920&h=800&fit=fill&crop=faces&auto=%5B%22format%22%2C%20%22compress%22%5D&cs=srgb)" }}>

                            </div>
                            <span className={'d-inline-block span_chat span_chat_enimi'}>
                                у меня тоже отлично!
                            </span>
                        </div>

                    </div>
                </div>
                <div className={'block_input_chat'}>
                    <input onKeyUp={(e) => keyInp(e)} onChange={(e) => inputChatValue(e.target.value)} className={'input_chat'} type="text" placeholder={t('input_value')} ></input>
                    <Button onClick={() => btn_chat_sand()} variant="outline-warning" className={'btn_send'}>{t('btn_chat_message')}</Button>
                </div>
            </div>
        </div>
    )
}
export default Home;