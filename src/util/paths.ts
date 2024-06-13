type Path = { index: number; row?: number; col?: number; child?: Path };

const paths = {
  DATORA: {
    id: { index: 0, row: 1, col: 0 },
    documentDate: { index: 0, row: 1, col: 1 },
    requester: [
      { index: 0, row: 1, col: 2 },
      { index: 2, row: 1, col: 0, child: { index: 1, row: 0, col: 1 } },
    ],
    description: { index: 1, row: 1, col: 0 },
    systems: { index: 14, row: 0, col: 0 },
    activityTimeInMInutes: { index: 22, row: 1, col: 3 },
    rollbackTimeInMinutes: { index: 24, row: 1, col: 3 },
    deployDateTime: [
      { index: 22, row: 1, col: 0 },
      { index: 23, row: 1, col: 0 },
    ],
    deployTestDateTime: { index: 23, row: 2, col: 0 },
    deployEndDateTime: [
      { index: 22, row: 1, col: 1 },
      { index: 23, row: 3, col: 0 },
    ],
    rollbackDateTime: [
      { index: 24, row: 1, col: 0 },
      { index: 25, row: 1, col: 0 },
    ],
    rollbackTesteDateTime: { index: 25, row: 2, col: 0 },
    rollbackEndDateTime: [
      { index: 24, row: 1, col: 1 },
      { index: 25, row: 3, col: 0 },
    ],
    executorEmail: { index: 21, row: 3, col: 2 },
    executorPosition: { index: 21, row: 3, col: 1 },
    executorName: [
      { index: 21, row: 3, col: 0 },
      { index: 23, row: 1, col: 2 },
      { index: 23, row: 2, col: 2 },
      { index: 23, row: 3, col: 2 },
      { index: 25, row: 1, col: 2 },
      { index: 25, row: 2, col: 2 },
      { index: 25, row: 3, col: 2 },
    ],
  },
  SURF: {
    impact: {
      index: 4,
      child: {
        index: 1,
        child: { index: 0, child: { index: 1, row: 1, col: 0 } },
      },
    },
    systems: {
      index: 4,
      child: {
        index: 1,
        child: { index: 0, child: { index: 3, row: 1, col: 0 } },
      },
    },
    title: {
      index: 4,
      child: {
        index: 1,
        child: { index: 0, child: { index: 5, row: 0, col: 1 } },
      },
    },
    startDateTime: {
      index: 8,
      child: {
        index: 1,
        child: { index: 0, child: { index: 1, row: 1, col: 1 } },
      },
    },
    endDateTime: {
      index: 8,
      child: {
        index: 1,
        child: { index: 0, child: { index: 1, row: 2, col: 1 } },
      },
    },
    gmudTime: {
      index: 8,
      child: {
        index: 1,
        child: { index: 0, child: { index: 1, row: 0, col: 1 } },
      },
    },
    description: {
      index: 7,
      child: {
        index: 7,
        child: { index: 0, child: { index: 0 } },
      },
    },
    executorName: [
      {
        index: 11,
        child: {
          index: 1,
          child: { index: 0 },
        },
      },
      {
        index: 11,
        child: {
          index: 2,
          child: { index: 0 },
        },
      },
      {
        index: 11,
        child: {
          index: 3,
          child: { index: 0 },
        },
      },
      {
        index: 13,
        child: {
          index: 2,
          child: { index: 0 },
        },
      },
      {
        index: 13,
        child: {
          index: 3,
          child: { index: 0 },
        },
      },
      {
        index: 13,
        child: {
          index: 4,
          child: { index: 0 },
        },
      },
      {
        index: 14,
        child: {
          index: 1,
          child: { index: 0, child: { index: 1, row: 1, col: 1 } },
        },
      },
    ],
    executorPhone: [
      {
        index: 14,
        child: {
          index: 1,
          child: { index: 0, child: { index: 1, row: 2, col: 1 } },
        },
      },
    ],
    executorEmail: [
      {
        index: 14,
        child: {
          index: 1,
          child: { index: 0, child: { index: 1, row: 3, col: 1 } },
        },
      },
    ],
    executorPosition: [
      {
        index: 14,
        child: {
          index: 1,
          child: { index: 0, child: { index: 1, row: 4, col: 1 } },
        },
      },
    ],
    deployTime: [
      {
        index: 11,
        child: {
          index: 1,
          child: { index: 1 },
        },
      },
    ],
    rollbackTime: [
      {
        index: 13,
        child: {
          index: 2,
          child: { index: 1 },
        },
      },
    ],
    testTime: [
      {
        index: 11,
        child: {
          index: 2,
          child: { index: 1 },
        },
      },
      {
        index: 13,
        child: {
          index: 3,
          child: { index: 1 },
        },
      },
    ],
  },
};

type PathKeys = keyof typeof paths;
