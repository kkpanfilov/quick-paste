import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { vi } from "vitest";

import { apiClient } from "@/api/apiClient.ts";
import { NewPasteForm } from "@/components/screens/new/components/new-paste-form/NewPasteForm.tsx";
import { renderWithProviders } from "@/test/renderWithProviders.tsx";

vi.mock("@/api/apiClient.ts");

describe("NewPasteForm", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Render", () => {
    it("should render", () => {
      renderWithProviders(<NewPasteForm />);

      expect(
        screen.getByRole("button", { name: "Create paste" }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("should not submit form if title and content is empty", async () => {
      const user = userEvent.setup();

      renderWithProviders(<NewPasteForm />);

      await user.click(
        screen.getByRole("button", {
          name: "Create paste",
        }),
      );

      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Content is required")).toBeInTheDocument();
    });

    it("should not submit form if title is empty", async () => {
      const user = userEvent.setup();

      renderWithProviders(<NewPasteForm />);

      await user.type(
        screen.getByRole("textbox", { name: "Content" }),
        "Content of paste",
      );

      await user.click(
        screen.getByRole("button", {
          name: "Create paste",
        }),
      );

      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    it("should not submit form if content is empty", async () => {
      const user = userEvent.setup();

      renderWithProviders(<NewPasteForm />);

      await user.type(
        screen.getByRole("textbox", { name: "Title" }),
        "Title of paste",
      );

      await user.click(
        screen.getByRole("button", {
          name: "Create paste",
        }),
      );

      expect(screen.getByText("Content is required")).toBeInTheDocument();
    });

    it("should hide public exposure if password is not empty", async () => {
      const user = userEvent.setup();

      renderWithProviders(<NewPasteForm />);

      await user.type(
        screen.getByRole("textbox", { name: "Password" }),
        "Password",
      );

      expect(
        screen.queryByRole("radio", { name: "Public" }),
      ).not.toBeInTheDocument();
    });

    it("sends valid paste to the API", async () => {
      const user = userEvent.setup();

      renderWithProviders(<NewPasteForm />);

      vi.mocked(apiClient).mockResolvedValue({ id: "paste-id" });

      await user.type(
        screen.getByRole("textbox", { name: "Title" }),
        "Title of paste",
      );
      await user.type(
        screen.getByRole("textbox", { name: "Content" }),
        "Content of paste",
      );

      await user.click(
        screen.getByRole("button", {
          name: "Create paste",
        }),
      );

      await waitFor(() => {
        expect(apiClient).toHaveBeenCalledWith("POST", "pastes", {
          title: "Title of paste",
          content: "Content of paste",
          description: null,
          tags: [],
          language: "plain",
          expiration: "never",
          category: "none",
          exposure: "public",
          password: "",
          isBurn: false,
        });
      });
    });
  });
});
