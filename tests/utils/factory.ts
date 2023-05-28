import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Toast',
  {},
  {
    id: () => String(faker.string.uuid()),
    title: faker.word.words,
    description: faker.lorem.paragraph,
  },
);

factory.define(
  'User',
  {},
  {
    id: () => String(faker.string.uuid()),
    name: faker.person.fullName,
    email: faker.internet.email,
    avatar_url: faker.image.url,
  },
);

factory.define(
  'Appointment',
  {},
  {
    id: () => String(faker.string.uuid()),
    date: faker.date.future,
    user: {
      name: faker.person.fullName,
      avatar_url: faker.image.url,
    },
  },
);

export default factory;
