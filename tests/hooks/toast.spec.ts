import { renderHook, act } from '@testing-library/react-hooks';

import { ToastProvider, useToast } from '../../src/hooks/toast';
import factory from '../utils/factory';

describe('Toast hook', () => {
  it('should be able to add/remove a toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });
    const message = await factory.attrs('Toast');

    act(() => {
      result.current.addToast(message);
    });

    expect(result.current.messages).toContainEqual({
      ...message,
      id: expect.any(String),
    });

    const [{ id }] = result.current.messages;
    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.messages).toStrictEqual([]);
  });
});
