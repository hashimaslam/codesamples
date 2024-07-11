import type { FC } from 'react';
import { useRef } from 'react';

export interface TVideoPlayer {
  id: string;
  videoSrc?: string;
}
const VideoPlayer: FC<TVideoPlayer> = ({ id, videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className='group relative overflow-hidden rounded-md'>
      <video
        id={`${id}-video`}
        width='320'
        height='240'
        ref={videoRef}
        controls
      >
        <source src={videoSrc} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
