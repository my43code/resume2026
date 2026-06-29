export default function Education({ education }) {
  return (
    <section>
      <h2>Education</h2>
      {education.map((edu, index) => (
        <div key={index}>
          <h3>{edu.school}</h3>
          <p>{edu.qualification}</p>
        </div>
      ))}
    </section>
  );
}
