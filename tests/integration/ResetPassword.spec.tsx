import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';

import api from '../../src/services/api';
import ResetPassword from '../../src/pages/ResetPassword';

const mockedHistoryPush = jest.fn();
let mockedLocation = jest.fn(() => ({ search: `?token=78df6g87f87989sfd` }));
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: jest.fn(() => {
      return mockedLocation();
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

describe('ResetPassword page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to change password', async () => {
    const password = faker.random.alphaNumeric(15);

    apiMock.onPost('/password/reset').reply(200);

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(newPasswordField, { target: { value: password } });
    fireEvent.change(confirmPasswordField, { target: { value: password } });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedHistoryPush).toHaveBeenCalledWith('/');
  });

  it('should not be able to change password with invalid data', async () => {
    apiMock.onPost('/password/reset').reply(200);

    const { getByText } = render(<ResetPassword />);

    const buttonElement = getByText('Alterar senha');

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(getByText('Senha obrigatória')).toBeInTheDocument();
    expect(mockedHistoryPush).not.toHaveBeenCalled();
  });

  it('should not be able to change password', async () => {
    const password = faker.random.alphaNumeric(15);

    apiMock.onPost('/password/reset').reply(400);

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(newPasswordField, { target: { value: password } });
    fireEvent.change(confirmPasswordField, { target: { value: password } });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Erro ao resetar senha',
      description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
    });
  });

  it('should not be able to change password without token', async () => {
    const password = faker.random.alphaNumeric(15);

    apiMock.onPost('/password/reset').reply(200);

    mockedLocation = jest.fn(() => ({ search: `?token=` }));

    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const newPasswordField = getByPlaceholderText('Nova senha');
    const confirmPasswordField = getByPlaceholderText('Confirmação da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(newPasswordField, { target: { value: password } });
    fireEvent.change(confirmPasswordField, { target: { value: password } });

    await act(async () => {
      fireEvent.click(buttonElement);
    });

    expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
  });
});
