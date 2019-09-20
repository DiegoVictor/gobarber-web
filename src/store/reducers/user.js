import produce from 'immer';

const initial_sate = {
  profile: null,
};

export default function(state = initial_sate, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS':
        draft.profile = action.payload.user;
        break;

      case '@user/UPDATE_PROFILE_SUCCESS':
        draft.profile = action.payload;
        break;

      case '@auth/SIGN_OUT': {
        draft.profile = null;
        break;
      }
      default:
    }
  });
}
