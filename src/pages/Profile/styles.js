import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  margin: 50px auto;
  max-width: 600px;

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

    hr {
      background-color: rgba(255, 255, 255, 0.1);
      border: 0px;
      height: 1px;
      margin: 10px 0px 20px;
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
  }

  > button {
    background-color: #f64c75;
    border: 0px;
    border-radius: 4px;
    color: #fff;
    display: block;
    font-size: 16px;
    height: 44px;
    margin: 10px 0px 0px;
    transition: background 0.2s;
    width: 100%;

    &:hover {
      background-color: ${darken(0.08, '#f64c75')};
    }
  }
`;
