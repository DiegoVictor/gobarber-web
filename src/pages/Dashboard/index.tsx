import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { addToast } = useToast();

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date(Date.now());

    [6, 0].forEach(day => {
      if (date.getDay() === day) {
        date.setDate(date.getDate() + 1);
      }
    });

    return date;
  });
  const [currentMonth, setCurrentMonth] = useState(new Date(Date.now()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const disabledDays = useMemo(
    () =>
      monthAvailability
        .filter(monthDay => !monthDay.available)
        .map(
          monthDay =>
            new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              monthDay.day,
            ),
        ),
    [currentMonth, monthAvailability],
  );

  const selectedDateAsText = useMemo(
    () => format(selectedDate, "'Dia ' dd ' de ' MMMM", { locale: ptBR }),
    [selectedDate],
  );

  const selectedWeekDay = useMemo(
    () => format(selectedDate, 'cccc', { locale: ptBR }),
    [selectedDate],
  );

  const morningAppointments = useMemo(
    () =>
      appointments.filter(
        appointment => parseISO(appointment.date).getHours() < 12,
      ),
    [appointments],
  );
  const afternoonAppointments = useMemo(
    () =>
      appointments.filter(
        appointment => parseISO(appointment.date).getHours() >= 12,
      ),
    [appointments],
  );

  const nextAppointment = useMemo(
    () =>
      appointments.find(appointment =>
        isAfter(parseISO(appointment.date), Date.now()),
      ),
    [appointments],
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<MonthAvailabilityItem[]>(
          `/providers/${user.id}/month_availability`,
          {
            params: {
              year: currentMonth.getFullYear(),
              month: currentMonth.getMonth() + 1,
            },
          },
        );
        setMonthAvailability(data);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Ops!',
          description: 'Ocorreu um erro ao tentar carregar alguns dados.',
        });
      }
    })();
  }, [currentMonth, user.id, addToast]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Appointment[]>(
          '/appointments/schedule',
          {
            params: {
              year: selectedDate.getFullYear(),
              month: selectedDate.getMonth() + 1,
              day: selectedDate.getDate(),
            },
          },
        );
        setAppointments(
          data.map(appointment => ({
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          })),
        );
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Ops!',
          description: 'Ocorreu um erro ao tentar carregar alguns dados.',
        });
      }
    })();
  }, [selectedDate, addToast]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={Logo} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut} data-testid="signout">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários Agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span data-testid="next-appointment-date">
              {selectedDateAsText}
            </span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                  data-testid="next-appointment-image"
                />
                <strong data-testid="next-appointment-name">
                  {nextAppointment.user.name}
                </strong>
                <span data-testid="next-appointment-hour">
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento nesse periodo</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span
                  data-testid={`morning-appointment-${appointment.id}-hour`}
                >
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                    data-testid={`morning-appointment-${appointment.id}-image`}
                  />

                  <strong
                    data-testid={`morning-appointment-${appointment.id}-name`}
                  >
                    {appointment.user.name}
                  </strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento nesse periodo</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span
                  data-testid={`afternoon-appointment-${appointment.id}-hour`}
                >
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                    data-testid={`afternoon-appointment-${appointment.id}-image`}
                  />

                  <strong
                    data-testid={`afternoon-appointment-${appointment.id}-name`}
                  >
                    {appointment.user.name}
                  </strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            initialMonth={new Date(Date.now())}
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date(Date.now())}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
