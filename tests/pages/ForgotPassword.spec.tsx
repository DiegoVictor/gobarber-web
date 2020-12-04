import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ForgotPassword from '../../src/pages/ForgotPassword';
import api from '../../src/services/api';
import factory from '../utils/factory';

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

const mockedAddToast = jest.fn();
jest.mock('../../src/hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedAddToast.mockClear();
  });

  it('should be able to start forgot password process', async () => {
    const { email } = await factory.attrs('User');

    apiMock.onPost('/password/forgot').reply(200);
    const { getByTestId, getByPlaceholderText } = render(<ForgotPassword />);

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'success',
      title: 'Email de recuperação enviado!',
      description:
        'Enviamos um email para confirmar a recuperação de senha, verifique sua caixa de entrada.',
    });
  });

  it('should not be able to start forgot password process with invalid email', async () => {
    apiMock.onPost('/password/forgot').reply(200);
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <ForgotPassword />,
    );

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: 'johndoe' },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockedAddToast).not.toHaveBeenCalled();
    expect(getByText('Digite um email válido')).toBeInTheDocument();
  });

  it('should not be able to start forgot password process with network error', async () => {
    const { email } = await factory.attrs('User');

    apiMock.onPost('/password/forgot').reply(404);
    const { getByTestId, getByPlaceholderText } = render(<ForgotPassword />);

    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Erro na recuperação de senha',
      description: 'Ocorreu um erro ao tentar realizar a recuperação de senha.',
    });
  });
});
