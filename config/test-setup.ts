// happy-dom does not currently expose Document.compatMode. The application
// itself has a standards-mode doctype, so mirror that browser contract in tests
// before KaTeX is imported.
if (typeof document !== 'undefined' && document.compatMode !== 'CSS1Compat') {
  Object.defineProperty(document, 'compatMode', {
    configurable: true,
    value: 'CSS1Compat',
  });
}
