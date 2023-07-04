import { css } from '@styles/css';
import Loading from '@/app/components/Loading';

const AuthedLoading = () => (
  <div className={css({})}>
    <Loading />
    <p>Loading...</p>
  </div>
);

export default AuthedLoading;
