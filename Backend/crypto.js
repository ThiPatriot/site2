function generateRandomState() {
  const state = Math.random().toString(36).substring(2, 10); // Example random state generation
  return state;
}

module.exports = generateRandomState;