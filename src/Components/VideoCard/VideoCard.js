import React, { useRef, useEffect, useState } from 'react';
import './VideoCard.css';
import VideoHeader from '../VideoHeader/VideoHeader';
import VideoFooter from '../VideoFooter/VideoFooter';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

const VideoCard = ({ url, likes, shares, channel, song, avatarSrc, isMuted, onMutePress }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef(null);

    const onVideoPress = () => {
        if (isVideoPlaying) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        } else {
            videoRef.current.play();
            setIsVideoPlaying(true);
        }
    };

    useEffect(() => {
        const currentVideoRef = videoRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentVideoRef.play();
                        setIsVideoPlaying(true);
                    } else {
                        currentVideoRef.pause();
                        setIsVideoPlaying(false);
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        if (currentVideoRef) {
            observer.observe(currentVideoRef);
        }

        return () => {
            if (currentVideoRef) {
                observer.unobserve(currentVideoRef);
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted; 
        }
    }, [isMuted]);

    return (
        <div className='videoCard'>
            <VideoHeader />
            <video
                ref={videoRef}
                onClick={onVideoPress}
                className='videoCard__player'
                src={url}
                loop
                muted={isMuted}
            />
            <button className='muteButton' onClick={onMutePress}>
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </button>
            <VideoFooter
                channel={channel}
                song={song}
                likes={likes}
                shares={shares}
                avatarSrc={avatarSrc}
            />
        </div>
    );
};

export default VideoCard;
