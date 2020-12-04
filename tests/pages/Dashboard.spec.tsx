import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import ptBR from 'date-fns/locale/pt-BR';
import { addMonths, format, setHours } from 'date-fns';

import Dashboard from '../../src/pages/Dashboard';
import api from '../../src/services/api';
import factory from '../utils/factory';

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

const user_id = faker.random.uuid();

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

let mockedIsToday = jest.fn(() => false);
jest.mock('date-fns', () => {
  return {
    ...jest.requireActual('date-fns'),
    isToday: () => {
      return mockedIsToday();
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

  it('should be able to select only available days', async () => {
    const date = new Date(2020, 9, 6);
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return date.getTime();
    });

    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [
        {
          day: 1,
          available: false,
        },
        {
          day: 2,
          available: false,
        },
        {
          day: 3,
          available: false,
        },
        {
          day: 4,
          available: false,
        },
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

    const { getAllByRole, getByTestId } = render(<Dashboard />);
    const days = getAllByRole('gridcell');

    await act(async () => {
      fireEvent.click(days[5]);
    });

    expect(getByTestId('next-appointment-date')).toHaveTextContent(
      format(date, "'Dia' dd 'de' MMMM", { locale: ptBR }),
    );

    await act(async () => {
      fireEvent.click(days[6]);
    });

    date.setDate(date.getDate() + 1);

    expect(getByTestId('next-appointment-date')).toHaveTextContent(
      format(date, "'Dia' dd 'de' MMMM", {
        locale: ptBR,
      }),
    );
  });

  it('should be able to change the calendar month', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 9, 6).getTime();
    });

    apiMock
      .onGet(`/providers/${user_id}/month_availability`)
      .reply(200, [])
      .onGet('/appointments/schedule')
      .reply(200, []);

    const { container } = render(<Dashboard />);
    const nextButton = container.querySelector('.DayPicker-NavButton--next');

    expect(nextButton).toBeInTheDocument();
    await act(async () => {
      if (nextButton) {
        fireEvent.click(nextButton);
      }
    });

    const capitalize = (text: string): string =>
      text.charAt(0).toUpperCase() + text.slice(1);

    const nextMonth = addMonths(Date.now(), 1);
    expect(container.querySelector('.DayPicker-Caption')).toBeInTheDocument();
    expect(container.querySelector('.DayPicker-Caption')).toHaveTextContent(
      capitalize(
        format(nextMonth, 'MMMM yyyy', {
          locale: ptBR,
        }),
      ),
    );
  });

  it('should be able to see the next appointment', async () => {
    const date = new Date();

    [6, 0].forEach(day => {
      if (date.getDay() === day) {
        date.setDate(date.getDate() + 1);
      }
    });

    mockedIsToday = jest.fn(() => true);
    const appointments = await factory.attrsMany('Appointment', 2, [
      { date: setHours(date, 10) },
      { date: setHours(date, 16) },
    ]);

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

    await waitFor(() => expect(getByText('Hoje')).toBeInTheDocument());

    expect(getByText('Agendamento a seguir')).toBeInTheDocument();

    expect(getByTestId('next-appointment-date')).toHaveTextContent(
      format(Date.now(), "'Dia' dd 'de' MMMM", { locale: ptBR }),
    );
    expect(
      getByText(format(Date.now(), 'cccc', { locale: ptBR })),
    ).toBeInTheDocument();
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
    const appointment = await factory.attrs('Appointment', { date });

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
