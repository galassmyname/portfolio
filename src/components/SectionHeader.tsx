import type { ReactNode } from 'react';

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  titleId: string;
  lede?: ReactNode;
};

export default function SectionHeader({ index, label, title, titleId, lede }: Props) {
  return (
    <header className="section-head" data-reveal>
      <p className="section-index">
        {index} <span>/ {label}</span>
      </p>
      <div>
        <h2 className="section-title" id={titleId}>
          {title}
        </h2>
        {lede && <p className="section-lede">{lede}</p>}
      </div>
    </header>
  );
}
