import Metamask from './metamask';
import App from './App';
import { useState } from 'react';

const Main = () => {

    const [isConnected, setIsConnected] = useState(false);

    return(
        <>
        {!isConnected ? <Metamask isConnected={isConnected} setIsConnected={setIsConnected} />
        : <App setIsConnected={setIsConnected} />}
        </>
    )

}

export default Main;