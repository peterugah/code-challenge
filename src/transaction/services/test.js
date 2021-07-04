const array = [
  {
    id: 1,
    name: 'bla',
    children: [
      {
        id: 23,
        name: 'bla',
        children: [
          { id: 88, name: 'bla' },
          { id: 99, name: 'bla' },
        ],
      },
      { id: 43, name: 'bla' },
      {
        id: 45,
        name: 'bla',
        children: [
          { id: 43, name: 'bla' },
          { id: 46, name: 'bla' },
        ],
      },
    ],
  },
  {
    id: 12,
    name: 'bla',
    children: [
      {
        id: 232,
        name: 'bla',
        children: [
          { id: 848, name: 'bla' },
          { id: 959, name: 'bla' },
        ],
      },
      { id: 433, name: 'bla' },
      {
        id: 445,
        name: 'bla',
        children: [
          { id: 443, name: 'bla' },
          {
            id: 456,
            name: 'bla',
            children: [
              { id: 97, name: 'bla' },
              { id: 56, name: 'bla' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 15,
    name: 'bla',
    children: [
      {
        id: 263,
        name: 'bla',
        children: [
          { id: 868, name: 'bla' },
          { id: 979, name: 'bla' },
        ],
      },
      { id: 483, name: 'bla' },
      {
        id: 445,
        name: 'bla',
        children: [
          { id: 423, name: 'bla' },
          { id: 436, name: 'bla' },
        ],
      },
    ],
  },
];

const findItemNested = (arr, itemId, nestingKey) =>
  arr.reduce((a, item) => {
    if (a) return a;
    if (item.id === itemId) return item;
    if (item[nestingKey])
      return findItemNested(item[nestingKey], itemId, nestingKey);
  }, null);
const res = findItemNested(array, 959, 'children');
console.log(res);
