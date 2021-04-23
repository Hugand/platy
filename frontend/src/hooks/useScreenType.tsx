import { useMediaQuery } from 'react-responsive';

export const useScreenType = () => {
  const isMobile = useMediaQuery({ maxWidth: 874 });

  if (isMobile) return 'mobile';
  else return 'desktop';
};
