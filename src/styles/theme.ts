import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;
    outline: 0px;
    padding: 0px;
  }

  body {
    -webkit-font-smoothing: antialiased;
    background-color: #312E38;
    color: #FFF;
  }

  body, input, button {
    font-family: 'Roboto Slab', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500
  }

  button {
    cursor: pointer;
  }
`;
