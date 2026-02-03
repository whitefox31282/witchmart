interface StarfieldProps {
  count?: number;
}

export default function Starfield({ count = 60 }: StarfieldProps) {
  const stars = Array.from({ length: count });

  return (
    <div className="starfield">
      {stars.map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}
