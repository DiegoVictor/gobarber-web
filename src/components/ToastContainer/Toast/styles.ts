import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ContainerProps {
  type?: 'success' | 'error' | 'info';
  $hasDescription: number;
}

const ToastTypeVariations = {
  info: css`
    background-color: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background-color: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background-color: #fddede;
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ContainerProps>`
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 16px 30px 16px 16px;
  position: relative;
  width: 360px;

  ${props => ToastTypeVariations[props.type || 'info']}

  & + div {
    margin-top: 8px;
  }

  > svg {
    margin: 4px 12px 0px 0px;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      line-height: 20px;
      opacity: 0.8;
    }
  }

  button {
    background: transparent;
    border: 0px;
    color: inherit;
    opacity: 0.8;
    position: absolute;
    right: 16px;
    top: 19px;
  }

  ${props =>
    !props.$hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0px;
      }
    `}
`;
