export default function Experience({ experience }) {
  return (
    <section>
      <h2>Work Experience</h2>
      {experience.map((job, index) => (
        <div key={index}>
          <h3>{job.role}</h3>
          <p>{job.company}</p>
          <ul>
            {job.duties.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      ))}
    </section>
  );
}
``