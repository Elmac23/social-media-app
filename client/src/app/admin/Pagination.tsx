import IconButton from "@/components/ui/IconButton";
import Typography from "@/components/ui/Typography";
import React from "react";
import { MdOutlineArrowBack, MdOutlineArrowForward } from "react-icons/md";

type PaginationProps = React.PropsWithChildren<{
  page: number;
  itemsPerPage: number;
  setNext: () => void;
  setPrev: () => void;
  setPage: (num: number) => void;
  total: number;
}>;

function Pagination({
  page,
  setNext,
  setPrev,
  itemsPerPage,
  setPage,
  total,
}: PaginationProps) {
  const isNextPage = page * itemsPerPage < total;
  const isPrevPage = page > 1;
  const totalPages = Math.ceil(total / itemsPerPage);

  const isShowLastPage = totalPages - page > 2;
  const isShowFirst = page > 3;
  const isShowBackDots = totalPages - page > 3;
  const isShowFrontDots = page > 4;

  const nextPages = new Array(2).fill(null).map((_, index) => {
    if (page + index + 1 <= totalPages)
      return (
        <IconButton
          key={page + index + 1}
          onClick={() => setPage(page + index + 1)}
          variant="outline"
        >
          {page + index + 1}
        </IconButton>
      );
  });

  const prevPages = new Array(2)
    .fill(null)
    .map((_, index) => {
      if (page - index - 1 > 0)
        return (
          <IconButton
            key={page - index - 1}
            onClick={() => setPage(page - index - 1)}
            variant="outline"
          >
            {page - index - 1}
          </IconButton>
        );
    })
    .toReversed();

  return (
    <div className="flex gap-2 mt-4 justify-center">
      {isPrevPage && (
        <IconButton onClick={() => setPrev()} variant="outline">
          <MdOutlineArrowBack />
        </IconButton>
      )}

      {isShowFirst && (
        <IconButton onClick={() => setPage(1)} variant="outline">
          1
        </IconButton>
      )}
      {isShowFrontDots && <Typography>...</Typography>}
      {prevPages}
      <IconButton disabled>{page}</IconButton>

      {nextPages}

      {isShowBackDots && <Typography>...</Typography>}

      {isShowLastPage && (
        <IconButton onClick={() => setPage(totalPages)} variant="outline">
          {totalPages}
        </IconButton>
      )}

      {isNextPage && (
        <IconButton onClick={() => setNext()} variant="outline">
          <MdOutlineArrowForward />
        </IconButton>
      )}
    </div>
  );
}

export default Pagination;
