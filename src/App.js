import React, { useState, useEffect } from 'react';
import './App.css';
import VideoCard from './Components/VideoCard/VideoCard';
import db from './Components/FireBaseConfig/FirebaseConfig';

function App() {
    const [reels, setReels] = useState([]);
    const [isMuted, setIsMuted] = useState(true); 
    useEffect(() => {
        const unsubscribe = db.collection('reels').onSnapshot(snapshot => {
            setReels(snapshot.docs.map(doc => doc.data()));
        });
        return () => unsubscribe();
    }, []);

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="app">
            <div className="app__videos">
                {reels.map((reel, index) => (
                    <VideoCard
                        key={index}
                        channel={reel.channel}
                        song={reel.song}
                        url={reel.url}
                        likes={reel.likes}
                        shares={reel.shares}
                        isMuted={isMuted}
                        onMutePress={handleMuteToggle}
                        avatarSrc={reel.avatarSrc}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
