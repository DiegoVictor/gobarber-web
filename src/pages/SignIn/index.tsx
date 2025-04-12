import React, { FormEvent, useState } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import { Container, Content, AnimationContainer, Background } from './styles';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
  password: Yup.string().required('Senha obrigatória'),
});

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.currentTarget);
      const { email, password } = Object.fromEntries(formData.entries());

      await schema.validate({ email, password }, { abortEarly: false });

      await signIn({
        email: email.toString(),
        password: password.toString(),
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
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
            <h1>Faça seu login</h1>

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

            <Button type="submit">Entrar</Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
