import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div``;

export const Header = styled.div`
  background-color: #28262e;
  padding: 32px 0px;
`;

export const HeaderContent = styled.div`
  align-items: center;
  display: flex;
  margin: 0px auto;
  max-width: 1120px;

  > img {
    height: 80px;
  }

  button {
    background-color: transparent;
    border: 0px;
    margin-left: auto;

    svg {
      color: #999591;
      height: 20px;
      width: 20px;
    }
  }
`;

export const Profile = styled.div`
  align-items: center;
  display: flex;
  margin-left: 80px;

  img {
    border-radius: 50%;
    height: 56px;
    width: 56px;
  }

  div {
    display: flex;
    flex-direction: column;
    line-height: 24px;
    margin-left: 16px;

    span {
      color: #f4ede8;
    }

    a {
      color: #ff9000;
      text-decoration: none;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Content = styled.main`
  display: flex;
  margin: 64px auto;
  max-width: 1120px;
`;

export const Schedule = styled.div`
  flex: 1;
  margin-right: 120px;

  h1 {
    font-size: 36px;
  }

  p {
    align-items: center;
    color: #ff9000;
    display: flex;
    font-weight: 500;
    margin-top: 8px;

    span {
      align-items: center;
      display: flex;
    }

    span + span::before {
      background-color: #ff9000;
      content: '';
      height: 16px;
      margin: 0px 8px;
      width: 1px;
    }
  }
`;

export const NextAppointment = styled.div`
  margin-top: 64px;

  > strong {
    color: #999591;
    font-size: 20px;
    font-weight: 400;
  }

  div {
    align-items: center;
    background-color: #3e3b47;
    border-radius: 10px;
    display: flex;
    margin-top: 24px;
    padding: 16px 24px;
    position: relative;

    &::before {
      background-color: #ff9000;
      content: '';
      height: 80%;
      left: 0px;
      position: absolute;
      top: 10%;
      width: 2px;
    }

    img {
      border-radius: 50%;
      height: 80px;
      width: 80px;
    }

    strong {
      color: #fff;
      margin-left: 24px;
    }

    span {
      align-items: center;
      color: #999591;
      display: flex;
      margin-left: auto;

      svg {
        color: #ff9000;
        margin-right: 8px;
      }
    }
  }
`;

export const Section = styled.section`
  margin-top: 48px;

  > strong {
    border-bottom: 1px solid #3e3b47;
    color: #999591;
    display: block;
    font-size: 20px;
    line-height: 26px;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: #999591;
  }
`;

export const Appointment = styled.div`
  align-items: center;
  display: flex;

  & + div {
    margin-top: 16px;
  }

  span {
    align-items: center;
    color: #f4ede8;
    display: flex;
    margin-left: auto;
    width: 70px;

    svg {
      color: #ff9000;
      margin-right: 8px;
    }
  }

  div {
    align-items: center;
    background-color: #3e3b47;
    border-radius: 10px;
    display: flex;
    flex: 1;
    margin-left: 24px;
    padding: 16px 24px;

    img {
      border-radius: 50%;
      height: 56px;
      width: 56px;
    }

    strong {
      color: #fff;
      font-size: 20px;
      margin-left: 24px;
    }
  }
`;

export const Calendar = styled.aside`
  width: 380px;

  .DayPicker {
    background-color: #28262e;
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0px;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }

  .DayPicker-Day {
    height: 40px;
    width: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background-color: #3e3b47;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }
`;
