import Dashboard from "../components/Dashboard.js";
import { render, screen, fireEvent } from "@testing-library/react";
import React, { useNavigate } from "react";
import "@testing-library/jest-dom";

// import { UserContext } from "../Helper/Context";

test("Checks for shop name", () => {
  render(<Dashboard />);
  const shopName = screen.getByText(/Home/i);
  expect(shopName).toBeInTheDocument();
});
