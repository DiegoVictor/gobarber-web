import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';
import '~/config/ReactotronConfig';
import { store } from '~/store/';

export default function Middleware({
  component: Component,
  privated,
  ...rest
}) {
  const { signed } = store.getState().auth;

  if (!signed) {
    if (privated) {
      return <Redirect to="/" />;
    }
  } else if (!privated) {
    return <Redirect to="/dashboard" />;
  }

  const Layout = signed ? DefaultLayout : AuthLayout;

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

Middleware.propTypes = {
  privated: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

Middleware.defaultProps = {
  privated: false,
};
