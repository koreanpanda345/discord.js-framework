import { Framework } from '../../Framework';

console.log(`Attempting to load the ready event...`);
if (
  (typeof Framework.config.useDefautlEvents === 'boolean' && Framework.config.useDefautlEvents) ||
  (typeof Framework.config.useDefautlEvents === 'object' && Framework.config.useDefautlEvents.ready)
)
  Framework.events.set('ready', {
    name: 'ready',
    invoke: async () => {
      console.log(`${Framework.client.user?.username} is ready.`);
    },
  });
