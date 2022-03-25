import * as moment_ from 'moment';

const moment = moment_;

export interface Props {
  indeterminate?: boolean;
}

const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

const checkDropDownDirections = (rowId: string, page: []) => {
  if (page.length < 5) return true;

  const currentRowIndex = page.findIndex((row: any) => row.id === rowId);

  const halfPageSize = page.length / 2;

  const result = Math.floor(currentRowIndex / halfPageSize);

  return result % 2 === 0;
};

// For Table Filter
function getSelectionOptions(data: any, key: string) {
  const options = new Set();
  data?.map((item: any) => {
    if (!!item[key]) {
      if (Array.isArray(item[key])) {
        item[key].map((value: any) => {
          options.add(value);
        });
      } else {
        options.add(item[key]);
      }
    }
  });
  return Array.from(options).sort();
}

function singleSelectFilter(
  rows: any[],
  columnIds: string | number,
  filterValue: string
) {
  return filterValue?.length === 0
    ? rows
    : rows?.filter((row) => String(row.original[columnIds]) === filterValue);
}

function multiSelectFilter(
  rows: any[],
  columnIds: string | number,
  filterValue: string | string[]
) {
  return filterValue?.length === 0
    ? rows
    : rows?.filter((row) =>
        filterValue.includes(String(row.original[columnIds]))
      );
}

function dateSelectFilter(
  rows: any[],
  columnIds: string | number,
  filterValue: Date[]
) {
  return filterValue?.length === 0
    ? rows
    : rows?.filter((row) =>
        moment(row.original[columnIds]).isBetween(
          filterValue[0],
          filterValue[1]
        )
      );
}

function multipleSelectArrayFilter(
  rows: any[],
  columnIds: string | number,
  filterValue: string[]
) {
  return filterValue?.length === 0
    ? rows
    : rows?.filter((row) =>
        filterValue.some((r) => row.original[columnIds]?.includes(r))
      );
}

export {
  classNames,
  dateSelectFilter,
  checkDropDownDirections,
  getSelectionOptions,
  multiSelectFilter,
  singleSelectFilter,
  multipleSelectArrayFilter,
};
