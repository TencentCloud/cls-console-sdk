import moduleCss from 'bootstrap/dist/css/bootstrap.min.css';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffectOnce, useUpdate } from 'react-use';

import { verifyLogin, verifyPassword } from './init';
import { getForwardData } from './utils/capi';

export const LoginCheck = (props) => {
  const forceUpdate = useUpdate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pwd, setPwd] = useState('');
  useEffectOnce(() => {
    const language = Cookie.get('language');
    verifyLogin(forceUpdate, language).then((res) => {
      setIsLoggedIn(res.isLoggedIn);
    });
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    //  执行登录后的初始化
    getEnvAndSetWindow();
  }, [isLoggedIn]);

  const onHide = () => {
    setIsLoggedIn(false);
  };
  const onConfirm = async () => {
    const language = Cookie.get('language');
    try {
      await verifyPassword(pwd, forceUpdate, language);
      setIsLoggedIn(true);
    } catch (error) { }
  };
  return !isLoggedIn ? (
    <LoginModal showModal={!isLoggedIn} pwd={pwd} setPwd={setPwd} onHide={onHide} onConfirm={onConfirm} />
  ) : (
    props.children()
  );
};

const LoginModal = (props: {
  showModal: boolean;
  pwd: string;
  setPwd: (pwd: string) => void;
  onHide: () => void;
  onConfirm: () => any;
}) => {
  const { showModal, pwd, setPwd, onHide, onConfirm } = props;

  return (
    <Modal onHide={onHide} show={showModal} className={moduleCss}>
      <Modal.Header closeButton>
        <Modal.Title>请输入密码</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>取消</Button>
        <Button onClick={onConfirm}>确认</Button>
      </Modal.Footer>
    </Modal>
  );
};

const getEnvAndSetWindow = async () => {
  const response = await getForwardData('/config/env');
  if (response.code) {
    console.warn('getEnvAndSetWindow failed');
    return;
  }
  Object.keys(response.data).forEach((envKey) => {
    window[envKey] = response.data[envKey];
  });
};
