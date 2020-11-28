import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background-color: #ff9000;
  border: 0px;
  border-radius: 10px;
  color: #312e38;
  font-weight: bold;
  height: 56px;
  margin-top: 16px;
  padding: 0px 16px;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
`;
