import EnergyCard from './EnergyCard';
import './CategorySection.css';

/**
 * CategorySection — renders a labelled group of EnergyCards.
 *
 * Props:
 *   category — string label for the section
 *   energies — array of Energy objects in this category
 *   showUser — passed down to EnergyCard (default true)
 */
const CategorySection = ({ category, energies, showUser = true }) => {
  if (!energies || energies.length === 0) return null;

  return (
    <section className="category-section">
      <div className="category-section__header">
        <h2 className="category-section__title">{category}</h2>
        <span className="category-section__count">{energies.length}</span>
      </div>

      <div className="category-section__grid">
        {energies.map((energy) => (
          <EnergyCard key={energy._id} energy={energy} showUser={showUser} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
