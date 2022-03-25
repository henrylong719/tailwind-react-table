import * as React from 'react';

// Pagination
const Pagination = ({
  pageIndex,
  pageOptions,
  canPreviousPage,
  previousPage,
  canNextPage,
  nextPage,
}: {
  pageIndex: number;
  pageOptions: any;
  canPreviousPage: boolean;
  previousPage: Function;
  canNextPage: boolean;
  nextPage: Function;
}) => {
  return (
    <nav
      className="px-4 mt-6 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium"> {pageIndex + 1}</span>{' '}
          <span className="font-medium"> of {pageOptions.length}</span>{' '}
        </p>
      </div>

      <div className="flex-1 flex justify-between sm:justify-end">
        {canPreviousPage && (
          <button
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>
        )}

        {canNextPage && (
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
        )}
      </div>
    </nav>
  );
};
export default Pagination;
