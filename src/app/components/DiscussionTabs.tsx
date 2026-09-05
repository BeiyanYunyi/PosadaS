import { css } from '@styles/css';
import AppLink from './AppLink';

const tabs = [
  { value: 'recent', label: '最近讨论', href: '/' },
  { value: 'hot', label: '最热讨论', href: '/hot/1' },
  { value: 'elite', label: '精华讨论', href: '/elite/1' },
] as const;

const DiscussionTabs = ({
  active,
}: {
  active: (typeof tabs)[number]['value'];
}) => (
  <nav aria-label="讨论分类" className={css({ width: '100%', mb: '1rem' })}>
    <ul
      className={css({
        display: 'inline-flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        border: '1px solid #83BF73',
        borderRadius: '6px',
        overflow: 'hidden',
      })}
    >
      {tabs.map(({ value, label, href }) => (
        <li key={value}>
          <AppLink
            href={href}
            activated={active === value}
            aria-current={active === value ? 'page' : undefined}
            className={css({
              display: 'block',
              px: '0.75rem',
              py: '0.375rem',
              whiteSpace: 'nowrap',
            })}
          >
            {label}
          </AppLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default DiscussionTabs;
