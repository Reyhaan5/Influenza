import React from "react";
import Container from "./Container";

export default function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`py-24 lg:py-32 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}