import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TagEditor } from "@/components/ui/tag-editor/TagEditor.tsx";

describe("TagEditor", () => {
  const props = {
    id: "tags-form",
    name: "tags",
    placeholder: "Add tags",
  };

  afterEach(() => {
    cleanup();
  });

  describe("Render", () => {
    it("should render the component without tags", () => {
      render(<TagEditor tags={[]} onChange={() => {}} {...props} />);

      expect(
        screen.getByPlaceholderText(props.placeholder),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();

      const tags = screen.getByRole("list", { name: "Tags" });
      const tagItems = within(tags).queryAllByRole("listitem");

      expect(tagItems).toHaveLength(0);
    });
    it("should render the component without tags", () => {
      render(
        <TagEditor tags={["1", "2", "3"]} onChange={() => {}} {...props} />,
      );

      expect(
        screen.getByPlaceholderText(props.placeholder),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();

      const tags = screen.getByRole("list", { name: "Tags" });
      const tagItems = within(tags).queryAllByRole("listitem");

      expect(tagItems).toHaveLength(3);
    });
  });

  describe("Actions", () => {
    it("should add a tag", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<TagEditor tags={[]} onChange={onChange} {...props} />);

      await user.type(screen.getByPlaceholderText(props.placeholder), "tag 1");
      await user.click(screen.getByRole("button", { name: "Add" }));

      expect(onChange).toHaveBeenCalledWith(["tag 1"]);
    });
    it("should add a tag by pressing enter", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<TagEditor tags={[]} onChange={onChange} {...props} />);

      await user.type(screen.getByPlaceholderText(props.placeholder), "tag 1");
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith(["tag 1"]);
    });
    it("should remove add a tag", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<TagEditor tags={["tag 1"]} onChange={onChange} {...props} />);

      const tags = screen.getByRole("list", { name: "Tags" });
      const tagItems = within(tags).queryAllByRole("listitem");

      expect(tagItems).toHaveLength(1);

      const firstTag = tagItems[0];

      const removeButton = within(firstTag!).getByLabelText("Remove tag");
      await user.click(removeButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });
});
