import React from "react";
import { Pagination, PaginationItemType } from "@heroui/react";

// ChevronIcon and cn utility
export const ChevronIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M15.5 19l-7-7 7-7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

function cn(...args) {
  return args.filter(Boolean).join(" ");
}

const CustomPagination = ({
  total,
  page,
  onChange,
  className = "",
  ...props
}) => {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage: setPageFn,
    className: itemClass
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(itemClass, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }
    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(itemClass, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onPrevious}
        >
          <ChevronIcon />
        </button>
      );
    }
    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={(itemClass, "cursor-default")}>
          . . .
        </button>
      );
    }
    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          itemClass, " min-w-6 mx-4 ",
          isActive && "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
        )}
        onClick={() => setPageFn(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <Pagination
      disableCursorAnimation
      showControls
      className={cn("gap-2", className)}
      page={page}
      onChange={onChange}
      radius="full"
      renderItem={renderItem}
      total={total}
      variant="light"
      {...props}
    />
  );
};

export default CustomPagination;