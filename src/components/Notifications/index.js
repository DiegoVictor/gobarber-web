import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification,
} from './styles';
import api from '~/services/api';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const hasUnread = useMemo(() => !!notifications.find(n => !n.read), [
    notifications,
  ]);

  useEffect(() => {
    (async () => {
      const response = await api.get('notifications');

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        ),
      }));

      setNotifications(data);
    })();
  }, []);

  return (
    <Container>
      <Badge onClick={() => setVisible(!visible)} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" sie={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(notification => (
            <Notification unread={!notification.read} key={notification._id}>
              <p>{notification.content}</p>
              <time>{notification.timeDistance}</time>
              {!notification.read && (
                <button
                  type="button"
                  onClick={async () => {
                    await api.put(`notifications/${notification._id}`);
                    setNotifications(
                      notifications.map(n => {
                        if (n._id === notification._id) {
                          return { ...n, read: true };
                        }
                        return n;
                      })
                    );
                  }}
                >
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
