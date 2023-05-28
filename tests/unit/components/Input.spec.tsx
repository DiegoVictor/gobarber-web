import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Input from '../../../src/components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

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
