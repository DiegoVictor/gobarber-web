import React, { FormEvent, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { Container, Content, AnimationContainer, Background } from './styles';

const schema = Yup.object().shape({
  password: Yup.string().required('Senha obrigatória'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirmação incorreta')
    .required(),
});

const ResetPassword: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const { password, password_confirmation } = Object.fromEntries(
        formData.entries(),
      );

      await schema.validate(
        { password, password_confirmation },
        { abortEarly: false },
      );

      const token = location.search.replace('?token=', '');
      if (!token) {
        throw new Error();
      }

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      });

      navigate('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    }
  };

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="GoBarber" />

          <form onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

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
              placeholder="Confirmação da senha"
              error={errors.password_confirmation}
            />

            <Button type="submit">Alterar senha</Button>
          </form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
