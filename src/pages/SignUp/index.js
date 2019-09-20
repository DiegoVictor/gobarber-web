import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import logo from '~/assets/logo.svg';
import { signUpRequest } from '~/store/actions/auth';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um email válido')
    .required('O email é obrigatório'),
  password: Yup.string()
    .required('A senha é obrigatória')
    .min(6, 'Mínimo de de 6 carateres'),
  name: Yup.string().required('O nome é obrigatório'),
});

export default function SignUp() {
  const dispatch = useDispatch();

  return (
    <>
      <img src={logo} alt="GoBarber" />

      <Form
        schema={schema}
        onSubmit={({ name, email, password }) => {
          dispatch(signUpRequest(name, email, password));
        }}
      >
        <Input name="name" type="text" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu email" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  );
}
