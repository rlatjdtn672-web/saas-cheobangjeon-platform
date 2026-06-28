// 자동 생성 (LLM eval 결과). 모델별 게임 결과물 + 점수 + 프롬프트.
export type LabModel = { model: string; name: string; vendor: string; score: number; buildS: number; bytes: number; playable: boolean; hasFile: boolean; url: string | null; isClaude: boolean; features: Record<string, boolean> };
export type LabTask = { key: string; title: string; emoji: string; prompt: string; maxScore: number; models: LabModel[] };
export const LAB_TASKS: LabTask[] = [
  {
    "key": "web_tetris",
    "title": "테트리스",
    "emoji": "🧱",
    "prompt": "Create a single self-contained file named index.html that implements a fully playable Tetris game using only HTML, CSS, and vanilla JavaScript (NO external libraries, NO CDN). Requirements: a visible game board; the 7 standard tetromino pieces with distinct colors; arrow keys (left/right to move, down to soft-drop, up to rotate); automatic falling; line clearing; a visible score; game-over detection with a way to restart (e.g. press R). Everything must live in the one index.html file and run by simply opening it in a browser. Make the page focusable so keyboard input works immediately. Use the Write tool to create index.html now. Do not ask any questions.",
    "maxScore": 6,
    "models": [
      {
        "model": "Haiku",
        "name": "Claude Haiku 4.5",
        "vendor": "Anthropic",
        "score": 6,
        "buildS": 44,
        "bytes": 13884,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web_tetris/claude-haiku-4-5-20251001/index.html",
        "isClaude": true,
        "features": {
          "canvas_or_grid": true,
          "keyboard": true,
          "rotate": true,
          "line_clear": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "Opus",
        "name": "Claude Opus 4.8",
        "vendor": "Anthropic",
        "score": 6,
        "buildS": 58,
        "bytes": 11137,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web_tetris/claude-opus-4-8/index.html",
        "isClaude": true,
        "features": {
          "canvas_or_grid": true,
          "keyboard": true,
          "rotate": true,
          "line_clear": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "Sonnet",
        "name": "Claude Sonnet 4.6",
        "vendor": "Anthropic",
        "score": 6,
        "buildS": 133,
        "bytes": 11723,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web_tetris/claude-sonnet-4-6/index.html",
        "isClaude": true,
        "features": {
          "canvas_or_grid": true,
          "keyboard": true,
          "rotate": true,
          "line_clear": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "llama3.1:8b",
        "name": "Llama 3.1 8B",
        "vendor": "Meta",
        "score": 6,
        "buildS": 392,
        "bytes": 5640,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web_tetris/llama3.1_8b/index.html",
        "isClaude": false,
        "features": {
          "canvas_or_grid": true,
          "keyboard": true,
          "rotate": true,
          "line_clear": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "qwen3:8b",
        "name": "Qwen3 8B",
        "vendor": "Alibaba",
        "score": 6,
        "buildS": 483,
        "bytes": 3995,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web_tetris/qwen3_8b/index.html",
        "isClaude": false,
        "features": {
          "canvas_or_grid": true,
          "keyboard": true,
          "rotate": true,
          "line_clear": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "gemma4:e2b",
        "name": "Gemma 4 E2B",
        "vendor": "Google",
        "score": 6,
        "buildS": 483,
        "bytes": 14589,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web_tetris/gemma4_e2b/index.html",
        "isClaude": false,
        "features": {
          "canvas_or_grid": true,
          "keyboard": true,
          "rotate": true,
          "line_clear": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "mistral-small3.2",
        "name": "Mistral Small 3.2",
        "vendor": "Mistral",
        "score": 0,
        "buildS": 483,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      }
    ]
  },
  {
    "key": "web2048",
    "title": "2048",
    "emoji": "🔢",
    "prompt": "Create a single self-contained file named index.html that implements the game 2048 using only HTML, CSS, and vanilla JavaScript (NO external libraries, NO CDN). Hard requirements: a 4x4 grid; arrow keys slide all tiles and merge equal neighbors, where each tile may merge AT MOST ONCE per move (so a row [2,2,2,2] becomes [4,4], NOT [8] and NOT [4,2,2]); after every move that changes the board, spawn a new tile (2 with 90% or 4 with 10%) in a random empty cell; SMOOTH CSS animations for tile sliding and merging; a current score and a persisted best score (localStorage); win detection when a 2048 tile appears (allow the player to keep going); game-over detection when no moves are possible; an UNDO feature (button and the 'u' key) that reverts exactly the last move including the score; and a restart/new-game button. Everything must live in the one index.html and run by opening it in a browser. Make the page focusable so arrow keys work immediately. Use the Write tool to create index.html now. Do not ask any questions.",
    "maxScore": 9,
    "models": [
      {
        "model": "Opus",
        "name": "Claude Opus 4.8",
        "vendor": "Anthropic",
        "score": 9,
        "buildS": 88,
        "bytes": 18347,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web2048/claude-opus-4-8/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "Haiku",
        "name": "Claude Haiku 4.5",
        "vendor": "Anthropic",
        "score": 9,
        "buildS": 105,
        "bytes": 19854,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web2048/claude-haiku-4-5-20251001/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "gemma4:e2b",
        "name": "Gemma 4 E2B",
        "vendor": "Google",
        "score": 9,
        "buildS": 425,
        "bytes": 24529,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web2048/gemma4_e2b/index.html",
        "isClaude": false,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "Sonnet",
        "name": "Claude Sonnet 4.6",
        "vendor": "Anthropic",
        "score": 9,
        "buildS": 493,
        "bytes": 17019,
        "playable": true,
        "hasFile": true,
        "url": "/lab/web2048/claude-sonnet-4-6/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "qwen3:8b",
        "name": "Qwen3 8B",
        "vendor": "Alibaba",
        "score": 8,
        "buildS": 483,
        "bytes": 9143,
        "playable": false,
        "hasFile": true,
        "url": "/lab/web2048/qwen3_8b/index.html",
        "isClaude": false,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "llama3.1:8b",
        "name": "Llama 3.1 8B",
        "vendor": "Meta",
        "score": 0,
        "buildS": 272,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      },
      {
        "model": "mistral-small3.2",
        "name": "Mistral Small 3.2",
        "vendor": "Mistral",
        "score": 0,
        "buildS": 483,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      }
    ]
  },
  {
    "key": "fighter",
    "title": "스트리트 파이터",
    "emoji": "🥊",
    "prompt": "Create a single self-contained file named index.html that implements a 2D Street Fighter-style fighting game using only HTML, CSS, and vanilla JavaScript with a <canvas> (NO external libraries, NO CDN, NO image files - draw all fighters and effects with canvas shapes).\n\nRequirements:\n- A character-select screen with 8 PLAYABLE characters, each visually distinct and with different stats (health, walk speed, attack reach) and at least one unique special move: Ryu (hadouken fireball), Ken, Chun-Li, Guile, Blanka, Zangief, Dhalsim (long-reach limbs), and E. Honda.\n- A difficulty-select screen with three CPU difficulty levels: Easy, Medium, Hard - affecting the opponent AI's reaction time, aggression, and how often it blocks or uses specials.\n- One human player versus one CPU-controlled opponent. The CPU must move, approach, attack, block, and use specials on its own according to the chosen difficulty.\n- Controls: left/right to walk, up to jump, down to crouch, plus keys for punch, kick, block, and special move. Show the control mapping on screen.\n- Two health bars, hit detection with damage, hit/block reactions, knockdown/KO, best-of-3 rounds, and a win/lose screen with a rematch option.\n- Smooth game loop via requestAnimationFrame.\n\nEverything must live in the one index.html and run by simply opening it in a browser. Make the page focusable so keys work immediately. Use the Write tool to create index.html now. Do not ask any questions.",
    "maxScore": 14,
    "models": [
      {
        "model": "Haiku",
        "name": "Claude Haiku 4.5",
        "vendor": "Anthropic",
        "score": 14,
        "buildS": 180,
        "bytes": 37148,
        "playable": true,
        "hasFile": true,
        "url": "/lab/fighter/claude-haiku-4-5-20251001/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "self_contained": true
        }
      },
      {
        "model": "Opus",
        "name": "Claude Opus 4.8",
        "vendor": "Anthropic",
        "score": 14,
        "buildS": 223,
        "bytes": 37580,
        "playable": true,
        "hasFile": true,
        "url": "/lab/fighter/claude-opus-4-8/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "self_contained": true
        }
      },
      {
        "model": "gemma4:e2b",
        "name": "Gemma 4 E2B",
        "vendor": "Google",
        "score": 14,
        "buildS": 591,
        "bytes": 12642,
        "playable": true,
        "hasFile": true,
        "url": "/lab/fighter/gemma4_e2b/index.html",
        "isClaude": false,
        "features": {
          "keyboard": true,
          "self_contained": true
        }
      },
      {
        "model": "llama3.1:8b",
        "name": "Llama 3.1 8B",
        "vendor": "Meta",
        "score": 0,
        "buildS": 251,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      },
      {
        "model": "Sonnet",
        "name": "Claude Sonnet 4.6",
        "vendor": "Anthropic",
        "score": 0,
        "buildS": 604,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": true,
        "features": {}
      },
      {
        "model": "qwen3:8b",
        "name": "Qwen3 8B",
        "vendor": "Alibaba",
        "score": 0,
        "buildS": 903,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      },
      {
        "model": "mistral-small3.2",
        "name": "Mistral Small 3.2",
        "vendor": "Mistral",
        "score": 0,
        "buildS": 903,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      }
    ]
  },
  {
    "key": "crossy",
    "title": "크로시 로드",
    "emoji": "🐸",
    "prompt": "Create a single self-contained file named index.html that implements a \"Crossy Road\" / Frogger-style endless hopper game using only HTML, CSS, and vanilla JavaScript (NO external libraries, NO CDN, NO images - draw with CSS or a <canvas>).\n\nGameplay:\n- The player is a character on a top-down grid of horizontal lanes.\n- Arrow keys and WASD hop the player exactly one cell: Up = forward (toward new lanes), Down = back, Left/Right = sideways. The player cannot leave the left/right edges.\n- Lanes are generated endlessly as the player advances. Lane types: (a) safe grass; (b) road lanes with cars/trucks moving horizontally at varying speeds/directions - touching a vehicle is death; (c) river lanes with logs floating horizontally - the player must stand on a log to cross and is carried along with it; being in water without a log, or carried off the screen edge, is death.\n- The camera scrolls forward as the player advances so new lanes appear ahead; if the player falls too far behind the bottom edge, it is game over.\n- Score = furthest number of lanes advanced; show current score and a best score (localStorage).\n- Smooth movement for vehicles/logs via requestAnimationFrame. Game-over screen with restart (press R or a button).\n\nEverything must live in the one index.html and run by simply opening it in a browser. Make the page focusable so keys work immediately. Use the Write tool to create index.html now. Do not ask any questions.",
    "maxScore": 10,
    "models": [
      {
        "model": "Opus",
        "name": "Claude Opus 4.8",
        "vendor": "Anthropic",
        "score": 10,
        "buildS": 102,
        "bytes": 19674,
        "playable": true,
        "hasFile": true,
        "url": "/lab/crossy/claude-opus-4-8/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "Haiku",
        "name": "Claude Haiku 4.5",
        "vendor": "Anthropic",
        "score": 10,
        "buildS": 132,
        "bytes": 17296,
        "playable": true,
        "hasFile": true,
        "url": "/lab/crossy/claude-haiku-4-5-20251001/index.html",
        "isClaude": true,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "gemma4:e2b",
        "name": "Gemma 4 E2B",
        "vendor": "Google",
        "score": 10,
        "buildS": 209,
        "bytes": 13831,
        "playable": true,
        "hasFile": true,
        "url": "/lab/crossy/gemma4_e2b/index.html",
        "isClaude": false,
        "features": {
          "keyboard": true,
          "score": true,
          "self_contained": true
        }
      },
      {
        "model": "llama3.1:8b",
        "name": "Llama 3.1 8B",
        "vendor": "Meta",
        "score": 0,
        "buildS": 255,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      },
      {
        "model": "qwen3:8b",
        "name": "Qwen3 8B",
        "vendor": "Alibaba",
        "score": 0,
        "buildS": 270,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      },
      {
        "model": "Sonnet",
        "name": "Claude Sonnet 4.6",
        "vendor": "Anthropic",
        "score": 0,
        "buildS": 600,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": true,
        "features": {}
      },
      {
        "model": "mistral-small3.2",
        "name": "Mistral Small 3.2",
        "vendor": "Mistral",
        "score": 0,
        "buildS": 603,
        "bytes": 0,
        "playable": false,
        "hasFile": false,
        "url": null,
        "isClaude": false,
        "features": {}
      }
    ]
  }
];
