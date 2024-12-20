"use client"

interface EmojiSet {
  emoji: string
  name: string
  description: string
}

const popularEmojis: EmojiSet[] = [
  // 表情和情感
  { emoji: '🥹', name: 'Holding Back Tears', description: 'A face holding back tears, expressing gratitude or touched emotions' },
  { emoji: '🥰', name: 'Smiling Face with Hearts', description: 'A face with smiling eyes and three hearts floating around it' },
  { emoji: '🤣', name: 'Rolling on the Floor Laughing', description: 'A face rolling on the floor with tears of joy' },
  { emoji: '🥺', name: 'Pleading Face', description: 'A face with big glossy eyes, appearing to plead or ask for something' },
  { emoji: '🫠', name: 'Melting Face', description: 'A face that is melting away, used for various overwhelming feelings' },
  
  // 动物
  { emoji: '🦄', name: 'Unicorn', description: 'A mythical unicorn head, representing magic and uniqueness' },
  { emoji: '🦋', name: 'Butterfly', description: 'A blue butterfly, symbolizing transformation and beauty' },
  { emoji: '🦕', name: 'Sauropod', description: 'A friendly-looking dinosaur with a long neck' },
  { emoji: '🦭', name: 'Seal', description: 'A cute seal, often used for their playful nature' },
  { emoji: '🦝', name: 'Raccoon', description: 'A raccoon face, known for being clever and curious' },

  // 食物
  { emoji: '🍜', name: 'Steaming Bowl', description: 'A bowl of steaming hot noodles' },
  { emoji: '🧋', name: 'Bubble Tea', description: 'A cup of bubble tea with tapioca pearls' },
  { emoji: '🌮', name: 'Taco', description: 'A Mexican taco filled with meat and vegetables' },
  { emoji: '🥐', name: 'Croissant', description: 'A flaky, buttery croissant' },
  { emoji: '🍣', name: 'Sushi', description: 'A piece of sushi, representing Japanese cuisine' },

  // 自然
  { emoji: '🌸', name: 'Cherry Blossom', description: 'A pink cherry blossom flower' },
  { emoji: '🌊', name: 'Ocean Wave', description: 'A large ocean wave, representing the power of nature' },
  { emoji: '🌈', name: 'Rainbow', description: 'A colorful rainbow after the rain' },
  { emoji: '⭐', name: 'Star', description: 'A glowing yellow star' },
  { emoji: '🌙', name: 'Crescent Moon', description: 'A crescent moon in the night sky' },

  // 活动
  { emoji: '🎮', name: 'Video Game', description: 'A video game controller' },
  { emoji: '🎨', name: 'Artist Palette', description: 'An artist\'s palette with paint colors' },
  { emoji: '🎧', name: 'Headphones', description: 'A pair of headphones for listening to music' },
  { emoji: '📚', name: 'Books', description: 'A stack of books, representing knowledge and reading' },
  { emoji: '🎪', name: 'Circus Tent', description: 'A colorful circus tent for entertainment' },

  // 交通
  { emoji: '🚀', name: 'Rocket', description: 'A rocket launching into space' },
  { emoji: '🛸', name: 'Flying Saucer', description: 'A UFO or flying saucer' },
  { emoji: '🚲', name: 'Bicycle', description: 'A bicycle for eco-friendly transportation' },
  { emoji: '🎢', name: 'Roller Coaster', description: 'An exciting roller coaster ride' },
  { emoji: '🚁', name: 'Helicopter', description: 'A helicopter flying in the sky' },

  // 物品
  { emoji: '💎', name: 'Gem Stone', description: 'A shining blue gem stone' },
  { emoji: '🎁', name: 'Wrapped Gift', description: 'A wrapped present with a bow' },
  { emoji: '🔮', name: 'Crystal Ball', description: 'A mystical crystal ball' },
  { emoji: '🎭', name: 'Performing Arts', description: 'Drama masks representing theater' },
  { emoji: '🎪', name: 'Circus Tent', description: 'A colorful circus tent' },

  // 符号
  { emoji: '💫', name: 'Dizzy', description: 'Stars spinning in a circle' },
  { emoji: '💭', name: 'Thought Balloon', description: 'A cloud representing thoughts' },
  { emoji: '💝', name: 'Heart with Ribbon', description: 'A heart wrapped with a ribbon' },
  { emoji: '✨', name: 'Sparkles', description: 'Glittering sparkles' },
  { emoji: '🌟', name: 'Glowing Star', description: 'A glowing star with rays' },

  // 天气
  { emoji: '🌤️', name: 'Sun Behind Small Cloud', description: 'The sun peeking behind a small cloud' },
  { emoji: '⛈️', name: 'Thunder Cloud and Rain', description: 'A storm cloud with lightning and rain' },
  { emoji: '🌈', name: 'Rainbow', description: 'A beautiful rainbow' },
  { emoji: '❄️', name: 'Snowflake', description: 'A delicate snowflake' },
  { emoji: '🌪️', name: 'Tornado', description: 'A swirling tornado' },

  // 幻想
  { emoji: '🧚', name: 'Fairy', description: 'A magical fairy' },
  { emoji: '🧙‍♂️', name: 'Wizard', description: 'A wizard with magical powers' },
  { emoji: '🔮', name: 'Crystal Ball', description: 'A mystical crystal ball' },
  { emoji: '🦄', name: 'Unicorn', description: 'A magical unicorn' },
  { emoji: '🧞', name: 'Genie', description: 'A magical genie from a lamp' }
]

export function useEmojiAlbums() {

  const generateEmojiAlbums = () => {
    // 随机选择50个emoji
    const selectedEmojis = [...popularEmojis]
      .sort(() => 0.5 - Math.random())
      .slice(0, 50)

    return selectedEmojis.map((emojiSet, index) => ({
      id: `emoji-${Date.now()}-${index}`,
      title: emojiSet.name,
      artist: emojiSet.description,
      cover: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${getRandomColor()};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${getRandomColor()};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad${index})"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120px">${emojiSet.emoji}</text>
        </svg>
      `)}`,
      isCustom: false,
      addedAt: new Date().toISOString()
    }))
  }

  // 生成随机颜色
  function getRandomColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B6B6B', '#E9D985', '#556270', '#6C5B7B'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return {
    generateEmojiAlbums
  }
}
