import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  align-items: center;
  background: linear-gradient(-90deg, #7159c1, #ab59c1);
  display: flex;
  justify-content: center;
  height: 100%;
`;

export const Column = styled.div`
  max-width: 315px;
  text-align: center;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background-color: rgba(0, 0, 0, 0.1);
      border: 0px;
      border-radius: 4px;
      color: #fff;
      height: 44px;
      margin: 0px 0px 10px;
      padding: 0px 15px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    span {
      align-self: flex-start;
      color: #fb6f91;
      font-weight: bold;
      margin: 0px 0px 10px;
    }

    button {
      background-color: #3d9eff;
      border: 0px;
      border-radius: 4px;
      color: #fff;
      font-size: 16px;
      height: 44px;
      margin: 5px 0px 0px;
      transition: background 0.2s;

      &:hover {
        background-color: ${darken(0.03, '#3d9eff')};
      }
    }

    a {
      color: #fff;
      font-size: 16px;
      margin-top: 15px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }
`;
