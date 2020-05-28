export default (state, payload) => {
    const { item, ...rest } = payload;

    if (item === null) {
        rest.userId = null;
    } else if (item && item.userId) {
        rest.userId = state.userId !== item.userId ? item.userId : null;
    }

    return { ...state, ...rest };
};
