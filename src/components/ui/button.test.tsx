import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { renderWithIntl } from "@/test/render";

describe("Button", () => {
  it("fires onClick", async () => {
    const onClick = vi.fn();
    renderWithIntl(<Button onClick={onClick}>Launch</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Launch" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is keyboard-activatable", async () => {
    const onClick = vi.fn();
    renderWithIntl(<Button onClick={onClick}>Launch</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    renderWithIntl(
      <Button onClick={onClick} disabled>
        Launch
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button).catch(() => {});
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders every variant/size combination", () => {
    renderWithIntl(
      <>
        <Button variant="solid">a</Button>
        <Button variant="outline">b</Button>
        <Button variant="ghost">c</Button>
        <Button size="sm">d</Button>
        <Button size="lg">e</Button>
        <Button size="icon" aria-label="icon-only" />
      </>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });
});
