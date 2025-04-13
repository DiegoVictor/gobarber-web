import React, { useCallback, ChangeEvent, FormEvent, useState } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { Container, Content, AvatarInput } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
  old_password: Yup.string(),
  password: Yup.string().when('old_password', {
    is: (val: string) => !!val.length,
    then: () => Yup.string().required('Campo obrigatório'),
  }),
  password_confirmation: Yup.string()
    .when('old_password', {
      is: (val: string) => !!val.length,
      then: () => Yup.string().required('Campo obrigatório'),
    })
    .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
});

const Profile: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, updateUser } = useAuth();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const { name, email, old_password, password, password_confirmation } =
        Object.fromEntries(formData.entries());

      await schema.validate(
        { name, email, old_password, password, password_confirmation },
        { abortEarly: false },
      );

      const data = {
        name,
        email,
        ...(old_password
          ? {
              old_password,
              password,
              password_confirmation,
            }
          : {}),
      };

      const response = await api.put('/profile', data);

      updateUser(response.data);
      addToast({
        type: 'success',
        title: 'Perfil atualizado!',
        description:
          'Suas informações do perfil foram atualizadas com sucesso!',
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description:
            'Ocorreu um erro ao atualizar o perfil, tente novamente.',
        });
      }
    }
  };

  const handleAvatarChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData();
        data.append('avatar', event.target.files[0]);

        const response = await api.patch('/users/avatar', data);
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <form onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                data-testid="avatar"
              />
              <FiCamera />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>
          <Input
            icon={FiUser}
            name="name"
            type="text"
            placeholder="Nome"
            error={errors.name}
            defaultValue={user.name}
          />
          <Input
            icon={FiMail}
            name="email"
            type="text"
            placeholder="Email"
            error={errors.email}
            defaultValue={user.email}
          />

          <Input
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha atual"
            error={errors.old_password}
          />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova senha"
            error={errors.password}
          />
          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            error={errors.password_confirmation}
          />

          <Button type="submit" data-testid="submit">
            Confirmar mudanças
          </Button>
        </form>
      </Content>
    </Container>
  );
};

export default Profile;
