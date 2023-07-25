import moduleCss from 'bootstrap/dist/css/bootstrap.min.css';
import Cookie from 'js-cookie';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffectOnce, useUpdate } from 'react-use';

import { verifyLogin, verifyPassword } from './init';

export const LoginCheck = (props) => {
  const forceUpdate = useUpdate();

  const [showModal, setShowModal] = useState(true);
  const [pwd, setPwd] = useState('');
  useEffectOnce(() => {
    const language = Cookie.get('language');
    verifyLogin(forceUpdate, language).then((res) => {
      setShowModal(res.showModal);
    });
  });

  const onHide = () => {
    setShowModal(false);
  };
  const onConfirm = async () => {
    setShowModal(false);
    const language = Cookie.get('language');
    await verifyPassword(pwd, forceUpdate, language);
  };
  return showModal ? (
    <LoginModal showModal={showModal} pwd={pwd} setPwd={setPwd} onHide={onHide} onConfirm={onConfirm} />
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
