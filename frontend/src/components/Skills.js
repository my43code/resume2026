export default function Skills({ skills }) {
  return (
    <section>
      <h2>Skills</h2>

      <h4>Hard Skills</h4>
      <ul>
        {skills.hard.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <h4>Soft Skills</h4>
      <ul>
        {skills.soft.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </section>
  );
}