import React from 'react';
import { render } from '@testing-library/react';

import factory from '../../utils/factory';
import ToastContainer from '../../../src/components/ToastContainer';
import { ToastMessage } from '../../../src/hooks/toast';

describe('ToastContainer', () => {
  it('should be able to see toasts', async () => {
    const message = await factory.attrs<Required<ToastMessage>>('Toast');
    const { getByText } = render(<ToastContainer messages={[message]} />);

    expect(getByText(message.title)).toBeInTheDocument();
    expect(getByText(message.description)).toBeInTheDocument();
  });
});
