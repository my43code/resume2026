export default function Header({ data }) {
  return (
    <div className="header">
      <img src="https://via.placeholder.com/100" alt="profile" />
      <div>
        <h1>{data.name}</h1>
        <p>{data.title}</p>
        <p>{data.contact.email}</p>
      </div>
    </div>
  );
}