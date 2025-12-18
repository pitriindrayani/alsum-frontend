// utils/sortDimensiByTingkatan.js
export const sortDimensiByTingkatan = (data) => {
  if (!Array.isArray(data)) return data;

  return data
    .map(dimensi => ({
      ...dimensi,
      data_element: dimensi.data_element?.map(el => ({
        ...el,
        rekapan: el.rekapan?.sort((a, b) =>
          a.name_tingkatan?.localeCompare(b.name_tingkatan, 'id', { numeric: true })
        )
      })) || []
    }))
    .sort((a, b) => {
      const firstA = a.data_element?.[0]?.rekapan?.[0]?.name_tingkatan || "";
      const firstB = b.data_element?.[0]?.rekapan?.[0]?.name_tingkatan || "";

      return firstA.localeCompare(firstB, 'id', { numeric: true });
    });
};
