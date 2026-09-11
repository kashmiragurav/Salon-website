function PlaceholderPage({
  title,
  description = "Module coming soon",
}) {
  return (
    <div className="module-placeholder">
      <div className="module-placeholder__inner">
        <div className="module-placeholder__mark" aria-hidden="true">
          ✦
        </div>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default PlaceholderPage;
