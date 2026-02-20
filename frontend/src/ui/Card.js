function Card({ children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      {children}
    </div>
  );
}

export default Card;
