import { performanceFacts, servicePoints, type PageId } from "../site";

export function ServiceList({ id }: { id: PageId }) {
  const items = servicePoints[id];

  return (
    <div className="about about--compact">
      <h3 className="about__sub">What we do</h3>
      <ol className="facts facts--on-dark">
        {items.map((item, i) => (
          <li key={item.name}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {item.name} — {item.detail}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PerformancePanel() {
  return (
    <div className="map-block">
      <div className="map-block__side">
        <ul className="facts facts--on-dark map-block__facts">
          {performanceFacts.map((item, i) => (
            <li key={item.place}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item.place} — {item.detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
