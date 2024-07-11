import React, { useRef, useEffect, useState, useCallback } from 'react';
import './VideoCard.css';
import VideoHeader from '../VideoHeader/VideoHeader';
import VideoFooter from '../VideoFooter/VideoFooter';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

const VideoCard = ({ url, likes, shares, channel, song, avatarSrc }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(50);
    const videoRef = useRef(null);

    const onVideoPress = useCallback(() => {
        if (isVideoPlaying) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        } else {
            videoRef.current.play();
            setIsVideoPlaying(true);
        }
    }, [isVideoPlaying]);

    const handleMutePress = useCallback(() => {
        setIsMuted((prevIsMuted) => {
            const newMutedState = !prevIsMuted;
            setVolume(newMutedState ? 0 : 50);
            return newMutedState;
        });
    }, []);

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume / 100;
            if (newVolume === 0) {
                setIsMuted(true);
            } else {
                setIsMuted(false);
            }
        }
    };

    const handleKeyPress = useCallback((event) => {
        if (event.key === 'm' || event.key === 'M') {
            handleMutePress();
        } else if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'K' || event.key === 'k' ) {
            onVideoPress();
        }
    }, [handleMutePress, onVideoPress]);

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
                <button className='muteButton' onClick={handleMutePress}>
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
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
