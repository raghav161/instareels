import React, { useRef, useEffect, useState, useCallback } from 'react';
import './VideoCard.css';
import VideoHeader from '../VideoHeader/VideoHeader';
import VideoFooter from '../VideoFooter/VideoFooter';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

const VideoCard = ({ url, likes, shares, channel, song, avatarSrc, isMuted, onMutePress, volume, onVolumeChange }) => {
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

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'm' || event.key === 'M') {
            onMutePress();
        }
    }, [onMutePress]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

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
    /*React’s state management and the DOM are separate. While React manages state, you often need 
    to interact with the actual DOM elements for certain properties that aren't directly handled by 
    React (like the muted property of a video element). In this case, the useEffect hook ensures 
    that whenever the isMuted state changes, the actual video element's muted property is updated 
    to reflect that state. This keeps the DOM in sync with the React state. */

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume / 100;
        }
    }, [volume]);

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
            <div className='volumeControlContainer'>
                <button className='muteButton' onClick={onMutePress}>
                    {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={onVolumeChange}
                    className="volumeControl__slider"
                />
            </div>
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
