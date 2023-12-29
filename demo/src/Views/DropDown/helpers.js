export const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind, title: `${title} ${ind}` });
    }

    return res;
};

/** Test enable\disable feature */
export const toggleEnable = (e, dropDown) => {
    const button = e.target;

    dropDown.enable(dropDown.disabled);
    button.textContent = (dropDown.disabled) ? 'Enable' : 'Disable';
};

export const formatObject = (value) => (
    JSON.stringify(value) ?? 'undefined'
);
