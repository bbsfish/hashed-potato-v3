/* eslint-disable */

/**
 * "blue-cat" のように {形容詞-名詞} のランダムな文字列を生成する
 * @returns {String} 生成されたランダムなID
 */

function generateRandomId() {
  const adjectives = [
    'red', 'blue', 'energetic', 'small', 'new',
    'happy', 'fast', 'bright', 'warm', 'cool',
    'calm', 'brave', 'clever', 'elegant', 'funny',
    'gentle', 'jolly', 'kind', 'lively', 'mellow',
    'sunny', 'vivid', 'mysterious', 'vibrant', 'dynamic',
    'sparkling', 'glistening', 'serene', 'joyful', 'dazzling',
    'radiant', 'zesty', 'exquisite', 'whimsical', 'playful',
    'soothing', 'vital', 'gleaming', 'effervescent', 'blissful',
    'captivating', 'serendipitous', 'stellar', 'splendid', 'effortless'
  ];

  const nouns = [
    'cat', 'mountain', 'book', 'sea', 'star',
    'dog', 'tree', 'river', 'moon', 'sun',
    'flower', 'bird', 'cloud', 'wave', 'island',
    'bridge', 'castle', 'planet', 'rainbow', 'unicorn',
    'ocean', 'breeze', 'crystal', 'dream', 'harmony',
    'whisper', 'echo', 'garden', 'horizon', 'zenith',
    'cascade', 'jubilee', 'lagoon', 'melody', 'nectar',
    'oracle', 'quasar', 'radiance', 'sapphire', 'tempest',
    'veranda', 'wonder', 'yonder', 'zenith', 'enigma'
  ];

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generateId() {
    const adjective = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);

    const generatedId = `${adjective}-${noun}`;
    return generatedId;
  }

  return generateId();
}

export default generateRandomId;
