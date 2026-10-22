function log(level, message, context = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  const line = JSON.stringify(entry);
  if (process.env.NODE_ENV === 'test') return entry;
  if (level === 'ERROR') {
    console.error(line);
  } else {
    console.log(line);
  }
  return entry;
}

module.exports = {
  info: (message, context) => log('INFO', message, context),
  warn: (message, context) => log('WARN', message, context),
  error: (message, context) => log('ERROR', message, context),
};
