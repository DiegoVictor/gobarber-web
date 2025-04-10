import React, { FormEvent, useState } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { Container, Content, AnimationContainer, Background } from './styles';

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
  password: Yup.string().min(6, 'No minimo 6 digitos'),
});

const SignUp: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const { name, email, password } = Object.fromEntries(formData.entries());

      await schema.validate({ name, email, password }, { abortEarly: false });

      await api.post('users', { name, email, password });
      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer seu logon no GoBarber!',
      });

      navigate('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.',
        });
      }
    }
  };

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="GoBarber" />

          <form onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input
              icon={FiUser}
              name="name"
              type="text"
              placeholder="Nome"
              error={errors.name}
            />
            <Input
              icon={FiMail}
              name="email"
              type="text"
              placeholder="Email"
              error={errors.email}
            />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
              error={errors.password}
            />

            <Button type="submit">Cadastrar</Button>
          </form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
