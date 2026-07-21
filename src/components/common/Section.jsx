import Container from "./container";

function Section({
  children,
  className = "",
  id,
}) {
  return (
    <section
      id={id}
      className={`py-24 lg:py-32 ${className}`}
    >
      <Container>
        {children}
      </Container>
    </section>
  );
}

export default Section;