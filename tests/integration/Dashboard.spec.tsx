import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { faker } from '@faker-js/faker';
import ptBR from 'date-fns/locale/pt-BR';
import { format, setHours } from 'date-fns';

import Dashboard from '../../src/pages/Dashboard';
import api from '../../src/services/api';
import factory from '../utils/factory';

interface Appointment {
  id: string;
  user: {
    avatar_url: string;
  };
  date: Date;
}

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

const user_id = faker.string.uuid();

const mockedSignOut = jest.fn();
const mockedUseAuth = (): {
  signOut: () => void;
  user: { id: string; name: string; email: string; avatar_url: string };
} => ({
  user: {
    id: user_id,
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar_url: 'http://example.com/avatar.png',
  },
  signOut: mockedSignOut,
});

jest.mock('../../src/hooks/auth', () => ({
  useAuth: () => {
    return mockedUseAuth();
  },
}));

const mockedAddToast = jest.fn();
jest.mock('../../src/hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

const mockedIsToday = jest.fn(() => false);
jest.mock('date-fns', () => {
  return {
    ...jest.requireActual('date-fns'),
    isToday: () => {
      return mockedIsToday();
    },
  };
});

const mockClick = jest.fn();
jest.mock('react-day-picker', () => {
  return {
    DayPicker: function FakeDayPicker({
      onDayClick,
      onMonthChange,
    }: {
      onDayClick: () => void;
      onMonthChange: () => void;
    }) {
      return (
        <button
          type="button"
          data-testid="calendar"
          onClick={() => mockClick({ onDayClick, onMonthChange })}
        >
          Calendar
        </button>
      );
    },
  };
});

describe('Dashboard page', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    mockedAddToast.mockClear();
  });

  it('should be able to signout', async () => {
    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [])
      .onGet('/appointments/schedule')
      .reply(200, []);

    const { getByTestId } = render(<Dashboard />);

    await act(async () => {
      fireEvent.click(getByTestId('signout'));
    });

    expect(mockedSignOut).toHaveBeenCalled();
  });

  it('should not be able to load month availability', async () => {
    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(400)
      .onGet('/appointments/schedule')
      .reply(200, []);

    await act(async () => {
      render(<Dashboard />);
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Ops!',
      description: 'Ocorreu um erro ao tentar carregar alguns dados.',
    });
  });

  it('should not be able to load schedules', async () => {
    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [])
      .onGet('/appointments/schedule')
      .reply(400);

    await act(async () => {
      render(<Dashboard />);
    });

    expect(mockedAddToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Ops!',
      description: 'Ocorreu um erro ao tentar carregar alguns dados.',
    });
  });

  it('should be able to set a different date', async () => {
    const date = new Date(2020, 9, 6);
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return date.getTime();
    });

    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [
        {
          day: 5,
          available: false,
        },
        {
          day: 6,
          available: true,
        },
        {
          day: 7,
          available: true,
        },
      ])
      .onGet('/appointments/schedule')
      .reply(200, []);

    const selectedDate = new Date(2020, 9, 7);
    mockClick.mockImplementation(({ onDayClick }) => {
      onDayClick(selectedDate, { available: true, disabled: false });
    });

    const { getByTestId } = render(<Dashboard />);

    await act(async () => {
      fireEvent.click(getByTestId('calendar'));
    });

    expect(getByTestId('next-appointment-date')).toHaveTextContent(
      format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR }),
    );
  });

  it('should be able to set a different month', async () => {
    const date = new Date(2020, 9, 6);
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return date.getTime();
    });

    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [])
      .onGet('/appointments/schedule')
      .reply(200, []);

    const selectedMonth = new Date(2020, 10);
    mockClick.mockImplementation(({ onMonthChange }) => {
      onMonthChange(selectedMonth);
    });

    const { getByTestId } = render(<Dashboard />);

    await act(async () => {
      fireEvent.click(getByTestId('calendar'));
    });

    expect(mockClick).toHaveBeenCalled();
  });

  it('should be able to see the next appointment', async () => {
    const date = new Date();

    [6, 0].forEach(day => {
      if (date.getDay() === day) {
        date.setDate(date.getDate() + 1);
      }
    });

    mockedIsToday.mockReturnValue(true);
    const appointments = await factory.attrsMany<Appointment>(
      'Appointment',
      2,
      [{ date: setHours(date, 10) }, { date: setHours(date, 16) }],
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return setHours(date, 9).getTime();
    });

    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [
        {
          day: 1,
          available: false,
        },
      ])
      .onGet('/appointments/schedule')
      .reply(200, appointments);

    const { getByText, getByTestId } = render(<Dashboard />);
    const [morning, afternoon] = appointments;

    await waitFor(() =>
      expect(getByText('Agendamento a seguir')).toBeInTheDocument(),
    );

    expect(getByTestId('next-appointment-date')).toHaveTextContent(
      format(Date.now(), "'Dia' dd 'de' MMMM", { locale: ptBR }),
    );
    expect(getByTestId('next-appointment-day')).toHaveTextContent(
      format(Date.now(), 'cccc', { locale: ptBR }),
    );
    expect(getByTestId('next-appointment-image')).toBeInTheDocument();
    expect(getByTestId('next-appointment-image')).toHaveProperty(
      'src',
      morning.user.avatar_url,
    );
    expect(getByTestId('next-appointment-name')).toBeInTheDocument();
    expect(getByTestId('next-appointment-hour')).toHaveTextContent(
      format(morning.date, 'HH:mm'),
    );

    expect(
      getByTestId(`morning-appointment-${morning.id}-image`),
    ).toBeInTheDocument();
    expect(
      getByTestId(`morning-appointment-${morning.id}-image`),
    ).toHaveProperty('src', morning.user.avatar_url);
    expect(
      getByTestId(`morning-appointment-${morning.id}-name`),
    ).toBeInTheDocument();
    expect(
      getByTestId(`morning-appointment-${morning.id}-hour`),
    ).toHaveTextContent(format(morning.date, 'HH:mm'));

    expect(
      getByTestId(`afternoon-appointment-${afternoon.id}-image`),
    ).toBeInTheDocument();
    expect(
      getByTestId(`afternoon-appointment-${afternoon.id}-image`),
    ).toHaveProperty('src', afternoon.user.avatar_url);
    expect(
      getByTestId(`afternoon-appointment-${afternoon.id}-name`),
    ).toBeInTheDocument();
    expect(
      getByTestId(`afternoon-appointment-${afternoon.id}-hour`),
    ).toHaveTextContent(format(afternoon.date, 'HH:mm'));
  });

  it('should be able to see the next appointment skipping weekends', async () => {
    const date = new Date(2020, 10, 6, 9);
    const appointment = await factory.attrs<Appointment>('Appointment', {
      date,
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 9, 3).getTime();
    });

    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [])
      .onGet('/appointments/schedule')
      .reply(200, [appointment]);

    const { getByTestId } = render(<Dashboard />);

    await waitFor(
      () =>
        expect(
          getByTestId(`morning-appointment-${appointment.id}-image`),
        ).toBeInTheDocument(),
      { timeout: 200 },
    );

    expect(
      getByTestId(`morning-appointment-${appointment.id}-image`),
    ).toHaveProperty('src', appointment.user.avatar_url);
    expect(
      getByTestId(`morning-appointment-${appointment.id}-name`),
    ).toBeInTheDocument();
    expect(
      getByTestId(`morning-appointment-${appointment.id}-hour`),
    ).toHaveTextContent(format(appointment.date, 'HH:mm'));
  });
});
