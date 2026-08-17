import type { HistoriaWorker } from '@/lib/historiaTeam';

export default function HistoriaWorkerStats({
  worker,
  variant,
}: {
  worker: HistoriaWorker;
  variant: 'desktop' | 'mobile';
}) {
  const root =
    variant === 'mobile' ? 'hm-stats historia-stats' : 'historia-stats';

  return (
    <div className={root} data-historia-accent={worker.accent}>
      <p className="historia-stats__role">{worker.role}</p>
      <dl className="historia-stats__kpis">
        {worker.kpis.map((kpi) => (
          <div key={kpi.label} className="historia-stats__kpi">
            <dt className="historia-stats__kpi-label">{kpi.label}</dt>
            <dd className="historia-stats__kpi-value">{kpi.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="historia-stats__skills">
        {worker.skills.map((skill) => (
          <li key={skill.label} className="historia-stats__skill">
            <div className="historia-stats__skill-row">
              <span className="historia-stats__skill-label">{skill.label}</span>
              <span className="historia-stats__skill-num">{skill.value}</span>
            </div>
            <div
              className="historia-stats__track"
              role="meter"
              aria-label={skill.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skill.value}
            >
              <span
                className="historia-stats__fill"
                style={{ width: `${skill.value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
