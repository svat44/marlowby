/** Scroll ranges for the draft journey. Scene and copy both read these. */
export const T = {
  droneEnd: 0.17, // fly-through, then pull out
  explainEnd: 0.34,
  planeEnd: 0.48,
  drop: 0.405,
  driveEnd: 0.6,
  flingEnd: 0.68,
  insideAt: 0.76,
  chooseAt: 0.83,
} as const

/** Placeholder contents: generic on purpose until the team confirms real businesses. */
export const CITIES = [
  {
    label: { name: 'New York', coords: '40.7128° N · 74.0060° W' },
    accent: '#c94f37',
    tissue: '#e8765c',
    items: ['A neighborhood bakery treat', 'Locally roasted coffee', 'A spice shop blend', 'A walking route map'],
  },
  {
    label: { name: 'Los Angeles', coords: '34.0522° N · 118.2437° W' },
    accent: '#c7771c',
    tissue: '#eaa94a',
    items: ['A small-batch snack', 'A local hot sauce', 'Art from an independent maker', 'A neighborhood guide'],
  },
  {
    label: { name: 'Miami', coords: '25.7617° N · 80.1918° W' },
    accent: '#12897f',
    tissue: '#35b8ab',
    items: ['A bakery sweet', 'A local coffee blend', 'A print from a Miami artist', 'A neighborhood guide'],
  },
]
