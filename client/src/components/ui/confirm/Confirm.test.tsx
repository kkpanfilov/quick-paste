import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Confirm } from "@/components/ui/confirm/Confirm.tsx";

describe("Confirm", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render the component", () => {
    const title = "Test title";
    const description = "Test description";
    const action = "Test action";

    render(
      <Confirm
        title={title}
        description={description}
        action={action}
        onCancel={() => {}}
        onConfirm={() => {}}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: action })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should render the component with default props", () => {
    render(<Confirm onCancel={() => {}} onConfirm={() => {}} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Are you sure?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to perform this action?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should call the onConfirm function", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<Confirm onCancel={() => {}} onConfirm={onConfirm} />);

    await user.click(
      screen.getByRole("button", {
        name: "Confirm",
      }),
    );

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("should call the onCancel function", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<Confirm onConfirm={() => {}} onCancel={onCancel} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
