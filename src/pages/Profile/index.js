import React from 'react';
import { Form, Input } from '@rocketseat/unform';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from './styles';
import { updateProfileRequest } from '~/store/actions/user';
import AvatarInput from './AvatarInput';
import { signOut } from '~/store/actions/auth';

export default function Profile() {
  const profile = useSelector(state => state.user.profile);
  const dispatch = useDispatch();

  return (
    <Container>
      <Form
        initialData={profile}
        onSubmit={data => {
          dispatch(updateProfileRequest(data));
        }}
      >
        <AvatarInput name="avatar_id" />
        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu endereço de email" />
        <hr />
        <Input
          name="old_password"
          type="password"
          placeholder="Sua senha autal"
        />
        <Input name="password" type="password" placeholder="Sua nova senha" />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirme sua nova senha"
        />

        <button type="submit">Atualizar</button>
      </Form>

      <button type="button" onClick={() => dispatch(signOut())}>
        Logout
      </button>
    </Container>
  );
}
