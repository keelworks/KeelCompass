import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReactionButton from "../ReactionButton";
import { UserActionType } from "../../../utils/types";

describe("ReactionButton", () => {
  it("shows the singular label for a count of 1", () => {
    render(<ReactionButton myReaction={null} totalCount={1} onReact={() => {}} />);
    expect(screen.getByText("1 Reaction")).toBeInTheDocument();
  });

  it("shows the plural label for any other count", () => {
    render(<ReactionButton myReaction={null} totalCount={0} onReact={() => {}} />);
    expect(screen.getByText("0 Reactions")).toBeInTheDocument();
  });

  it("falls back to 0 for a NaN/invalid count instead of rendering NaN", () => {
    render(<ReactionButton myReaction={null} totalCount={NaN} onReact={() => {}} />);
    expect(screen.getByText("0 Reactions")).toBeInTheDocument();
  });

  it("clicking while neutral reacts with Like by default", () => {
    const onReact = vi.fn();
    render(<ReactionButton myReaction={null} totalCount={2} onReact={onReact} />);
    fireEvent.click(screen.getByRole("button", { name: /Reaction/ }));
    expect(onReact).toHaveBeenCalledWith(UserActionType.Like);
  });

  it("clicking while already reacted signals the same (active) reaction so the caller can remove it", () => {
    const onReact = vi.fn();
    render(
      <ReactionButton myReaction={UserActionType.Celebrate} totalCount={3} onReact={onReact} />
    );
    fireEvent.click(screen.getByRole("button", { name: /Reaction/ }));
    expect(onReact).toHaveBeenCalledWith(UserActionType.Celebrate);
  });

  it("applies the active styling and shows the reaction emoji when myReaction is set", () => {
    render(<ReactionButton myReaction={UserActionType.Love} totalCount={1} onReact={() => {}} />);
    expect(screen.getByRole("button", { name: /Reaction/ }).className).toContain("text-brand-700");
    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("reveals the reaction picker on hover and calls onReact with the picked type", async () => {
    const onReact = vi.fn();
    render(<ReactionButton myReaction={null} totalCount={0} onReact={onReact} />);
    const container = screen.getByRole("button", { name: /Reaction/ }).parentElement as HTMLElement;
    fireEvent.mouseEnter(container);
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("menuitem", { name: "Support" }));
    expect(onReact).toHaveBeenCalledWith(UserActionType.Support);
  });
});
