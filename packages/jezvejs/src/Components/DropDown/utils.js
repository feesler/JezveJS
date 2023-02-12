/** Return array of selected items */
export const getSelectedItems = (state) => (
    state?.items?.filter((item) => item?.selected)
);
