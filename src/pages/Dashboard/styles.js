import styled from 'styled-components';

export const Container = styled.div`
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  max-width: 600px;

  header {
    align-items: center;
    align-self: center;
    display: flex;

    button {
      border: 0px;
      background-color: transparent;
    }

    strong {
      color: #fff;
      font-size: 24px;
      margin: 0px 15px;
    }
  }

  ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    margin-top: 30px;
  }
`;

export const Time = styled.div`
  background-color: #fff;
  border-radius: 4px;
  opacity: ${props => (props.past ? 0.6 : 1)}
  padding: 20px;

  strong {
    color: ${props => (props.available ? '#999' : '#7159c1')};
    display: block;
    font-size: 20px;
    font-weight: normal;
  }

  span {
    color: ${props => (props.available ? '#999' : '#666')};
    display: block;
    margin-top: 3px;
  }
`;
