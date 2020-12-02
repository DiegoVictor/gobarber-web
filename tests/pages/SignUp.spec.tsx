import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';

import SignUp from '../../src/pages/SignUp';
import api from '../../src/services/api';
import factory from '../utils/factory';

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
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

describe('SignUp page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign up', async () => {
    const { name, email } = await factory.attrs('User');

    apiMock.onPost('users').reply(200);

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: name } });
    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, {
      target: { value: faker.random.alphaNumeric(15) },
    });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'success',
      title: 'Cadastro realizado!',
      description: 'Você já pode fazer seu logon no GoBarber!',
    });
  });

  it('should not be able to sign up with invalid data', async () => {
    const { getByText } = render(<SignUp />);

    const buttonElement = getByText('Cadastrar');

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedHistoryPush).not.toHaveBeenCalled();

    expect(getByText('Nome obrigatório')).toBeInTheDocument();
    expect(getByText('Email obrigatório')).toBeInTheDocument();
    expect(getByText('No minimo 6 digitos')).toBeInTheDocument();
  });

  it('should not be able to sign up', async () => {
    const { name, email } = await factory.attrs('User');

    apiMock.onPost('users').reply(400);

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: name } });
    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, {
      target: { value: faker.random.alphaNumeric(15) },
    });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedHistoryPush).not.toHaveBeenCalled();
    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Erro no cadastro',
      description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.',
    });
  });
});
