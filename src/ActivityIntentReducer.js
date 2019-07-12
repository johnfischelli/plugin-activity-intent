const initialState = {
  intendedActivity: false
};

const activityIntentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_INTENDED_ACTIVITY':
      return {
        ...state,
        intendedActivity: action.payload.intendedActivity
      };
    default:
      return state;
  }
};

export default activityIntentReducer;