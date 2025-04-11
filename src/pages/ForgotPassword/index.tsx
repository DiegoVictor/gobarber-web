import React, { useState, FormEvent } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { Container, Content, AnimationContainer, Background } from './styles';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email válido')
    .required('Email obrigatório'),
});

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setErrors({});

    try {
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const { email } = Object.fromEntries(formData.entries());

      await schema.validate({ email }, { abortEarly: false });
      await api.post('/password/forgot', {
        email,
      });

      addToast({
        type: 'success',
        title: 'Email de recuperação enviado!',
        description:
          'Enviamos um email para confirmar a recuperação de senha, verifique sua caixa de entrada.',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
      } else {
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="GoBarber" />

          <form onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              icon={FiMail}
              name="email"
              type="text"
              placeholder="Email"
              error={errors.email}
            />

            <Button loading={loading} type="submit" data-testid="submit">
              Recuperar
            </Button>
          </form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
