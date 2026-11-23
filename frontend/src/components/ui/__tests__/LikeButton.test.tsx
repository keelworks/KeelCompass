import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LikeButton from "../LikeButton";

describe("LikeButton", () => {
  it("shows the singular label for a count of 1", () => {
    render(<LikeButton liked={false} count={1} onToggle={() => {}} />);
    expect(screen.getByText("1 Like")).toBeInTheDocument();
  });

  it("shows the plural label for any other count", () => {
    render(<LikeButton liked={false} count={0} onToggle={() => {}} />);
    expect(screen.getByText("0 Likes")).toBeInTheDocument();
  });

  it("falls back to 0 for a NaN/invalid count instead of rendering NaN", () => {
    render(<LikeButton liked={false} count={NaN} onToggle={() => {}} />);
    expect(screen.getByText("0 Likes")).toBeInTheDocument();
  });

  it("calls onToggle with the click event when clicked", () => {
    const onToggle = vi.fn();
    render(<LikeButton liked={false} count={2} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("applies the liked styling when liked is true", () => {
    render(<LikeButton liked count={3} onToggle={() => {}} />);
    expect(screen.getByRole("button").className).toContain("text-brand-700");
  });
});
