import React from 'react';
import { render } from '@testing-library/react';

import factory from '../utils/factory';
import ToastContainer from '../../src/components/ToastContainer';

describe('ToastContainer', () => {
  it('should be able to see toasts', async () => {
    const message = await factory.attrs('Toast');
    const { getByText } = render(<ToastContainer messages={[message]} />);

    expect(getByText(message.title)).toBeInTheDocument();
    expect(getByText(message.description)).toBeInTheDocument();
  });
});
