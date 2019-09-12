import styled from 'styled-components';

export const Container = styled.div`
  background-color: #fff;
  padding: 0px 30px;
`;

export const Column = styled.div`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: space-between;
  margin: 0px auto;
  max-width: 900px;

  nav {
    align-items: center;
    display: flex;

    img {
      border-right: 1px solid #eee;
      margin-right: 20px;
      padding-right: 20px;
    }

    a {
      color: #7159c1;
      font-weight: bold;
    }
  }

  aside {
    align-items: center;
    display: flex;
  }
`;

export const Profile = styled.div`
  border-left: 1px solid #eee;
  display: flex;
  margin-left: 20px;
  padding-left: 20px;

  div {
    margin-right: 10px;
    text-align: right;

    strong {
      color: #333;
      display: block;
    }

    a {
      color: #999;
      display: block;
      font-size: 12px;
      margin-top: 2px;
    }
  }
  img {
    border-radius: 50%;
    height: 32px;
    width: 32px;
  }
`;
