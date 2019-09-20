import React, { useState, useMemo, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
// import { utcToZonedTime } from 'date-fns-tz';
import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Container, Time } from './styles';
import api from '~/services/api';

const times = (() => {
  const hours = [];
  for (let i = 8; i < 21; i += 1) {
    hours.push(i);
  }
  return hours;
})();

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    (async () => {
      const response = await api.get('schedule', {
        params: { date },
      });
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

      const data = times.map(hour => {
        const checkDate = setSeconds(setMinutes(setHours(date, hour), 0), 0);
        const compareDate = utcToZonedTime(checkDate, timeZone);
        return {
          time: `${hour}:00h`,
          past: isBefore(compareDate, new Date()),
          appointment: response.data.find(a =>
            isEqual(parseISO(a.date), compareDate)
          ),
        };
      });

      setSchedules(data);
    })();
  }, [date]);

  return (
    <Container>
      <header>
        <button type="button">
          <MdChevronLeft
            size={36}
            color="#FFF"
            onClick={() => setDate(subDays(date, 1))}
          />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button">
          <MdChevronRight
            size={36}
            color="#FFF"
            onClick={() => setDate(addDays(date, 1))}
          />
        </button>
      </header>

      <ul>
        {schedules.map(schedule => (
          <Time
            key={schedule.time}
            past={schedule.past}
            available={!schedule.appointment}
          >
            <strong>{schedule.time}</strong>
            <span>
              {schedule.appointment
                ? schedule.appointment.user.name
                : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
