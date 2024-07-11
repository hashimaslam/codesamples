import type { FC, HTMLAttributes } from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@utils/cn';

type TurncatedTexttProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
};

const TurncatedText: FC<TurncatedTexttProps> = ({
  className,
  text,
  ...props
}) => {
  const [shouldTurncate, setShouldTurncate] = useState(false);
  const [lengthOfText, setLengthOfText] = useState(0);
  const [turncatedText, setTurncatedText] = useState(text);
  useEffect(() => {
    if (text) {
      setLengthOfText(text?.toString()?.length);
      if (text?.toString()?.length > 100) {
        setShouldTurncate(true);
      } else {
        setShouldTurncate(false);
      }
    }
  }, [text]);
  const handleTurncate = (state: boolean) => {
    setShouldTurncate(state);
  };
  useEffect(() => {
    if (shouldTurncate) {
      setTurncatedText(text?.slice(0, 100));
    }
  }, [shouldTurncate, text]);
  return (
    <>
      {shouldTurncate && (
        <div className='flex'>
          <div
            className={cn(
              'overflow-hidden break-words text-center text-slate-800',
              className
            )}
            {...props}
          >
            {turncatedText}...{' '}
            {lengthOfText > 100 && (
              <span
                className='cursor-pointer text-sm text-sky-500'
                onClick={() => handleTurncate(false)}
              >
                Read more
              </span>
            )}
          </div>
        </div>
      )}
      {!shouldTurncate && (
        <div
          className={cn('break-words text-center text-slate-800', className)}
        >
          {text}{' '}
          {lengthOfText > 100 && (
            <span
              className='cursor-pointer text-sm text-sky-500'
              onClick={() => handleTurncate(true)}
            >
              Read less
            </span>
          )}
        </div>
      )}
    </>
  );
};

TurncatedText.displayName = 'TurncatedText';

export default TurncatedText;
