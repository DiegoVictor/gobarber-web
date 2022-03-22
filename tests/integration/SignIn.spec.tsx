import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';

import * as Auth from '../../src/hooks/auth';
import SignIn from '../../src/pages/SignIn';
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

describe('SignIn page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    const mockedSignIn = jest.fn();
    jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
      signIn: mockedSignIn,
      signOut: jest.fn(),
      user: {} as Auth.User,
      updateUser: jest.fn(),
    }));

    const { email } = await factory.attrs('User');
    const password = faker.random.alphaNumeric(15);

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedSignIn).toHaveBeenCalledWith({
      email,
      password,
    });
  });

  it('should not be able to sign in with invalid data', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, {
      target: { value: faker.random.alphaNumeric(15) },
    });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedHistoryPush).not.toHaveBeenCalled();
  });

  it('should display an error if login fails', async () => {
    const { email } = await factory.attrs('User');
    const signIn = jest.fn(() => {
      throw new Error();
    });
    jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
      signIn,
      signOut: jest.fn(),
      updateUser: jest.fn(),
      user: {} as Auth.User,
    }));

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, {
      target: { value: faker.random.alphaNumeric(15) },
    });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Erro na autenticação',
      description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
    });
  });
});
