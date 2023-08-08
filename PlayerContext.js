import { createContext, useState } from "react";

const Player = createContext();

function PlayerContext({ children }) {

    const [currentTrack, setCurrentTrack] = useState(null)
    return (
        <Player.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </Player.Provider>
    )
}

export { PlayerContext, Player }