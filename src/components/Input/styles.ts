import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  $isFocused: boolean;
  $isFilled: boolean;
  $isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  align-items: center;
  background-color: #232129;
  border: 2px solid #232129;
  border-radius: 10px;
  color: #666360;
  display: flex;
  padding: 16px;
  width: 100%;

  ${props =>
    props.$isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.$isFocused &&
    css`
      border-color: #ff9000;
      color: #ff9000;
    `}

  ${props =>
    props.$isFilled &&
    css`
      color: #ff9000;
    `}

  & + div {
    margin-top: 8px;
  }

  input {
    background-color: transparent;
    border: 0px;
    color: #f4ede8;
    flex: 1;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0px;
  }

  span {
    background-color: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
