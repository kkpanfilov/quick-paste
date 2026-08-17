import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Pagination } from "@/components/ui/pagination/Pagination.tsx";

describe("Pagination", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Render", () => {
    it("should not render the component if there totalPages <= 1", () => {
      const props = {
        currentPage: 1,
        totalPages: 1,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("should not render pagination dots if totalPages <= pageLimit", () => {
      const props = {
        currentPage: 1,
        totalPages: 4,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("should render pagination dots if totalPages > pageLimit", () => {
      const props = {
        currentPage: 1,
        totalPages: 6,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      expect(screen.getByText("...")).toBeInTheDocument();
    });

    it("should render the component if there is more than one page", () => {
      const props = {
        currentPage: 1,
        totalPages: 2,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should disable the previous button if on the first page", () => {
      const props = {
        currentPage: 1,
        totalPages: 2,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeDisabled();
    });

    it("should disable the next button if on the last page", () => {
      const props = {
        currentPage: 2,
        totalPages: 2,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });
  });

  describe("Actions", () => {
    it("should switch to the next page", async () => {
      const user = userEvent.setup();

      const props = {
        currentPage: 1,
        totalPages: 3,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      await user.click(screen.getByRole("button", { name: "Next page" }));

      expect(
        screen.getByRole("button", { name: "Current page" }),
      ).toHaveTextContent("2");
    });

    it("should switch to the previous page", async () => {
      const user = userEvent.setup();

      const props = {
        currentPage: 2,
        totalPages: 3,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      await user.click(screen.getByRole("button", { name: "Previous page" }));

      expect(
        screen.getByRole("button", { name: "Current page" }),
      ).toHaveTextContent("1");
    });

    it("should switch to the first page", async () => {
      const user = userEvent.setup();

      const props = {
        currentPage: 7,
        totalPages: 8,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      await user.click(screen.getByRole("button", { name: "First page" }));

      expect(
        screen.getByRole("button", { name: "Current page" }),
      ).toHaveTextContent("1");
    });

    it("should switch to the last page", async () => {
      const user = userEvent.setup();

      const props = {
        currentPage: 2,
        totalPages: 8,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      await user.click(screen.getByRole("button", { name: "Last page" }));

      expect(
        screen.getByRole("button", { name: "Current page" }),
      ).toHaveTextContent("8");
    });

    it("should switch to nearby page before current page", async () => {
      const user = userEvent.setup();

      const props = {
        currentPage: 5,
        totalPages: 8,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      await user.click(screen.getByRole("button", { name: "Go to page 4" }));

      expect(
        screen.getByRole("button", { name: "Current page" }),
      ).toHaveTextContent("4");
    });

    it("should switch to nearby page after current page", async () => {
      const user = userEvent.setup();

      const props = {
        currentPage: 5,
        totalPages: 8,
        pageLimit: 4,
        onPageChange: () => {},
      };

      render(<Pagination {...props} />);

      await user.click(screen.getByRole("button", { name: "Go to page 6" }));

      expect(
        screen.getByRole("button", { name: "Current page" }),
      ).toHaveTextContent("6");
    });
  });
});
