import React from 'react';
import {
  RouteProps as ReactRouterProps,
  Route as ReactRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

interface RouteProps extends ReactRouterProps {
  privated?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  privated = false,
  component: Component,
  ...props
}) => {
  const { user } = useAuth();

  return (
    <ReactRoute
      {...props}
      render={({ location }) => {
        return privated === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              state: { from: location },
              pathname: privated ? '/' : '/dashboard',
            }}
          />
        );
      }}
    />
  );
};

export default Route;
