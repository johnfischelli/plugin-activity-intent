import { FlexPlugin } from 'flex-plugin';
import ActivityIntentReducer from './ActivityIntentReducer';

const PLUGIN_NAME = 'ActivityIntentPlugin';

export default class ActivityIntentPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    manager.store.addReducer("intendedActivity", ActivityIntentReducer);

    flex.Actions.addListener('beforeSetActivity', (payload, abort) => {
      let state = manager.store.getState();
      if (state.flex.worker.tasks.size) {
        window.localStorage.setItem('intendedActivity', payload.activitySid);
        abort();
      }
    })

    flex.Actions.addListener('afterCompleteTask', (payload) => {
      setTimeout(() => {
        let state = manager.store.getState();
        let intended = window.localStorage.getItem('intendedActivity');
        if (!state.flex.worker.tasks.size && intended) {
          flex.Actions.invokeAction('SetActivity', {
            activitySid: intended,
            rejectPendingReservations: true
          })
          window.localStorage.removeItem('intendedActivity');
        }
      }, 500)
    })
  }
}
