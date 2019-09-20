import React from 'react';
import PropTypes from 'prop-types';

import { Container, Column } from './styles';

export default function AuthLayout({ children }) {
  return (
    <Container>
      <Column>{children}</Column>
    </Container>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
