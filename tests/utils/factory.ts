import factory from 'factory-girl';
import faker from 'faker';

factory.define(
  'Toast',
  {},
  {
    id: () => String(faker.datatype.number()),
    title: faker.name.title,
    description: faker.lorem.paragraph,
  },
);

factory.define(
  'User',
  {},
  {
    id: () => String(faker.datatype.number()),
    name: faker.name.findName,
    email: faker.internet.email,
    avatar_url: faker.image.imageUrl,
  },
);

factory.define(
  'Appointment',
  {},
  {
    id: () => String(faker.datatype.number()),
    date: faker.date.future,
    user: {
      name: faker.name.findName,
      avatar_url: faker.image.imageUrl,
    },
  },
);

export default factory;
