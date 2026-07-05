import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function DiningPage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    api("/meals").then((data) => setMeals(data.meals)).catch(console.error);
  }, []);

  return (
    <section className="panel">
      <header className="panel-head">
        <p className="eyebrow">E-catering</p>
        <h1 className="display">Regional dining</h1>
        <p className="muted">Meals inspired by corridors you travel — prototype menu.</p>
      </header>
      <div className="meal-grid">
        {meals.map((meal) => (
          <article key={meal.name} className="card">
            <span className="eyebrow">{meal.region}</span>
            <h3>{meal.name}</h3>
            <p className="muted">{meal.type}</p>
            <p>{meal.note}</p>
            <strong className="fare">₹{meal.price}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
