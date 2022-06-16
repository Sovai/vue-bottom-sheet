export const elHasScrollY = (el) => {
  const { scrollHeight, offsetHeight } = el;
  return scrollHeight > offsetHeight;
};

export const elScrolledBottom = (el) => {
  const { scrollHeight, scrollTop, offsetHeight } = el;
  return scrollHeight - scrollTop === offsetHeight;
};

export const elScrolledTop = (el) => {
  const { scrollTop } = el;
  return scrollTop === 0;
};
