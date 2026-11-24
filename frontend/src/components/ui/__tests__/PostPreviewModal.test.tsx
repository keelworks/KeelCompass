import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostPreviewModal from "../PostPreviewModal";

vi.mock("../../../utils/useKnownTags", () => ({
  useKnownTags: () => [],
}));

describe("PostPreviewModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <PostPreviewModal isOpen={false} onClose={() => {}} title="Hello" html="<p>world</p>" initialTheme="light" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the title and content when open", () => {
    render(<PostPreviewModal isOpen onClose={() => {}} title="My question" html="<p>Some details</p>" initialTheme="light" />);
    expect(screen.getByText("My question")).toBeInTheDocument();
    expect(screen.getByText("Some details")).toBeInTheDocument();
  });

  it("toggling to dark scopes a 'dark' class to the preview panel only", () => {
    render(<PostPreviewModal isOpen onClose={() => {}} title="My question" html="<p>Some details</p>" initialTheme="light" />);
    const darkButton = screen.getByRole("button", { name: /dark/i });
    fireEvent.click(darkButton);
    expect(document.querySelector(".dark")).not.toBeNull();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<PostPreviewModal isOpen onClose={onClose} title="My question" html="<p>Some details</p>" initialTheme="light" />);
    fireEvent.click(screen.getByRole("button", { name: /close preview/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
