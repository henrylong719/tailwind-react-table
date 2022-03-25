import {
  usePagination,
  useRowSelect,
  useAsyncDebounce,
  useTable,
} from 'react-table';
import {
  DotsVerticalIcon,
  MenuIcon,
  CollectionIcon,
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { checkDropDownDirections, classNames } from '../utils';
import Pagination from '../shared/Pagination';
import { IndeterminateCheckbox } from '../shared/IndeterminateCheckbox';
import { Fragment, useEffect, useState } from 'react';
import * as React from 'react';

export interface GraphQlReactTableConfig {
  columns: any;
  hiddenColumns?: string[];
  hiddenColumnsOnMobile?: string[];
  data: any;
  actions?: {
    actionName: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }[];
  bulkActions?: {
    bulkActionName: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }[];
  isLoading: boolean;
  isMutationLoading: boolean;
  searchInputPlaceholder?: string;
  onSelectAction?: Function;
  onSelectRow?: Function;
  onSelectBulkAction?: Function;
  onSearch: (value: string) => void;
  onSortTable: (field: string, direction: string) => void;
}

export const GraphQLReactTable = ({
  graphqlReactTableConfig,
}: {
  graphqlReactTableConfig: GraphQlReactTableConfig;
}) => {
  const {
    columns,
    data,
    hiddenColumns = [],
    hiddenColumnsOnMobile = [],
    actions = [],
    bulkActions = [],
    isLoading,
    isMutationLoading,
    onSelectAction,
    onSelectRow,
    onSelectBulkAction,
    onSearch,
    onSortTable,
  } = graphqlReactTableConfig;

  // const [dataCount, setDataCount] = useState(0);
  // const [tablePageSize, setTablePageSize] = useState(12);
  const tablePageSize = 12;
  const sortingDirection = ['none', 'asc', 'desc'];
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentSortingDirection, setCurrentSortingDirection] = useState(
    sortingDirection[0]
  );
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: tablePageSize,
        hiddenColumns,
      },
      autoResetPage: true,
    },
    usePagination,
    useRowSelect,
    selectTableHooks,
    actionsHooks(actions, onSelectAction)
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
    selectedFlatRows,
    isAllRowsSelected,
    prepareRow,
    allColumns,
  } = tableInstance;

  useEffect(() => {
    window.innerWidth < 500 && hiddenColumns.push(...hiddenColumnsOnMobile);
  }, [hiddenColumnsOnMobile]);

  useEffect(() => {
    const selectedRows = selectedFlatRows.map((d) => d.original) as any;
    setSelectedRows(selectedRows);
  }, [selectedFlatRows]);

  const onSortData = (column: string) => {
    const direction =
      (sortingDirection.indexOf(currentSortingDirection) + 1) %
      sortingDirection.length;

    setCurrentSortingDirection(sortingDirection[direction]);
    onSortTable(column, sortingDirection[direction]);
  };

  return (
    <div className="mt-5">
      <div className=" flex justify-between">
        <div className="flex w-full">
          {/* Search Box */}

          <GlobalFilter onSearch={onSearch} />

          {isMutationLoading && (
            <div className="flex justify-between ml-3 mt-2">
              <div
                style={{
                  borderTopColor: 'transparent',
                  margin: '0 auto',
                  borderWidth: '3px',
                }}
                className="w-6 h-6  border-gray-400  border-solid rounded-full animate-spin"
              ></div>
            </div>
          )}
        </div>

        {/* DropDown Menu */}
        <TableDropDownMenu
          selectedRows={selectedRows}
          bulkActions={bulkActions}
          onSelectBulkAction={onSelectBulkAction}
          isAllRowsSelected={isAllRowsSelected}
          allColumns={allColumns}
        />
      </div>

      {/* Table */}
      <div className="flex flex-col mt-4 overflow-y-hidden overflow-x-auto">
        <div className="-my-2">
          <div className="py-2 align-middle inline-block min-w-full  ">
            <div
              className="shadow sm:rounded-lg"
              style={{ minHeight: `${data.length > 0 && '40rem'}` }}
            >
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200 overflow-x-auto"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          // {...column.getHeaderProps(
                          //   column.getSortByToggleProps()
                          // )}
                          key={column.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div
                            className="flex cursor-pointer"
                            onClick={() => onSortData(column.id)}
                          >
                            {column.Header !== 'Actions' &&
                              column.Header !== 'Nav Action' &&
                              column.render('Header')}

                            {column.id !== 'selection' &&
                              column.id !== 'actions' && (
                                <span>
                                  {currentSortingDirection === 'asc' ? (
                                    <ArrowNarrowUpIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 relative bottom-0.5" />
                                  ) : currentSortingDirection === 'desc' ? (
                                    <ArrowNarrowDownIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 relative bottom-0.5" />
                                  ) : (
                                    <></>
                                  )}
                                </span>
                              )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                {!isLoading && (
                  <tbody
                    {...getTableBodyProps()}
                    className="bg-white divide-y divide-gray-200 w-full "
                  >
                    {page.length > 0 ? (
                      page.map((row: any) => {
                        prepareRow(row);
                        return (
                          <tr
                            {...row.getRowProps()}
                            className="cursor-pointer hover:bg-gray-50"
                            onDoubleClick={(e: any) => {
                              e.target.tagName !== 'INPUT' &&
                                e.target.tagName !== 'SPAN' &&
                                onSelectRow &&
                                onSelectRow(row.original);
                            }}
                          >
                            {row.cells.map((cell: any) => {
                              return (
                                <td
                                  {...cell.getCellProps()}
                                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                >
                                  {cell.render('Cell')}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={allColumns.length}
                          className="text-center mt-4 h-28 text-gray-500"
                        >
                          There are no files here yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>

              {/*  Skeleton Loader */}
              {isLoading && (
                <SkeletonTheme
                  baseColor="#ededed"
                  highlightColor="#F9FAFB"
                  height={60}
                >
                  <Skeleton count={8} style={{ marginBottom: '1px' }} />
                </SkeletonTheme>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}

      <Pagination
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        nextPage={nextPage}
      />
    </div>
  );
};

/*******************  React table hooks  ********************/

function selectTableHooks(hooks: any) {
  hooks.visibleColumns.push((columns: any) => [
    {
      id: 'selection',
      Header: ({
        getToggleAllRowsSelectedProps,
      }: {
        getToggleAllRowsSelectedProps: any;
      }) => (
        <div>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      Cell: ({ row }: { row: any }) => (
        <div>
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </div>
      ),
    },
    ...columns,
  ]);
}

function actionsHooks(
  actions?: {
    actionName: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }[],
  onSelectAction?: Function
) {
  return (hooks: any) => {
    actions?.length &&
      hooks.visibleColumns.push((columns: any) => [
        ...columns,
        {
          id: 'actions',
          Header: 'Actions',
          Cell: (cell: any) => (
            <div>
              <a className="text-indigo-600 hover:text-indigo-900">
                {/* Edit Dropdown */}
                <Menu as="div" className="inline-block text-left relative">
                  <div>
                    <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      <span className="sr-only">Open options</span>
                      <DotsVerticalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      className={classNames(
                        checkDropDownDirections(cell.row.id, cell.page)
                          ? ''
                          : 'bottom-6',
                        'z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                      )}
                      // className="z-10 origin-top-right absolute right-12 lg:right-14 xl:right-24 3xl:right-64 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        {actions?.map(
                          (action: {
                            actionName: string;
                            icon: (
                              props: React.SVGProps<SVGSVGElement>
                            ) => JSX.Element;
                          }) => (
                            <Menu.Item key={action.actionName}>
                              {({ active }) => (
                                <span
                                  onClick={() =>
                                    onSelectAction &&
                                    onSelectAction(
                                      action.actionName,
                                      cell.row.original
                                    )
                                  }
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700',
                                    'block px-4 py-2 text-sm cursor-pointer'
                                  )}
                                >
                                  <span className="flex">
                                    <action.icon
                                      style={{ pointerEvents: 'none' }}
                                      className="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    {action.actionName}
                                  </span>
                                </span>
                              )}
                            </Menu.Item>
                          )
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </a>
            </div>
          ),
        },
      ]);
  };
}

/**************************** GraphQL Table Components *******************************/

// Global Search
const GlobalFilter = ({
  searchInputPlaceholder = 'Search Documents',
  onSearch,
}: {
  searchInputPlaceholder?: string;
  onSearch: (value: string) => void;
}) => {
  const [value, setValue] = useState('');
  const onChange = useAsyncDebounce((value) => {
    onSearch(value);
  }, 500);

  return (
    <div className="relative rounded-md shadow-sm w-9/12	lg:w-3/12 mr-2">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={searchInputPlaceholder}
      />
    </div>
  );
};

// Drop Down Menu
const TableDropDownMenu = ({
  selectedRows,
  bulkActions,
  onSelectBulkAction,
  isAllRowsSelected,
  allColumns,
}: {
  selectedRows: any;
  bulkActions: {
    bulkActionName: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }[];
  onSelectBulkAction?: Function;
  isAllRowsSelected?: boolean;
  csvFileName?: string;
  allColumns?: any;
}) => {
  return (
    <>
      <div className="flex justify-end">
        {/* Drop down to do multiple selection actions */}
        <Menu as="div" className="inline-block text-right mr-2 relative">
          <div>
            <Menu.Button
              disabled={!selectedRows.length}
              className={classNames(
                !selectedRows.length ? 'text-gray-400' : 'text-gray-700',
                'inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 pl-1 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
              )}
            >
              <CollectionIcon
                className="-mr-1 ml-2 h-5 w-5"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className=" origin-top-right z-20 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-2">
                <div>
                  {bulkActions?.map(
                    (bulkAction: {
                      bulkActionName: string;
                      icon: (
                        props: React.SVGProps<SVGSVGElement>
                      ) => JSX.Element;
                    }) => (
                      <Menu.Item key={bulkAction.bulkActionName}>
                        {({ active }) => (
                          <div
                            onClick={() =>
                              onSelectBulkAction &&
                              onSelectBulkAction(
                                selectedRows,
                                isAllRowsSelected,
                                bulkAction.bulkActionName
                              )
                            }
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm text-left cursor-pointer'
                            )}
                          >
                            <span className="flex">
                              <bulkAction.icon
                                className="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              {bulkAction.bulkActionName}
                            </span>
                          </div>
                        )}
                      </Menu.Item>
                    )
                  )}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        {/* Drop down to select columns */}
        <Menu as="div" className="inline-block text-right relative">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 pl-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              <MenuIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-2">
                <div>
                  <fieldset>
                    <div className="text-left">
                      {allColumns.map(
                        (column: any) =>
                          column.id !== 'selection' && (
                            <div
                              key={column.id}
                              className="relative flex items-start py-1"
                            >
                              <div className="flex items-center h-5">
                                <input
                                  id={column.id}
                                  type="checkbox"
                                  {...column.getToggleHiddenProps()}
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded mx-2"
                                />{' '}
                                <span className="text-gray-700 block py-2 text-md text-left">
                                  {column.render('Header')}
                                </span>
                              </div>
                              <label htmlFor={column.id}></label>
                            </div>
                          )
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
};
