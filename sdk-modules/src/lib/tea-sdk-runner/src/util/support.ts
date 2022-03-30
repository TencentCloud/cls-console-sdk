import React from "react";
import ReactDOM from "react-dom";

export function initSupport() {
  if (!window.React16) {
    window.React16 = React;
    window.ReactDOM16 = ReactDOM;
  }
}
