export default function (els, fn) {
  if (!els.length) {
    return Promise.resolve();
  }

  return Promise.all(els.map(fn).filter(Boolean));
}
