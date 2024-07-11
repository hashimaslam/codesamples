import Image from 'next/image';
import type { ComponentProps, FC } from 'react';

type LogoProps = Omit<ComponentProps<typeof Image>, 'alt' | 'src'>;
const Logotype: FC<LogoProps> = (props) => (
  <Image
    priority
    src='/logotypeDark.png'
    alt='logo'
    height={30}
    width={130}
    unoptimized
    quality={100}
    {...props}
  />
);

export default Logotype;
