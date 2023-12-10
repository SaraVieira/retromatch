export const sortFunc = (
  results: any[],
  sortType: string,
  sortByField: string
) => {
  const getField = (a: any) =>
    !sortByField.includes(".")
      ? a[sortByField]
      : a.info?.[sortByField.split(".")[1]];

  if (sortType === "ascending") {
    results.sort((a, b) => (getField(a) < getField(b) ? -1 : 1));
  } else if (sortType === "descending") {
    results.sort((a, b) => (getField(b) > getField(a) ? 1 : -1));
  }
  return results;
};
