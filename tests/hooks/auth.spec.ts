import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';

import { useAuth, AuthProvider } from '../../src/hooks/auth';
import api from '../../src/services/api';
import factory from '../utils/factory';

describe('Auth hook', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to sign in', async () => {
    const user = await factory.attrs('User');
    const token = faker.random.alphaNumeric(10);

    const response = {
      user,
      token,
    };
    apiMock.onPost('sessions').reply(200, response);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: user.email,
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', token);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(response.user),
    );
    expect(result.current.user.email).toEqual(user.email);
  });

  it('should restore saved data from storage when auth inits', async () => {
    const user = await factory.attrs('User');
    const token = faker.random.alphaNumeric(10);
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return token;

        case '@GoBarber:user':
          return JSON.stringify(user);

        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual(user.email);
  });

  it('should be able to sign out', async () => {
    const user = await factory.attrs('User');
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const token = faker.random.alphaNumeric(10);

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return token;

        case '@GoBarber:user':
          return JSON.stringify(user);

        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const user = await factory.attrs('User');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });
});
