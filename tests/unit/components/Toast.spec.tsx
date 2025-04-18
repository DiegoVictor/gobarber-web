import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { SpringValue } from 'react-spring';

import Toast from '../../../src/components/ToastContainer/Toast';
import factory from '../../utils/factory';
import { ToastMessage } from '../../../src/hooks/toast';

const mockedRemoveToast = jest.fn();
jest.mock('../../../src/hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Toast component', () => {
  beforeEach(() => {
    mockedRemoveToast.mockClear();
  });

  it('should be able to render toast without description', async () => {
    const message = await factory.attrs<Required<ToastMessage>>('Toast', {
      description: undefined,
    });
    const { getByText, getByTestId } = render(
      <Toast
        message={message}
        style={{
          right: new SpringValue(),
          opacity: new SpringValue(),
        }}
      />,
    );

    expect(getByText(message.title)).toBeInTheDocument();

    fireEvent.click(getByTestId('remove'));

    expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
  });

  it('should be able to remove the toast', async () => {
    const message = await factory.attrs<Required<ToastMessage>>('Toast');
    const { getByText, getByTestId } = render(
      <Toast
        message={message}
        style={{
          right: new SpringValue(),
          opacity: new SpringValue(),
        }}
      />,
    );

    expect(getByText(message.title)).toBeInTheDocument();
    expect(getByText(message.description)).toBeInTheDocument();

    fireEvent.click(getByTestId('remove'));

    expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
  });

  it('should be able to automatically remove yourself', async () => {
    jest.useFakeTimers();

    const message = await factory.attrs<Required<ToastMessage>>('Toast');
    const { getByText } = render(
      <Toast
        message={message}
        style={{
          right: new SpringValue(),
          opacity: new SpringValue(),
        }}
      />,
    );

    expect(getByText(message.title)).toBeInTheDocument();
    expect(getByText(message.description)).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    expect(mockedRemoveToast).toHaveBeenCalledWith(message.id);
  });
});
