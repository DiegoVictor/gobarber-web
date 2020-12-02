import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    align-items: center;
    background-color: #28262e;
    display: flex;
    height: 144px;

    > div {
      margin: 0px auto;
      max-width: 1120px;
      width: 100%;

      svg {
        color: #999591;
        height: 24px;
        width: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: -176px auto 0px;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    margin: 80px 0px;
    text-align: center;
    width: 340px;

    h1 {
      font-size: 20px;
      margin-bottom: 24px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  align-self: center;
  margin-bottom: 32px;
  position: relative;

  img {
    border-radius: 50%;
    height: 186px;
    width: 186px;
  }

  label {
    align-items: center;
    background-color: #ff9000;
    border: 0px;
    border-radius: 50%;
    bottom: 0px;
    cursor: pointer;
    display: flex;
    height: 48px;
    justify-content: center;
    position: absolute;
    right: 0px;
    transition: background-color 0.2s;
    width: 48px;

    input {
      display: none;
    }

    svg {
      color: #312e38;
      height: 20px;
      width: 20px;
    }

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }
  }
`;
