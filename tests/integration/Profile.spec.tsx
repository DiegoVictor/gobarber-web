import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';

import Profile from '../../src/pages/Profile';
import api from '../../src/services/api';
import factory from '../utils/factory';

interface User {
  name: string;
  email: string;
}

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => mockNavigate,
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

const mockedUpdateUser = jest.fn();
jest.mock('../../src/hooks/auth', () => ({
  useAuth: () => ({
    user: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'http://example.com/avatar.png',
    },
    updateUser: mockedUpdateUser,
  }),
}));

const mockedAddToast = jest.fn();
jest.mock('../../src/hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Profile page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedUpdateUser.mockClear();
    mockedAddToast.mockClear();
    mockNavigate.mockClear();
  });

  it('should be able to update user data', async () => {
    const user = await factory.attrs<User>('User');
    const password = faker.string.alphanumeric(15);
    const newPassword = faker.string.alphanumeric(15);

    apiMock.onPut('/profile').reply(200, user);

    const { getByTestId, getByPlaceholderText } = render(<Profile />);

    fireEvent.change(getByPlaceholderText('Nome'), {
      target: { value: user.name },
    });
    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: user.email },
    });

    fireEvent.change(getByPlaceholderText('Senha atual'), {
      target: { value: password },
    });
    fireEvent.change(getByPlaceholderText('Nova senha'), {
      target: { value: newPassword },
    });
    fireEvent.change(getByPlaceholderText('Confirmar senha'), {
      target: { value: newPassword },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockedUpdateUser).toHaveBeenCalledWith(user);
    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'success',
      title: 'Perfil atualizado!',
      description: 'Suas informações do perfil foram atualizadas com sucesso!',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should not be able to update user with invalid data', async () => {
    const password = faker.string.alphanumeric(15);
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <Profile />,
    );

    fireEvent.change(getByPlaceholderText('Senha atual'), {
      target: { value: password },
    });
    fireEvent.change(getByPlaceholderText('Nova senha'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(mockedAddToast).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('should not be able to update user data with network error', async () => {
    const { name, email } = await factory.attrs<User>('User');

    apiMock.onPut('/profile').reply(404);

    const { getByTestId, getByPlaceholderText } = render(<Profile />);

    fireEvent.change(getByPlaceholderText('Nome'), {
      target: { value: name },
    });
    fireEvent.change(getByPlaceholderText('Email'), {
      target: { value: email },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(mockedUpdateUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Erro na atualização',
      description: 'Ocorreu um erro ao atualizar o perfil, tente novamente.',
    });
  });

  it('should be able to update user avatar', async () => {
    const avatar_url = faker.image.url();
    apiMock.onPatch('/users/avatar').reply(200, { avatar_url });

    const { getByTestId } = render(<Profile />);

    await act(async () => {
      fireEvent.change(getByTestId('avatar'), {
        target: { value: '' },
      });
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'success',
      title: 'Avatar atualizado!',
    });
    expect(mockedUpdateUser).toHaveBeenCalledWith({ avatar_url });
  });
});
