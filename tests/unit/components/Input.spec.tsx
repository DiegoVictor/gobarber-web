import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Input from '../../../src/components/Input';

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="Email" />,
    );

    const inputElement = getByPlaceholderText('Email');
    expect(inputElement).toBeTruthy();

    const value = 'john@example.com';
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, { target: { value } });
    fireEvent.blur(inputElement);

    expect(inputElement).toHaveValue(value);
  });
});
