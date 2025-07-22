export const doctorSelection = {
  user: {
    select: {
      name: true,
    },
  },
  rates_pat: {
    select: {
      rate: true,
      patient: {
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
  institutes: {
    select: {
      institute: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  specialization: true,
};
