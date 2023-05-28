import { act, renderHook } from '@testing-library/react';

import {
  ToastMessage,
  ToastProvider,
  useToast,
} from '../../../src/hooks/toast';
import factory from '../../utils/factory';

describe('Toast hook', () => {
  it('should be able to add/remove a toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });
    const message = await factory.attrs<ToastMessage>('Toast');

    await act(async () => {
      result.current.addToast(message);
    });

    expect(result.current.messages).toContainEqual({
      ...message,
      id: expect.any(String),
    });

    const [{ id }] = result.current.messages;
    await act(async () => {
      result.current.removeToast(id);
    });

    expect(result.current.messages).toStrictEqual([]);
  });
});
